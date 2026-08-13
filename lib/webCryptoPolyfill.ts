import * as ExpoCrypto from "expo-crypto";

/**
 * Polyfills `crypto.subtle.digest` (and `crypto.getRandomValues` if missing)
 * using expo-crypto's native implementation.
 *
 * React Native's Hermes engine has no built-in WebCrypto API. Without this,
 * @supabase/auth-js silently downgrades its PKCE flow (used by email
 * confirmation and password reset deep links, per AGENTS.md Section 3) from
 * the `S256` code challenge method to the weaker `plain` method, logging:
 * "WebCrypto API is not supported. Code challenge method will default to
 * use plain instead of sha256."
 *
 * Must be imported and invoked before any Supabase auth call is made.
 * See lib/supabase.ts.
 */

const algorithmNameMap: Record<string, ExpoCrypto.CryptoDigestAlgorithm> = {
  "SHA-1": ExpoCrypto.CryptoDigestAlgorithm.SHA1,
  "SHA-256": ExpoCrypto.CryptoDigestAlgorithm.SHA256,
  "SHA-384": ExpoCrypto.CryptoDigestAlgorithm.SHA384,
  "SHA-512": ExpoCrypto.CryptoDigestAlgorithm.SHA512,
};

async function digest(
  algorithm: AlgorithmIdentifier,
  data: BufferSource,
): Promise<ArrayBuffer> {
  const algorithmName =
    typeof algorithm === "string" ? algorithm : algorithm.name;
  const expoAlgorithm = algorithmNameMap[algorithmName.toUpperCase()];

  if (!expoAlgorithm) {
    throw new Error(`Unsupported digest algorithm: ${algorithmName}`);
  }

  return ExpoCrypto.digest(expoAlgorithm, data);
}

export function polyfillWebCrypto(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target = globalThis as any;

  if (typeof target.crypto === "undefined") {
    target.crypto = {};
  }

  if (typeof target.crypto.subtle === "undefined") {
    target.crypto.subtle = { digest };
  }

  if (typeof target.crypto.getRandomValues === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target.crypto.getRandomValues = (array: any) =>
      ExpoCrypto.getRandomValues(array);
  }
}
