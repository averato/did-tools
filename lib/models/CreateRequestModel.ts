import DocumentModel from './DocumentModel.ts';
import OperationType from '../enums/OperationType.ts';

/**
 * Data model representing a public key in the DID Document.
 */
export default interface CreateRequestModel {
  type: OperationType;
  suffixData: {
    deltaHash: string;
    recoveryCommitment: string;
  };
  delta: {
    updateCommitment: string;
    patches: {
      action: string;
      document: DocumentModel;
    }[];
  }
}
