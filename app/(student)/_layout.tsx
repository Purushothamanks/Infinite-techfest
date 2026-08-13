import { Stack } from "expo-router";

/**
 * Layout for the (student) route group. Screens here are only reachable
 * once authenticated — see the Stack.Protected guard in the root
 * app/_layout.tsx.
 */
export default function StudentLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
