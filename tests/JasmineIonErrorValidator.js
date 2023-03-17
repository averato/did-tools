import IonError from '../lib/IonError';
/**
 * Encapsulates the helper functions for the tests.
 */
export default class JasmineIonErrorValidator {
    /**
     * Fails the current spec if the execution of the function does not throw the expected IonError.
     *
     * @param functionToExecute The function to execute.
     * @param expectedErrorCode The expected error code.
     */
    static expectIonErrorToBeThrown(functionToExecute, expectedErrorCode) {
        let validated = false;
        try {
            functionToExecute();
        }
        catch (e) {
            if (e instanceof IonError) {
                expect(e.code).toEqual(expectedErrorCode);
                validated = true;
            }
        }
        if (!validated) {
            fail(`Expected error '${expectedErrorCode}' did not occur.`);
        }
    }
    /**
     * Fails the current spec if the execution of the function does not throw the expected IonError.
     *
     * @param functionToExecute The function to execute.
     * @param expectedErrorCode The expected error code.
     */
    static async expectIonErrorToBeThrownAsync(functionToExecute, expectedErrorCode) {
        let validated = false;
        try {
            await functionToExecute();
        }
        catch (e) {
            if (e instanceof IonError) {
                expect(e.code).toEqual(expectedErrorCode);
                validated = true;
            }
        }
        if (!validated) {
            fail(`Expected error '${expectedErrorCode}' did not occur.`);
        }
    }
}
//# sourceMappingURL=JasmineIonErrorValidator.js.map