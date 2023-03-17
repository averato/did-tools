import DidRequest from './DidRequest';
import Encoder from './Encoder';
import DidDocumentModel from './models/DidDocumentModel';
import IonSdkConfig from './IonSdkConfig';
import JsonCanonicalizer from './JsonCanonicalizer';
import JwkEs256k from './models/JwkEs256k';
import Multihash from './Multihash';

/**
 * Class containing DID related operations.
 */
export default class AdaDid {
  /**
   * Creates a long-form DID.
   * @param input.document The initial state to be associate with the ION DID to be created using a `replace` document patch action.
   */
  public static async createLongFormDid (input: {
    recoveryKey: JwkEs256k;
    updateKey: JwkEs256k;
    document: DidDocumentModel;
  }): Promise<string> {
    const createRequest = await DidRequest.createCreateRequest(input);

    const didUniqueSuffix = await AdaDid.computeDidUniqueSuffix(createRequest.suffixData);

    // Add the network portion if not configured for mainnet.
    let shortFormDid;
    if (IonSdkConfig.network === undefined ||
        IonSdkConfig.network === 'mainnet') {
      shortFormDid = `did:ada:${didUniqueSuffix}`;
    } else {
      shortFormDid = `did:ada:${IonSdkConfig.network}:${didUniqueSuffix}`;
    }

    const initialState = {
      suffixData: createRequest.suffixData,
      delta: createRequest.delta
    };

    // Initial state must be canonicalized as per spec.
    const canonicalizedInitialStateBytes = JsonCanonicalizer.canonicalizeAsBytes(initialState);
    const encodedCanonicalizedInitialStateString = Encoder.encode(canonicalizedInitialStateBytes);
    const longFormDid = `${shortFormDid}:${encodedCanonicalizedInitialStateString}`;

    return longFormDid;
  }

  /**
   * Computes the DID unique suffix given the encoded suffix data string.
   */
  private static async computeDidUniqueSuffix (suffixData: object): Promise<string> {
    const canonicalizedStringBytes = JsonCanonicalizer.canonicalizeAsBytes(suffixData);
    const multihash = await Multihash.hash(canonicalizedStringBytes, IonSdkConfig.hashAlgorithmInMultihashCode);
    const encodedMultihash = Encoder.encode(multihash);
    return encodedMultihash;
  }
}
