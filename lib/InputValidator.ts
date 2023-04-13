import Encoder from './Encoder.ts';
import ErrorCode from './ErrorCode.ts';
import DidError from './DidError.ts';
import PublicKeyPurpose from './enums/PublicKeyPurpose.ts';
import JwkEs256k from './models/JwkEs256k.ts';
import OperationKeyType from './enums/OperationKeyType.ts';

/**
 * Class containing input validation methods.
 */
export default class InputValidator {
  /**
   * Validates the schema of a ES256K JWK key.
   */
  public static validateEs256kOperationKey (operationKeyJwk: JwkEs256k, operationKeyType: OperationKeyType) {
    const allowedProperties = new Set(['kty', 'crv', 'x', 'y']);
    if (operationKeyType === OperationKeyType.Private) {
      allowedProperties.add('d');
    }
    for (const property in operationKeyJwk) {
      if (!allowedProperties.has(property)) {
        throw new DidError(ErrorCode.PublicKeyJwkEs256kHasUnexpectedProperty, `SECP256K1 JWK key has unexpected property '${property}'.`);
      }
    }

    if (operationKeyJwk.crv !== 'secp256k1') {
      throw new DidError(ErrorCode.JwkEs256kMissingOrInvalidCrv, `SECP256K1 JWK 'crv' property must be 'secp256k1' but got '${operationKeyJwk.crv}.'`);
    }

    if (operationKeyJwk.kty !== 'EC') {
      throw new DidError(ErrorCode.JwkEs256kMissingOrInvalidKty, `SECP256K1 JWK 'kty' property must be 'EC' but got '${operationKeyJwk.kty}.'`);
    }

    // `x` and `y` need 43 Base64URL encoded bytes to contain 256 bits.
    if (operationKeyJwk.x.length !== 43) {
      throw new DidError(ErrorCode.JwkEs256kHasIncorrectLengthOfX, `SECP256K1 JWK 'x' property must be 43 bytes.`);
    }

    if (operationKeyJwk.y.length !== 43) {
      throw new DidError(ErrorCode.JwkEs256kHasIncorrectLengthOfY, `SECP256K1 JWK 'y' property must be 43 bytes.`);
    }

    if (operationKeyType === OperationKeyType.Private && (operationKeyJwk.d === undefined || operationKeyJwk.d.length !== 43)) {
      throw new DidError(ErrorCode.JwkEs256kHasIncorrectLengthOfD, `SECP256K1 JWK 'd' property must be 43 bytes.`);
    }
  }

  /**
   * Validates an `id` property (in `IonPublicKeyModel` and `IonServiceModel`).
   */
  public static validateId (id: string) {
    const maxIdLength = 50;
    if (id.length > maxIdLength) {
      throw new DidError(ErrorCode.IdTooLong, `Key ID length ${id.length} exceed max allowed length of ${maxIdLength}.`);
    }

    if (!Encoder.isBase64UrlString(id)) {
      throw new DidError(ErrorCode.IdNotUsingBase64UrlCharacterSet, `Key ID '${id}' is not a Base64URL string.`);
    }
  }

  /**
   * Validates the given public key purposes.
   */
  public static validatePublicKeyPurposes (purposes?: PublicKeyPurpose[]) {
    // Nothing to validate if `purposes` is undefined.
    if (purposes === undefined) {
      return;
    }

    // Validate that all purposes are be unique.
    const processedPurposes: Set<PublicKeyPurpose> = new Set();
    for (const purpose of purposes) {
      if (processedPurposes.has(purpose)) {
        throw new DidError(ErrorCode.PublicKeyPurposeDuplicated, `Public key purpose '${purpose}' already specified.`);
      }
      processedPurposes.add(purpose);
    }
  }
}
