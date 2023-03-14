"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../lib/index");
const ErrorCode_1 = require("../lib/ErrorCode");
const JasmineIonErrorValidator_1 = require("./JasmineIonErrorValidator");
describe('DidKey', () => __awaiter(void 0, void 0, void 0, function* () {
    describe('generateEs256kOperationKeyPair()', () => __awaiter(void 0, void 0, void 0, function* () {
        it('should create a key pair successfully.', () => __awaiter(void 0, void 0, void 0, function* () {
            const [publicKey, privateKey] = yield index_1.DidKey.generateEs256kOperationKeyPair();
            expect(Object.keys(publicKey).length).toEqual(4);
            expect(Object.keys(privateKey).length).toEqual(5);
            expect(publicKey.d).toBeUndefined();
            expect(privateKey.d).toBeDefined();
            expect(publicKey.crv).toEqual(privateKey.crv);
            expect(publicKey.kty).toEqual(privateKey.kty);
            expect(publicKey.x).toEqual(privateKey.x);
            expect(publicKey.y).toEqual(privateKey.y);
        }));
    }));
    describe('generateEs256kDidDocumentKeyPair()', () => __awaiter(void 0, void 0, void 0, function* () {
        it('should create a key pair successfully.', () => __awaiter(void 0, void 0, void 0, function* () {
            const keyId = 'anyId';
            const [didDocumentPublicKey, privateKey] = yield index_1.DidKey.generateEs256kDidDocumentKeyPair({ id: keyId, purposes: [index_1.IonPublicKeyPurpose.Authentication] });
            expect(didDocumentPublicKey.id).toEqual(keyId);
            expect(didDocumentPublicKey.purposes).toEqual([index_1.IonPublicKeyPurpose.Authentication]);
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
        }));
        it('should throw error if given DID Document key ID exceeds maximum length.', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 'superDuperLongDidDocumentKeyIdentifierThatExceedsMaximumLength'; // Overwrite with super long string.
            yield JasmineIonErrorValidator_1.default.expectIonErrorToBeThrownAsync(() => __awaiter(void 0, void 0, void 0, function* () { return index_1.DidKey.generateEs256kDidDocumentKeyPair({ id, purposes: [index_1.IonPublicKeyPurpose.Authentication] }); }), ErrorCode_1.default.IdTooLong);
        }));
        it('should throw error if given DID Document key ID is not using base64URL character set. ', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 'nonBase64urlString!';
            yield JasmineIonErrorValidator_1.default.expectIonErrorToBeThrownAsync(() => __awaiter(void 0, void 0, void 0, function* () { return index_1.DidKey.generateEs256kDidDocumentKeyPair({ id, purposes: [index_1.IonPublicKeyPurpose.Authentication] }); }), ErrorCode_1.default.IdNotUsingBase64UrlCharacterSet);
        }));
        it('should allow DID Document key to not have a purpose defined.', () => __awaiter(void 0, void 0, void 0, function* () {
            const [publicKeyModel1] = yield index_1.DidKey.generateEs256kDidDocumentKeyPair({ id: 'id1', purposes: [] });
            expect(publicKeyModel1.id).toEqual('id1');
            expect(publicKeyModel1.purposes).toBeUndefined();
            const [publicKeyModel2] = yield index_1.DidKey.generateEs256kDidDocumentKeyPair({ id: 'id2' });
            expect(publicKeyModel2.id).toEqual('id2');
            expect(publicKeyModel2.purposes).toBeUndefined();
        }));
        it('should throw error if given DID Document key has duplicated purposes.', () => __awaiter(void 0, void 0, void 0, function* () {
            yield JasmineIonErrorValidator_1.default.expectIonErrorToBeThrownAsync(() => __awaiter(void 0, void 0, void 0, function* () { return index_1.DidKey.generateEs256kDidDocumentKeyPair({ id: 'anyId', purposes: [index_1.IonPublicKeyPurpose.Authentication, index_1.IonPublicKeyPurpose.Authentication] }); }), ErrorCode_1.default.PublicKeyPurposeDuplicated);
        }));
    }));
    describe('isJwkEs256k()', () => __awaiter(void 0, void 0, void 0, function* () {
        it('should return true for a JwkEs256K key', () => __awaiter(void 0, void 0, void 0, function* () {
            const [publicKey, privateKey] = yield index_1.DidKey.generateEs256kOperationKeyPair();
            expect(index_1.DidKey.isJwkEs256k(publicKey)).toBeTruthy();
            expect(index_1.DidKey.isJwkEs256k(privateKey)).toBeTruthy();
        }));
        it('should return false for a JwkEd25519 key', () => __awaiter(void 0, void 0, void 0, function* () {
            const [publicKey, privateKey] = yield index_1.DidKey.generateEd25519OperationKeyPair();
            expect(index_1.DidKey.isJwkEs256k(publicKey)).toBeFalsy();
            expect(index_1.DidKey.isJwkEs256k(privateKey)).toBeFalsy();
        }));
    }));
    describe('generateEd25519OperationKeyPair()', () => __awaiter(void 0, void 0, void 0, function* () {
        it('should create a key pair successfully.', () => __awaiter(void 0, void 0, void 0, function* () {
            const [publicKey, privateKey] = yield index_1.DidKey.generateEd25519OperationKeyPair();
            expect(Object.keys(publicKey).length).toEqual(3);
            expect(Object.keys(privateKey).length).toEqual(4);
            expect(publicKey.d).toBeUndefined();
            expect(privateKey.d).toBeDefined();
            expect(publicKey.crv).toEqual(privateKey.crv);
            expect(publicKey.kty).toEqual(privateKey.kty);
            expect(publicKey.x).toEqual(privateKey.x);
        }));
    }));
    describe('generateEd25519DidDocumentKeyPair()', () => __awaiter(void 0, void 0, void 0, function* () {
        it('should create a key pair successfully.', () => __awaiter(void 0, void 0, void 0, function* () {
            const keyId = 'anyId';
            const [didDocumentPublicKey, privateKey] = yield index_1.DidKey.generateEd25519DidDocumentKeyPair({ id: keyId, purposes: [index_1.IonPublicKeyPurpose.Authentication] });
            expect(didDocumentPublicKey.id).toEqual(keyId);
            expect(didDocumentPublicKey.purposes).toEqual([index_1.IonPublicKeyPurpose.Authentication]);
            expect(didDocumentPublicKey.type).toEqual('JsonWebKey2020');
            expect(Object.keys(didDocumentPublicKey.publicKeyJwk).length).toEqual(3);
            expect(Object.keys(privateKey).length).toEqual(4);
            expect(privateKey.d).toBeDefined();
            const publicKey = didDocumentPublicKey.publicKeyJwk;
            expect(publicKey.d).toBeUndefined();
            expect(publicKey.crv).toEqual(privateKey.crv);
            expect(publicKey.kty).toEqual(privateKey.kty);
            expect(publicKey.x).toEqual(privateKey.x);
        }));
        it('should throw error if given DID Document key ID exceeds maximum length.', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 'superDuperLongDidDocumentKeyIdentifierThatExceedsMaximumLength'; // Overwrite with super long string.
            yield JasmineIonErrorValidator_1.default.expectIonErrorToBeThrownAsync(() => __awaiter(void 0, void 0, void 0, function* () { return index_1.DidKey.generateEd25519DidDocumentKeyPair({ id, purposes: [index_1.IonPublicKeyPurpose.Authentication] }); }), ErrorCode_1.default.IdTooLong);
        }));
        it('should throw error if given DID Document key ID is not using base64URL character set. ', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 'nonBase64urlString!';
            yield JasmineIonErrorValidator_1.default.expectIonErrorToBeThrownAsync(() => __awaiter(void 0, void 0, void 0, function* () { return index_1.DidKey.generateEd25519DidDocumentKeyPair({ id, purposes: [index_1.IonPublicKeyPurpose.Authentication] }); }), ErrorCode_1.default.IdNotUsingBase64UrlCharacterSet);
        }));
        it('should allow DID Document key to not have a purpose defined.', () => __awaiter(void 0, void 0, void 0, function* () {
            const [publicKeyModel1] = yield index_1.DidKey.generateEd25519DidDocumentKeyPair({ id: 'id1', purposes: [] });
            expect(publicKeyModel1.id).toEqual('id1');
            expect(publicKeyModel1.purposes).toBeUndefined();
            const [publicKeyModel2] = yield index_1.DidKey.generateEd25519DidDocumentKeyPair({ id: 'id2' });
            expect(publicKeyModel2.id).toEqual('id2');
            expect(publicKeyModel2.purposes).toBeUndefined();
        }));
        it('should throw error if given DID Document key has duplicated purposes.', () => __awaiter(void 0, void 0, void 0, function* () {
            yield JasmineIonErrorValidator_1.default.expectIonErrorToBeThrownAsync(() => __awaiter(void 0, void 0, void 0, function* () { return index_1.DidKey.generateEd25519DidDocumentKeyPair({ id: 'anyId', purposes: [index_1.IonPublicKeyPurpose.Authentication, index_1.IonPublicKeyPurpose.Authentication] }); }), ErrorCode_1.default.PublicKeyPurposeDuplicated);
        }));
    }));
    describe('isJwkEd25519()', () => __awaiter(void 0, void 0, void 0, function* () {
        it('should return false for a JwkEs256K key', () => __awaiter(void 0, void 0, void 0, function* () {
            const [publicKey, privateKey] = yield index_1.DidKey.generateEs256kOperationKeyPair();
            expect(index_1.DidKey.isJwkEd25519(publicKey)).toBeFalsy();
            expect(index_1.DidKey.isJwkEd25519(privateKey)).toBeFalsy();
        }));
        it('should return false for a JwkEd25519 key', () => __awaiter(void 0, void 0, void 0, function* () {
            const [publicKey, privateKey] = yield index_1.DidKey.generateEd25519OperationKeyPair();
            expect(index_1.DidKey.isJwkEd25519(publicKey)).toBeTruthy();
            expect(index_1.DidKey.isJwkEd25519(privateKey)).toBeTruthy();
        }));
    }));
}));
//# sourceMappingURL=DidKey.spec.js.map