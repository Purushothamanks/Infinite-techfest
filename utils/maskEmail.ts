const MASK_CHARACTER = "*";
const MAX_MASK_LENGTH = 5;

/**
 * Masks the local part of an email address for privacy-conscious display,
 * e.g. on the Verify Email screen, per
 * Designs/Authentication/5. Email Verification Screen.png.
 *
 * Keeps the first character of the local part, replaces the remainder
 * (capped at MAX_MASK_LENGTH characters) with asterisks, and leaves the
 * domain untouched.
 *
 * Examples:
 *   maskEmail("student@gmail.com") -> "s*****@gmail.com"
 *   maskEmail("phil@example.com")  -> "p***@example.com"
 *
 * Returns the trimmed input unchanged if it doesn't contain a usable
 * local part (e.g. missing "@" or empty local part).
 */
export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");

  if (atIndex <= 0) {
    return trimmed;
  }

  const localPart = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);
  const visibleCharacter = localPart.slice(0, 1);
  const maskLength = Math.min(
    Math.max(localPart.length - 1, 1),
    MAX_MASK_LENGTH,
  );

  return `${visibleCharacter}${MASK_CHARACTER.repeat(maskLength)}${domain}`;
}
