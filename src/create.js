import { anchor, DID, generateKeyPair, resolve } from './index.js';

// Generate keys and ION DID
const authKeys = await generateKeyPair();

console.log(`Your Key Pair is: ${JSON.stringify(authKeys)}`); 

const did = new DID({
  content: {
    publicKeys: [
      {
        id: 'key-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyJwk: authKeys.publicJwk,
        purposes: ['authentication']
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

// Did long and short URI
const longFormURI  = await did.getURI();
const shortFormURI = await did.getURI('short');

console.log(`Your long DiD URI is: ${longFormURI}`);
console.log(`Your short DiD is: ${shortFormURI}`);

// Generate and publish create request to an ION node
const createRequest = await did.generateRequest(0);
const anchorResponse = await anchor(createRequest);
const respBody = await anchorResponse.json();
console.log(`Your DID is: ${JSON.stringify(respBody)}`);

// Store the key material and source data of all operations that have been created for the DID
const didOps = await did.getAllOperations();
await Deno.writeTextFile('./did-ops-v1.json', JSON.stringify({ ops: didOps }));

//Reolve DiD
const resolvedDiD = await resolve(longFormURI);
console.log(`Yuor Resolved DiD: ${JSON.stringify(resolvedDiD)}`);
