import OperationType from '../enums/OperationType.ts';

/**
 * Data model representing a public key in the DID Document.
 */
export default interface DeactivateRequestModel {
  type: OperationType;
  didSuffix: string;
  revealValue: string;
  signedData: string;
}
