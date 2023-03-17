// NOTE: Aliases to classes and interfaces are used for external consumption.

// SDK exports.
import AdaDid from './AdaDid';
import AdaNetwork from './enums/AdaNetwork';
import DidKey from './DidKey';
import DidRequest from './DidRequest';
import DidDocumentModel from './models/DidDocumentModel';
import DidPublicKeyModel from './models/DidPublicKeyModel';
import IonPublicKeyPurpose from './enums/IonPublicKeyPurpose';
import IonSdkConfig from './IonSdkConfig';
import DidServiceModel from './models/DidServiceModel';
import ISigner from './interfaces/ISigner';
import JwkEd25519 from './models/JwkEd25519';
import JwkEs256k from './models/JwkEs256k';
import LocalSigner from './LocalSigner';

export {
  ISigner,
  AdaDid,
  DidDocumentModel,
  DidKey,
  AdaNetwork,
  DidPublicKeyModel,
  IonPublicKeyPurpose,
  DidRequest,
  IonSdkConfig,
  DidServiceModel,
  JwkEd25519,
  JwkEs256k,
  LocalSigner
};
