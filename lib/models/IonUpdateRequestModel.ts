import IonAddPublicKeysActionModel from './IonAddPublicKeysActionModel.ts';
import IonAddServicesActionModel from './IonAddServicesActionModel.ts';
import IonRemovePublicKeysActionModel from './IonRemovePublicKeysActionModel.ts';
import IonRemoveServicesActionModel from './IonRemoveServicesActionModel.ts';
import OperationType from '../enums/OperationType.ts';

/**
 * Data model representing a public key in the DID Document.
 */
export default interface IonUpdateRequestModel {
  type: OperationType;
  didSuffix: string;
  revealValue: string;
  delta: {
    updateCommitment: string,
    patches: (IonAddServicesActionModel | IonAddPublicKeysActionModel | IonRemoveServicesActionModel | IonRemovePublicKeysActionModel)[]
  },
  signedData: string
}
