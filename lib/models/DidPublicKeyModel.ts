import PublicKeyPurpose from '../enums/PublicKeyPurpose.ts';

/**
 * Data model representing a public key in the DID Document.
 */
export default interface DidPublicKeyModel {
  id: string;
  type: string;
  publicKeyJwk: object;
  purposes?: PublicKeyPurpose[];
}
