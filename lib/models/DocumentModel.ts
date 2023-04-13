import PublicKeyModel from './PublicKeyModel.ts';
import ServiceModel from './ServiceModel.ts';

/**
 * Defines the document structure used by ION.
 */
export default interface DocumentModel {
  publicKeys?: PublicKeyModel[];
  services?: ServiceModel[];
}
