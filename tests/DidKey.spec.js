import { DidKey, IonPublicKeyPurpose } from '../lib/index';
import ErrorCode from '../lib/ErrorCode';
import JasmineIonErrorValidator from './JasmineIonErrorValidator';
describe('DidKey', async () => {
    describe('generateEs256kOperationKeyPair()', async () => {
        it('should create a key pair successfully.', async () => {
            const [publicKey, privateKey] = await DidKey.generateEs256kOperationKeyPair();
            expect(Object.keys(publicKey).length).toEqual(4);
            expect(Object.keys(privateKey).length).toEqual(5);
            expect(publicKey.d).toBeUndefined();
            expect(privateKey.d).toBeDefined();
            expect(publicKey.crv).toEqual(privateKey.crv);
            expect(publicKey.kty).toEqual(privateKey.kty);
            expect(publicKey.x).toEqual(privateKey.x);
            expect(publicKey.y).toEqual(privateKey.y);
        });
    });
    describe('generateEs256kDidDocumentKeyPair()', async () => {
        it('should create a key pair successfully.', async () => {
            const keyId = 'anyId';
            const [didDocumentPublicKey, privateKey] = await DidKey.generateEs256kDidDocumentKeyPair({ id: keyId, purposes: [IonPublicKeyPurpose.Authentication] });
            expect(didDocumentPublicKey.id).toEqual(keyId);
            expect(didDocumentPublicKey.purposes).toEqual([IonPublicKeyPurpose.Authentication]);
            expect(didDocumentPublicKey.type).toEqual('EcdsaSecp256k1VerificationKey2019');
            expect(Object.keys(didDocumentPublicKey.publicKeyJwk).length).toEqual(4);
            expect(Object.keys(privateKey).length).toEqual(5);
            expect(privateKey.d).toBeDefined();
            const publicKey = didDocumentPublicKey.publicKeyJwk;
            expect(publicKey.d).toBeUndefined();
            expect(publicKey.crv).toEqual(privateKey.crv);
            expect(publicKey.kty).toEqual(privateKey.kty);
            expect(publicKey.x).toEqual(privateKey.x);
            expect(publicKey.y).toEqual(privateKey.y);
        });
        it('should throw error if given DID Document key ID exceeds maximum length.', async () => {
            const id = 'superDuperLongDidDocumentKeyIdentifierThatExceedsMaximumLength'; // Overwrite with super long string.
            await JasmineIonErrorValidator.expectIonErrorToBeThrownAsync(async () => DidKey.generateEs256kDidDocumentKeyPair({ id, purposes: [IonPublicKeyPurpose.Authentication] }), ErrorCode.IdTooLong);
        });
        it('should throw error if given DID Document key ID is not using base64URL character set. ', async () => {
            const id = 'nonBase64urlString!';
            await JasmineIonErrorValidator.expectIonErrorToBeThrownAsync(async () => DidKey.generateEs256kDidDocumentKeyPair({ id, purposes: [IonPublicKeyPurpose.Authentication] }), ErrorCode.IdNotUsingBase64UrlCharacterSet);
        });
        it('should allow DID Document key to not have a purpose defined.', async () => {
            const [publicKeyModel1] = await DidKey.generateEs256kDidDocumentKeyPair({ id: 'id1', purposes: [] });
            expect(publicKeyModel1.id).toEqual('id1');
            expect(publicKeyModel1.purposes).toBeUndefined();
            const [publicKeyModel2] = await DidKey.generateEs256kDidDocumentKeyPair({ id: 'id2' });
            expect(publicKeyModel2.id).toEqual('id2');
            expect(publicKeyModel2.purposes).toBeUndefined();
        });
        it('should throw error if given DID Document key has duplicated purposes.', async () => {
            await JasmineIonErrorValidator.expectIonErrorToBeThrownAsync(async () => DidKey.generateEs256kDidDocumentKeyPair({ id: 'anyId', purposes: [IonPublicKeyPurpose.Authentication, IonPublicKeyPurpose.Authentication] }), ErrorCode.PublicKeyPurposeDuplicated);
        });
    });
    describe('isJwkEs256k()', async () => {
        it('should return true for a JwkEs256K key', async () => {
            const [publicKey, privateKey] = await DidKey.generateEs256kOperationKeyPair();
            expect(DidKey.isJwkEs256k(publicKey)).toBeTruthy();
            expect(DidKey.isJwkEs256k(privateKey)).toBeTruthy();
        });
        it('should return false for a JwkEd25519 key', async () => {
            const [publicKey, privateKey] = await DidKey.generateEd25519OperationKeyPair();
            expect(DidKey.isJwkEs256k(publicKey)).toBeFalsy();
            expect(DidKey.isJwkEs256k(privateKey)).toBeFalsy();
        });
    });
    describe('generateEd25519OperationKeyPair()', async () => {
        it('should create a key pair successfully.', async () => {
            const [publicKey, privateKey] = await DidKey.generateEd25519OperationKeyPair();
            expect(Object.keys(publicKey).length).toEqual(3);
            expect(Object.keys(privateKey).length).toEqual(4);
            expect(publicKey.d).toBeUndefined();
            expect(privateKey.d).toBeDefined();
            expect(publicKey.crv).toEqual(privateKey.crv);
            expect(publicKey.kty).toEqual(privateKey.kty);
            expect(publicKey.x).toEqual(privateKey.x);
        });
    });
    describe('generateEd25519DidDocumentKeyPair()', async () => {
        it('should create a key pair successfully.', async () => {
            const keyId = 'anyId';
            const [didDocumentPublicKey, privateKey] = await DidKey.generateEd25519DidDocumentKeyPair({ id: keyId, purposes: [IonPublicKeyPurpose.Authentication] });
            expect(didDocumentPublicKey.id).toEqual(keyId);
            expect(didDocumentPublicKey.purposes).toEqual([IonPublicKeyPurpose.Authentication]);
            expect(didDocumentPublicKey.type).toEqual('JsonWebKey2020');
            expect(Object.keys(didDocumentPublicKey.publicKeyJwk).length).toEqual(3);
            expect(Object.keys(privateKey).length).toEqual(4);
            expect(privateKey.d).toBeDefined();
            const publicKey = didDocumentPublicKey.publicKeyJwk;
            expect(publicKey.d).toBeUndefined();
            expect(publicKey.crv).toEqual(privateKey.crv);
            expect(publicKey.kty).toEqual(privateKey.kty);
            expect(publicKey.x).toEqual(privateKey.x);
        });
        it('should throw error if given DID Document key ID exceeds maximum length.', async () => {
            const id = 'superDuperLongDidDocumentKeyIdentifierThatExceedsMaximumLength'; // Overwrite with super long string.
            await JasmineIonErrorValidator.expectIonErrorToBeThrownAsync(async () => DidKey.generateEd25519DidDocumentKeyPair({ id, purposes: [IonPublicKeyPurpose.Authentication] }), ErrorCode.IdTooLong);
        });
        it('should throw error if given DID Document key ID is not using base64URL character set. ', async () => {
            const id = 'nonBase64urlString!';
            await JasmineIonErrorValidator.expectIonErrorToBeThrownAsync(async () => DidKey.generateEd25519DidDocumentKeyPair({ id, purposes: [IonPublicKeyPurpose.Authentication] }), ErrorCode.IdNotUsingBase64UrlCharacterSet);
        });
        it('should allow DID Document key to not have a purpose defined.', async () => {
            const [publicKeyModel1] = await DidKey.generateEd25519DidDocumentKeyPair({ id: 'id1', purposes: [] });
            expect(publicKeyModel1.id).toEqual('id1');
            expect(publicKeyModel1.purposes).toBeUndefined();
            const [publicKeyModel2] = await DidKey.generateEd25519DidDocumentKeyPair({ id: 'id2' });
            expect(publicKeyModel2.id).toEqual('id2');
            expect(publicKeyModel2.purposes).toBeUndefined();
        });
        it('should throw error if given DID Document key has duplicated purposes.', async () => {
            await JasmineIonErrorValidator.expectIonErrorToBeThrownAsync(async () => DidKey.generateEd25519DidDocumentKeyPair({ id: 'anyId', purposes: [IonPublicKeyPurpose.Authentication, IonPublicKeyPurpose.Authentication] }), ErrorCode.PublicKeyPurposeDuplicated);
        });
    });
    describe('isJwkEd25519()', async () => {
        it('should return false for a JwkEs256K key', async () => {
            const [publicKey, privateKey] = await DidKey.generateEs256kOperationKeyPair();
            expect(DidKey.isJwkEd25519(publicKey)).toBeFalsy();
            expect(DidKey.isJwkEd25519(privateKey)).toBeFalsy();
        });
        it('should return false for a JwkEd25519 key', async () => {
            const [publicKey, privateKey] = await DidKey.generateEd25519OperationKeyPair();
            expect(DidKey.isJwkEd25519(publicKey)).toBeTruthy();
            expect(DidKey.isJwkEd25519(privateKey)).toBeTruthy();
        });
    });
});
//# sourceMappingURL=DidKey.spec.js.map