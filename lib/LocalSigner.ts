import * as Secp256k1 from 'npm:secp256k1';
import Encoder from './Encoder.ts';
import ISigner from './interfaces/ISigner.ts';
import InputValidator from './InputValidator.ts';
import JwkEs256k from './models/JwkEs256k.ts';
import OperationKeyType from './enums/OperationKeyType.ts';
import { base64url } from 'npm:multiformats/bases/base64';
import { sha256 } from 'npm:multiformats/hashes/sha2';

/**
 * An ISigner implementation that uses a given local private key.
 */
export default class LocalSigner implements ISigner {
  /**
   * Creates a new local signer using the given private key.
   */
  public static create (privateKey: JwkEs256k): ISigner {
    return new LocalSigner(privateKey);
  }

  private constructor (private privateKey: JwkEs256k) {
    InputValidator.validateEs256kOperationKey(privateKey, OperationKeyType.Private);
  }

  public async sign (header: Record<string, unknown>, content: Record<string, unknown>): Promise<string> {
    const headerString = JSON.stringify(header);
    const headerBytes = Encoder.stringToBytes(headerString);
    const encodedHeader = base64url.baseEncode(headerBytes);

    const payloadString = JSON.stringify(content);
    const payloadBytes = Encoder.stringToBytes(payloadString);
    const encodedPayload = base64url.baseEncode(payloadBytes);

    const signingContentString = `${encodedHeader}.${encodedPayload}`;
    const signingContentBytes = Encoder.stringToBytes(signingContentString);
    const contentHash = await sha256.encode(signingContentBytes);

    const privateKeyBytes = base64url.baseDecode(this.privateKey.d!);
    const signature = await Secp256k1.sign(contentHash, privateKeyBytes, { der: false });

    const encodedSignature = base64url.baseEncode(signature);

    const compactJws = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
    return compactJws;
  }
}
