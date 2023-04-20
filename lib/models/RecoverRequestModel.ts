import DocumentModel from './DocumentModel.ts';
import OperationType from '../enums/OperationType.ts';

/**
 * Data model representing a public key in the DID Document.
 */
export default interface RecoverRequestModel {
  type: OperationType;
  didSuffix: string;
  revealValue: string;
  delta: {
    updateCommitment: string,
    patches: {
        action: string,
        document: DocumentModel;
    }[]
  },
  signedData: string
}
