import DidKey from '../lib/DidKey.ts';

(async () => {
  const [publicKey, privateKey] = await DidKey.generateEs256kOperationKeyPair();

  console.log(JSON.stringify(publicKey));
  console.log(JSON.stringify(privateKey));
})();
