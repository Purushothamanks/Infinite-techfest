import { Stack } from "expo-router";

/**
 * Layout for the (authentication) route group. Required so expo-router
 * recognizes "(authentication)" as a named group that the root
 * app/_layout.tsx Stack.Protected guard can target — without this file the
 * group has no route entry and the guard silently matches nothing (see
 * "No route named "(authentication)" exists in nested children" warning).
 * Screens here are only reachable while unauthenticated (or mid password
 * recovery) — see the Stack.Protected guard in the root app/_layout.tsx.
 */
export default function AuthenticationLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
