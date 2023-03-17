import DidPublicKeyModel from './DidPublicKeyModel';

export default interface IonAddPublicKeysActionModel {
    action: string;
    publicKeys: DidPublicKeyModel[];
}
