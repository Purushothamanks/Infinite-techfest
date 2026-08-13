import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupportedStorage } from "@supabase/supabase-js";

import { env } from "@/config/env";
import { polyfillWebCrypto } from "@/lib/webCryptoPolyfill";

// Must run before any Supabase auth call generates a PKCE code challenge.
polyfillWebCrypto();

/**
 * AsyncStorage's web implementation reads/writes `window.localStorage`
 * directly with no `typeof window` guard (see
 * node_modules/@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.js).
 * On native this is harmless — React Native's setUpGlobals.js polyfills
 * `global.window = global` — but Expo's static web export
 * (app.json -> `web.output: "static"`) prerenders every route in Node,
 * where `window` does not exist at all.
 *
 * GoTrueClient (Supabase's auth client) auto-initializes on construction
 * and immediately tries to recover a persisted session via `storage`, so
 * merely importing this module during prerendering crashed the entire
 * `expo export --platform web` with `ReferenceError: window is not
 * defined`.
 *
 * This adapter delegates to AsyncStorage unchanged on native and in real
 * browsers (`typeof window !== "undefined"` there in both cases). It only
 * short-circuits to a safe no-op when `window` is unavailable, i.e. during
 * Node-based static prerendering — there is no persisted session to
 * recover at build time, so resolving to "not found" is the correct,
 * crash-free behavior instead of touching `window`.
 */
const ssrSafeAsyncStorage: SupportedStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") {
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (typeof window === "undefined") {
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof window === "undefined") {
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  },
};

/**
 * Supabase client instance for auth, database, and storage access.
 * Import this everywhere Supabase is needed instead of creating new clients.
 *
 * Uses AsyncStorage (via the SSR-safe adapter above) for session
 * persistence. Auth flows (Email + Password only, per AGENTS.md Section 3)
 * are implemented in features/auth and services/, never called directly
 * from screens.
 */
export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: ssrSafeAsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      // PKCE (not the default 'implicit' flow) is required for secure,
      // single-use email confirmation / password recovery links on native.
      // The recovery deep link carries a `code` query param that
      // AuthProvider exchanges via supabase.auth.exchangeCodeForSession().
      flowType: "pkce",
    },
  },
);
