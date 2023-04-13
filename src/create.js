import { anchor, DID, generateKeyPair } from './index.js';
// import { writeFile } from 'npm:fs/promises';

// Generate keys and ION DID
const authnKeys = await generateKeyPair();
const did = new DID({
  content: {
    publicKeys: [
      {
        id: 'key-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyJwk: authnKeys.publicJwk,
        purposes: [ 'authentication' ]
      }
    ],
    services: [
      {
        id: 'domain-1',
        type: 'LinkedDomains',
        serviceEndpoint: 'https://foo.example.com'
      }
    ]
  }
});

// Generate and publish create request to an ION node
const createRequest = await did.generateRequest(0);
const _anchorResponse = await anchor(createRequest);

// Store the key material and source data of all operations that have been created for the DID
const didOps = await did.getAllOperations();
await Deno.writeTextFile('./did-ops-v1.json', JSON.stringify({ ops: didOps }));
