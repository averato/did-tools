"use strict";
exports.__esModule = true;
var ErrorCode_1 = require("./ErrorCode");
var IonError_1 = require("./IonError");
var base64_1 = require("multiformats/bases/base64");
/**
 * Class that encodes binary blobs into strings.
 * Note that the encode/decode methods may change underlying encoding scheme.
 */
var Encoder = /** @class */ (function () {
    function Encoder() {
    }
    /**
     * Encodes given bytes into a Base64URL string.
     */
    Encoder.encode = function (content) {
        var encodedContent = base64_1.base64url.baseEncode(content);
        return encodedContent;
    };
    /**
     * Decodes the given Base64URL string into bytes.
     */
    Encoder.decodeAsBytes = function (encodedContent, inputContextForErrorLogging) {
        if (!Encoder.isBase64UrlString(encodedContent)) {
            throw new IonError_1["default"](ErrorCode_1["default"].EncodedStringIncorrectEncoding, "Given ".concat(inputContextForErrorLogging, " must be base64url string."));
        }
        return base64_1.base64url.baseDecode(encodedContent);
    };
    /**
     * Decodes the given Base64URL string into the original string.
     */
    Encoder.decodeAsString = function (encodedContent, inputContextForErrorLogging) {
        var rawBytes = Encoder.decodeAsBytes(encodedContent, inputContextForErrorLogging);
        return Encoder.bytesToString(rawBytes);
    };
    /**
     * Tests if the given string is a Base64URL string.
     */
    Encoder.isBase64UrlString = function (input) {
        // NOTE:
        // /<expression>/ denotes regex.
        // ^ denotes beginning of string.
        // $ denotes end of string.
        // + denotes one or more characters.
        var isBase64UrlString = /^[A-Za-z0-9_-]+$/.test(input);
        return isBase64UrlString;
    };
    /**
     * Converts input string to bytes.
     */
    Encoder.stringToBytes = function (input) {
        var bytes = new TextEncoder().encode(input);
        return bytes;
    };
    /**
     * Converts bytes to string.
     */
    Encoder.bytesToString = function (input) {
        var output = new TextDecoder().decode(input);
        return output;
    };
    return Encoder;
}());
exports["default"] = Encoder;
