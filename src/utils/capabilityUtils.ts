/**
 * Utilities for handling WebDriver capabilities
 */

/**
 * Checks if a value is effectively undefined (JavaScript undefined or string "undefined")
 * @param value Value to check
 * @returns Whether the value should be removed
 */
function isEffectivelyUndefined(value: any): boolean {
  return value === undefined || value === "undefined";
}

/**
 * Recursively removes undefined values from objects
 * Used to clean capabilities before sending to Appium
 * 
 * @param obj Object to clean
 * @returns Cleaned object without undefined values
 */
export function removeUndefined<T>(obj: Record<string, any>): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => !isEffectivelyUndefined(v))
      .map(([k, v]) => [
        k,
        v && typeof v === 'object' && !Array.isArray(v)
          ? removeUndefined(v)
          : v
      ])
  ) as T;
}

/**
 * Clean capabilities object before passing to Appium
 * Removes all keys with undefined values to prevent WebDriver protocol errors
 * 
 * @param capabilities The capabilities object to clean
 * @returns Cleaned capabilities object
 */
export function cleanCapabilities<T>(capabilities: Record<string, any>): T {
  return removeUndefined<T>(capabilities);
}

/**
 * Verifies capabilities don't contain any undefined values
 * This helps prevent "Invalid or unsupported WebDriver capabilities" errors
 * 
 * @param capabilities Capabilities object to verify
 * @returns true if clean, false if contains undefined values
 */
export function verifyCapabilities(capabilities: Record<string, any>): boolean {
  const stringified = JSON.stringify(capabilities);
  return !stringified.includes('undefined') && !stringified.includes('"undefined"');
}

/**
 * Returns subset of capabilities with specific keys removed
 * Useful for creating alternative configurations 
 * 
 * @param caps Original capabilities
 * @param keysToRemove Keys to remove from capabilities
 * @returns New capabilities object with specified keys removed
 */
export function removeCapabilityKeys<T>(caps: Record<string, any>, keysToRemove: string[]): T {
  const result = { ...caps };
  for (const key of keysToRemove) {
    delete result[key];
  }
  return result as T;
} 