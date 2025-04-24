/**
 * A simplified version of the cn utility function that doesn't require external dependencies
 * This function combines multiple class names into a single string, filtering out falsy values
 */
export function cn(...inputs) {
    return inputs.flat().filter(Boolean).join(" ").trim()
  }
  