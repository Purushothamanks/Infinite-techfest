import * as Linking from "expo-linking";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { ROUTES } from "@/constants/navigation";
import { supabase } from "@/lib/supabase";
import { exchangeConfirmationCode } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { mapSupabaseUser } from "@/utils/mapSupabaseUser";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Central auth/session provider. Composed once in app/_layout.tsx.
 *
 * Responsibilities (per AGENTS.md Section 7 — screens/hooks never call
 * Supabase directly):
 * 1. Resolves the persisted session on mount via `getSession()`.
 * 2. Subscribes to `onAuthStateChange()` for the app's lifetime, keeping
 *    store/authStore.ts in sync with sign-in/sign-out/token-refresh events.
 * 3. Watches for an incoming email-confirmation deep link
 *    (`infinitetechfest://verify-email?code=...`) and exchanges the PKCE
 *    `code` for a session via `exchangeCodeForSession`. The resulting
 *    `SIGNED_IN` event sets status "authenticated", and the root layout's
 *    Stack.Protected guard handles the redirect to Home on its own — this
 *    works even if the app was fully closed.
 *
 *    Password recovery deliberately does NOT use a deep link: email
 *    clients like Gmail prefetch/scan links for safety, which silently
 *    burns a PKCE recovery code before the user ever taps it. Instead, the
 *    recovery email delivers a 6-digit OTP that ResetEmailSentScreen.tsx
 *    submits via `verifyRecoveryOtp()`, whose success directly triggers
 *    the `PASSWORD_RECOVERY` branch below (no deep link involved).
 *
 * Renders children immediately; screens read `status === "loading"` from
 * the store themselves if they need a loading state (the root layout's
 * Stack.Protected guards use the same store).
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
  const setPasswordRecovery = useAuthStore(
    (state) => state.setPasswordRecovery,
  );

  // Deep link URLs can be delivered more than once (cold start + the
  // useLinkingURL() hook re-firing) — track the last one handled so the
  // confirmation code isn't exchanged twice (a PKCE code is single-use and
  // the second attempt would just surface a confusing error).
  const handledConfirmationUrlRef = useRef<string | null>(null);

  // 1 & 2: resolve persisted session, then keep it in sync.
  useEffect(() => {
    let isSubscribed = true;

    const timeoutId = setTimeout(() => {
      if (isSubscribed && useAuthStore.getState().status === "loading") {
        setUnauthenticated();
      }
    }, 800);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeoutId);
        if (!isSubscribed) return;
        if (session) {
          setAuthenticated(mapSupabaseUser(session.user));
        } else {
          setUnauthenticated();
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        if (isSubscribed) setUnauthenticated();
      });


    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          setPasswordRecovery(mapSupabaseUser(session.user));
          router.replace(ROUTES.RESET_PASSWORD);
          return;
        }

        if (event === "SIGNED_OUT") {
          setUnauthenticated();
          return;
        }

        if (session) {
          setAuthenticated(mapSupabaseUser(session.user));
        } else {
          setUnauthenticated();
        }
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, [setAuthenticated, setUnauthenticated, setPasswordRecovery]);

  // 3: watch for an incoming email-confirmation deep link and exchange its
  // code.
  const linkingUrl = Linking.useLinkingURL();

  useEffect(() => {
    if (!linkingUrl || linkingUrl === handledConfirmationUrlRef.current) {
      return;
    }

    const { path, queryParams } = Linking.parse(linkingUrl);
    const code = queryParams?.code;

    if (path !== "verify-email" || typeof code !== "string") {
      return;
    }

    handledConfirmationUrlRef.current = linkingUrl;
    void exchangeConfirmationCode(code);
    // On success, exchangeCodeForSession triggers a SIGNED_IN event — the
    // root layout's Stack.Protected guard redirects to Home on its own. On
    // failure (expired/reused link), the user stays wherever they are.
  }, [linkingUrl]);

  return children;
}
