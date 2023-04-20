// NOTE: Aliases to classes and interfaces are used for external consumption.

// SDK exports.
import AdaDid from './AdaDid.ts';
import AdaNetwork from './enums/AdaNetwork.ts';
import DidKey from './DidKey.ts';
import DidRequest from './DidRequest.ts';
import type DocumentModel from './models/DocumentModel.ts';
import type PublicKeyModel from './models/PublicKeyModel.ts';
import PublicKeyPurpose from './enums/PublicKeyPurpose.ts';
import SdkConfig from './SdkConfig.ts';
import type ServiceModel from './models/ServiceModel.ts';
import type ISigner from './interfaces/ISigner.ts';
import type JwkEd25519 from './models/JwkEd25519.ts';
import type JwkEs256k from './models/JwkEs256k.ts';
import LocalSigner from './LocalSigner.ts';

export {
  ISigner,
  AdaDid,
  DocumentModel,
  DidKey,
  AdaNetwork,
  PublicKeyModel,
  PublicKeyPurpose,
  DidRequest,
  SdkConfig,
  ServiceModel,
  JwkEd25519,
  JwkEs256k,
  LocalSigner
};
