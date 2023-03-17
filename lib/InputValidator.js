"use strict";
exports.__esModule = true;
var Encoder_1 = require("./Encoder");
var ErrorCode_1 = require("./ErrorCode");
var IonError_1 = require("./IonError");
var OperationKeyType_1 = require("./enums/OperationKeyType");
/**
 * Class containing input validation methods.
 */
var InputValidator = /** @class */ (function () {
    function InputValidator() {
    }
    /**
     * Validates the schema of a ES256K JWK key.
     */
    InputValidator.validateEs256kOperationKey = function (operationKeyJwk, operationKeyType) {
        var allowedProperties = new Set(['kty', 'crv', 'x', 'y']);
        if (operationKeyType === OperationKeyType_1["default"].Private) {
            allowedProperties.add('d');
        }
        for (var property in operationKeyJwk) {
            if (!allowedProperties.has(property)) {
                throw new IonError_1["default"](ErrorCode_1["default"].PublicKeyJwkEs256kHasUnexpectedProperty, "SECP256K1 JWK key has unexpected property '".concat(property, "'."));
            }
        }
        if (operationKeyJwk.crv !== 'secp256k1') {
            throw new IonError_1["default"](ErrorCode_1["default"].JwkEs256kMissingOrInvalidCrv, "SECP256K1 JWK 'crv' property must be 'secp256k1' but got '".concat(operationKeyJwk.crv, ".'"));
        }
        if (operationKeyJwk.kty !== 'EC') {
            throw new IonError_1["default"](ErrorCode_1["default"].JwkEs256kMissingOrInvalidKty, "SECP256K1 JWK 'kty' property must be 'EC' but got '".concat(operationKeyJwk.kty, ".'"));
        }
        // `x` and `y` need 43 Base64URL encoded bytes to contain 256 bits.
        if (operationKeyJwk.x.length !== 43) {
            throw new IonError_1["default"](ErrorCode_1["default"].JwkEs256kHasIncorrectLengthOfX, "SECP256K1 JWK 'x' property must be 43 bytes.");
        }
        if (operationKeyJwk.y.length !== 43) {
            throw new IonError_1["default"](ErrorCode_1["default"].JwkEs256kHasIncorrectLengthOfY, "SECP256K1 JWK 'y' property must be 43 bytes.");
        }
        if (operationKeyType === OperationKeyType_1["default"].Private && (operationKeyJwk.d === undefined || operationKeyJwk.d.length !== 43)) {
            throw new IonError_1["default"](ErrorCode_1["default"].JwkEs256kHasIncorrectLengthOfD, "SECP256K1 JWK 'd' property must be 43 bytes.");
        }
    };
    /**
     * Validates an `id` property (in `IonPublicKeyModel` and `IonServiceModel`).
     */
    InputValidator.validateId = function (id) {
        var maxIdLength = 50;
        if (id.length > maxIdLength) {
            throw new IonError_1["default"](ErrorCode_1["default"].IdTooLong, "Key ID length ".concat(id.length, " exceed max allowed length of ").concat(maxIdLength, "."));
        }
        if (!Encoder_1["default"].isBase64UrlString(id)) {
            throw new IonError_1["default"](ErrorCode_1["default"].IdNotUsingBase64UrlCharacterSet, "Key ID '".concat(id, "' is not a Base64URL string."));
        }
    };
    /**
     * Validates the given public key purposes.
     */
    InputValidator.validatePublicKeyPurposes = function (purposes) {
        // Nothing to validate if `purposes` is undefined.
        if (purposes === undefined) {
            return;
        }
        // Validate that all purposes are be unique.
        var processedPurposes = new Set();
        for (var _i = 0, purposes_1 = purposes; _i < purposes_1.length; _i++) {
            var purpose = purposes_1[_i];
            if (processedPurposes.has(purpose)) {
                throw new IonError_1["default"](ErrorCode_1["default"].PublicKeyPurposeDuplicated, "Public key purpose '".concat(purpose, "' already specified."));
            }
            processedPurposes.add(purpose);
        }
    };
    return InputValidator;
}());
exports["default"] = InputValidator;
