import DidRequest from './DidRequest.ts';
import Encoder from './Encoder.ts';
import DocumentModel from './models/DocumentModel.ts';
import SdkConfig from './SdkConfig.ts';
import JsonCanonicalizer from './JsonCanonicalizer.ts';
import JwkEs256k from './models/JwkEs256k.ts';
import Multihash from './Multihash.ts';

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
    document: DocumentModel;
  }): Promise<string> {
    const createRequest = await DidRequest.createCreateRequest(input);

    const didUniqueSuffix = await AdaDid.computeDidUniqueSuffix(createRequest.suffixData);

    // Add the network portion if not configured for mainnet.
    let shortFormDid;
    if (SdkConfig.network === undefined ||
        SdkConfig.network === 'mainnet') {
      shortFormDid = `did:ada:${didUniqueSuffix}`;
    } else {
      shortFormDid = `did:ada:${SdkConfig.network}:${didUniqueSuffix}`;
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
  private static async computeDidUniqueSuffix (suffixData: Record<string, unknown>): Promise<string> {
    const canonicalizedStringBytes = JsonCanonicalizer.canonicalizeAsBytes(suffixData);
    const multihash = await Multihash.hash(canonicalizedStringBytes, SdkConfig.hashAlgorithmInMultihashCode);
    const encodedMultihash = Encoder.encode(multihash);
    return encodedMultihash;
  }
}
