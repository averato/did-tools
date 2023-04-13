/**
 * Interface for signing an arbitrary object.
 */
export default interface ISigner {
  /**
   * Signs the given content as a compact JWS string.
   */
  sign (header: Record<string, unknown>, content: Record<string, unknown>): Promise<string>;
}
