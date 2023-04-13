import * as URI from 'npm:uri-js';
import ErrorCode from './ErrorCode.ts';
import ISigner from './interfaces/ISigner.ts';
import InputValidator from './InputValidator.ts';
import CreateRequestModel from './models/CreateRequestModel.ts';
import DeactivateRequestModel from './models/DeactivateRequestModel.ts';
import DocumentModel from './models/DocumentModel.ts';
import DidError from './DidError.ts';
import DidPublicKeyModel from './models/DidPublicKeyModel.ts';
import RecoverRequestModel from './models/RecoverRequestModel.ts';
import SdkConfig from './SdkConfig.ts';
import ServiceModel from './models/ServiceModel.ts';
import IonUpdateRequestModel from './models/IonUpdateRequestModel.ts';
import JsonCanonicalizer from './JsonCanonicalizer.ts';
import JwkEs256k from './models/JwkEs256k.ts';
import Multihash from './Multihash.ts';
import OperationKeyType from './enums/OperationKeyType.ts';
import OperationType from './enums/OperationType.ts';
import PatchAction from './enums/PatchAction.ts';

/**
 * Class containing operations related to Cardano Ada requests.
 */
export default class DidRequest {
  /**
   * Creates an ION DID create request.
   * @param input.document The initial state to be associate with the ION DID to be created using a `replace` document patch action.
   */
  public static async createCreateRequest (input: {
    recoveryKey: JwkEs256k;
    updateKey: JwkEs256k;
    document: DocumentModel;
  }): Promise<CreateRequestModel> {
    const recoveryKey = input.recoveryKey;
    const updateKey = input.updateKey;
    const didDocumentKeys = input.document.publicKeys;
    const services = input.document.services;

    // Validate recovery and update public keys.
    InputValidator.validateEs256kOperationKey(recoveryKey, OperationKeyType.Public);
    InputValidator.validateEs256kOperationKey(updateKey, OperationKeyType.Public);

    // Validate all given DID Document keys.
    DidRequest.validateDidDocumentKeys(didDocumentKeys);

    // Validate all given service.
    DidRequest.validateServices(services);

    const hashAlgorithmInMultihashCode = SdkConfig.hashAlgorithmInMultihashCode;

    const patches = [{
      action: PatchAction.Replace,
      document: input.document
    }];

    const delta = {
      updateCommitment: await Multihash.canonicalizeThenDoubleHashThenEncode(updateKey, hashAlgorithmInMultihashCode),
      patches
    };

    DidRequest.validateDeltaSize(delta);

    const deltaHash = await Multihash.canonicalizeThenHashThenEncode(delta, hashAlgorithmInMultihashCode);

    const suffixData = {
      deltaHash,
      recoveryCommitment: await Multihash.canonicalizeThenDoubleHashThenEncode(recoveryKey, hashAlgorithmInMultihashCode)
    };

    const operationRequest = {
      type: OperationType.Create,
      suffixData: suffixData,
      delta: delta
    };

    return operationRequest;
  }

  public static async createDeactivateRequest (input: {
    didSuffix: string,
    recoveryPublicKey: JwkEs256k,
    signer: ISigner
  }): Promise<DeactivateRequestModel> {
    // Validate DID suffix
    DidRequest.validateDidSuffix(input.didSuffix);

    // Validates recovery public key
    InputValidator.validateEs256kOperationKey(input.recoveryPublicKey, OperationKeyType.Public);

    const hashAlgorithmInMultihashCode = SdkConfig.hashAlgorithmInMultihashCode;
    const revealValue = await Multihash.canonicalizeThenHashThenEncode(input.recoveryPublicKey, hashAlgorithmInMultihashCode);

    const dataToBeSigned = {
      didSuffix: input.didSuffix,
      recoveryKey: input.recoveryPublicKey
    };

    const compactJws = await input.signer.sign({ alg: 'ES256K' }, dataToBeSigned);

    return {
      type: OperationType.Deactivate,
      didSuffix: input.didSuffix,
      revealValue: revealValue,
      signedData: compactJws
    };
  }

  public static async createRecoverRequest (input: {
    didSuffix: string,
    recoveryPublicKey: JwkEs256k,
    nextRecoveryPublicKey: JwkEs256k,
    nextUpdatePublicKey: JwkEs256k,
    document: DocumentModel,
    signer: ISigner
  }): Promise<RecoverRequestModel> {
    // Validate DID suffix
    DidRequest.validateDidSuffix(input.didSuffix);

    // Validate recovery public key
    InputValidator.validateEs256kOperationKey(input.recoveryPublicKey, OperationKeyType.Public);

    // Validate next recovery public key
    InputValidator.validateEs256kOperationKey(input.nextRecoveryPublicKey, OperationKeyType.Public);

    // Validate next update public key
    InputValidator.validateEs256kOperationKey(input.nextUpdatePublicKey, OperationKeyType.Public);

    // Validate all given DID Document keys.
    DidRequest.validateDidDocumentKeys(input.document.publicKeys);

    // Validate all given service.
    DidRequest.validateServices(input.document.services);

    const hashAlgorithmInMultihashCode = SdkConfig.hashAlgorithmInMultihashCode;
    const revealValue = await Multihash.canonicalizeThenHashThenEncode(input.recoveryPublicKey, hashAlgorithmInMultihashCode);

    const patches = [{
      action: PatchAction.Replace,
      document: input.document
    }];

    const nextUpdateCommitmentHash = await Multihash.canonicalizeThenDoubleHashThenEncode(input.nextUpdatePublicKey, hashAlgorithmInMultihashCode);
    const delta = {
      patches,
      updateCommitment: nextUpdateCommitmentHash
    };

    const deltaHash = await Multihash.canonicalizeThenHashThenEncode(delta, hashAlgorithmInMultihashCode);
    const nextRecoveryCommitmentHash = await Multihash.canonicalizeThenDoubleHashThenEncode(input.nextRecoveryPublicKey, hashAlgorithmInMultihashCode);

    const dataToBeSigned = {
      recoveryCommitment: nextRecoveryCommitmentHash,
      recoveryKey: input.recoveryPublicKey,
      deltaHash: deltaHash
    };

    const compactJws = await input.signer.sign({ alg: 'ES256K' }, dataToBeSigned);

    return {
      type: OperationType.Recover,
      didSuffix: input.didSuffix,
      revealValue: revealValue,
      delta: delta,
      signedData: compactJws
    };
  }

  public static async createUpdateRequest (input: {
    didSuffix: string;
    updatePublicKey: JwkEs256k;
    nextUpdatePublicKey: JwkEs256k;
    signer: ISigner;
    servicesToAdd?: ServiceModel[];
    idsOfServicesToRemove?: string[];
    publicKeysToAdd?: DidPublicKeyModel[];
    idsOfPublicKeysToRemove?: string[];
  }): Promise<IonUpdateRequestModel> {
    // Validate DID suffix
    DidRequest.validateDidSuffix(input.didSuffix);

    // Validate update public key
    InputValidator.validateEs256kOperationKey(input.updatePublicKey, OperationKeyType.Public);

    // Validate next update public key
    InputValidator.validateEs256kOperationKey(input.nextUpdatePublicKey, OperationKeyType.Public);

    // Validate all given service.
    DidRequest.validateServices(input.servicesToAdd);

    // Validate all given DID Document keys.
    DidRequest.validateDidDocumentKeys(input.publicKeysToAdd);

    // Validate all given service id to remove.
    if (input.idsOfServicesToRemove !== undefined) {
      for (const id of input.idsOfServicesToRemove) {
        InputValidator.validateId(id);
      }
    }

    // Validate all given public key id to remove.
    if (input.idsOfPublicKeysToRemove !== undefined) {
      for (const id of input.idsOfPublicKeysToRemove) {
        InputValidator.validateId(id);
      }
    }

    const patches = [];
    // Create patches for add services
    const servicesToAdd = input.servicesToAdd;
    if (servicesToAdd !== undefined && servicesToAdd.length > 0) {
      const patch = {
        action: PatchAction.AddServices,
        services: servicesToAdd
      };

      patches.push(patch);
    }

    // Create patches for remove services
    const idsOfServicesToRemove = input.idsOfServicesToRemove;
    if (idsOfServicesToRemove !== undefined && idsOfServicesToRemove.length > 0) {
      const patch = {
        action: PatchAction.RemoveServices,
        ids: idsOfServicesToRemove
      };

      patches.push(patch);
    }

    // Create patches for adding public keys
    const publicKeysToAdd = input.publicKeysToAdd;
    if (publicKeysToAdd !== undefined && publicKeysToAdd.length > 0) {
      const patch = {
        action: PatchAction.AddPublicKeys,
        publicKeys: publicKeysToAdd
      };

      patches.push(patch);
    }

    // Create patch for removing public keys
    const idsOfPublicKeysToRemove = input.idsOfPublicKeysToRemove;
    if (idsOfPublicKeysToRemove !== undefined && idsOfPublicKeysToRemove.length > 0) {
      const patch = {
        action: PatchAction.RemovePublicKeys,
        ids: idsOfPublicKeysToRemove
      };

      patches.push(patch);
    }

    const hashAlgorithmInMultihashCode = SdkConfig.hashAlgorithmInMultihashCode;
    const revealValue = await Multihash.canonicalizeThenHashThenEncode(input.updatePublicKey, hashAlgorithmInMultihashCode);

    const nextUpdateCommitmentHash = await Multihash.canonicalizeThenDoubleHashThenEncode(input.nextUpdatePublicKey, hashAlgorithmInMultihashCode);
    const delta = {
      patches,
      updateCommitment: nextUpdateCommitmentHash
    };
    const deltaHash = await Multihash.canonicalizeThenHashThenEncode(delta, hashAlgorithmInMultihashCode);

    const dataToBeSigned = {
      updateKey: input.updatePublicKey,
      deltaHash
    };

    const compactJws = await input.signer.sign({ alg: 'ES256K' }, dataToBeSigned);

    return {
      type: OperationType.Update,
      didSuffix: input.didSuffix,
      revealValue,
      delta,
      signedData: compactJws
    };
  }

  private static validateDidSuffix (didSuffix: string) {
    Multihash.validateEncodedHashComputedUsingSupportedHashAlgorithm(didSuffix, 'didSuffix');
  }

  private static validateDidDocumentKeys (publicKeys?: DidPublicKeyModel[]) {
    if (publicKeys === undefined) {
      return;
    }

    // Validate each public key.
    const publicKeyIdSet: Set<string> = new Set();
    for (const publicKey of publicKeys) {
      if (Array.isArray(publicKey.publicKeyJwk)) {
        throw new DidError(ErrorCode.DidDocumentPublicKeyMissingOrIncorrectType, `DID Document key 'publicKeyJwk' property is not a non-array object.`);
      }

      InputValidator.validateId(publicKey.id);

      // 'id' must be unique across all given keys.
      if (publicKeyIdSet.has(publicKey.id)) {
        throw new DidError(ErrorCode.DidDocumentPublicKeyIdDuplicated, `DID Document key with ID '${publicKey.id}' already exists.`);
      }
      publicKeyIdSet.add(publicKey.id);

      InputValidator.validatePublicKeyPurposes(publicKey.purposes);
    }
  }

  private static validateServices (services?: ServiceModel[]) {
    if (services !== undefined && services.length !== 0) {
      const serviceIdSet: Set<string> = new Set();
      for (const service of services) {
        DidRequest.validateService(service);
        if (serviceIdSet.has(service.id)) {
          throw new DidError(ErrorCode.DidDocumentServiceIdDuplicated, 'Service id has to be unique');
        }
        serviceIdSet.add(service.id);
      }
    }
  }

  private static validateService (service: ServiceModel) {
    InputValidator.validateId(service.id);

    const maxTypeLength = 30;
    if (service.type.length > maxTypeLength) {
      const errorMessage = `Service endpoint type length ${service.type.length} exceeds max allowed length of ${maxTypeLength}.`;
      throw new DidError(ErrorCode.ServiceTypeTooLong, errorMessage);
    }

    // Throw error if `serviceEndpoint` is an array.
    if (Array.isArray(service.serviceEndpoint)) {
      const errorMessage = 'Service endpoint value cannot be an array.';
      throw new DidError(ErrorCode.ServiceEndpointCannotBeAnArray, errorMessage);
    }

    if (typeof service.serviceEndpoint === 'string') {
      const uri = URI.parse(service.serviceEndpoint);
      if (uri.error !== undefined) {
        throw new DidError(ErrorCode.ServiceEndpointStringNotValidUri, `Service endpoint string '${service.serviceEndpoint}' is not a URI.`);
      }
    }
  }

  private static validateDeltaSize (delta: Record<string, unknown>) {
    const deltaBytes = JsonCanonicalizer.canonicalizeAsBytes(delta);
    if (deltaBytes.length > SdkConfig.maxCanonicalizedDeltaSizeInBytes) {
      const errorMessage = `Delta of ${deltaBytes.length} bytes exceeded limit of ${SdkConfig.maxCanonicalizedDeltaSizeInBytes} bytes.`;
      throw new DidError(ErrorCode.DeltaExceedsMaximumSize, errorMessage);
    }
  }
}
