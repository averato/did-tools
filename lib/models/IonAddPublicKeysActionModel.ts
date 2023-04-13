import PublicKeyModel from './PublicKeyModel.ts';

export default interface IonAddPublicKeysActionModel {
    action: string;
    publicKeys: PublicKeyModel[];
}
