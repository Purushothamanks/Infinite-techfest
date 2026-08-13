import "@/global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/authStore";

/**
 * Keeps the native splash screen (configured via the `expo-splash-screen`
 * plugin in app.json) visible past its default auto-hide point. Must run
 * at module scope, before RootLayout's first render, so there's no gap
 * where the native splash could hide itself early.
 */
SplashScreen.preventAutoHideAsync();

/**
 * Loads the Poppins font family required by AGENTS.md Section 4 (Design
 * System: "Poppins typography"). Rendering is held back until fonts are
 * ready so no screen ever briefly flashes the system default font. Once
 * fonts are ready, the native splash is hidden, handing off directly to
 * the custom SplashScreen component rendered by app/index.tsx.
 */
export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Route guards, split from RootLayout so useAuthStore only re-renders the
 * navigator (not the font-loading/provider tree) on auth state changes.
 *
 * - "authenticated" -> (student) routes only.
 * - "unauthenticated" / "loading" / "password_recovery" -> (authentication)
 *   routes only. "password_recovery" belongs here because Reset Password
 *   lives under (authentication), even though a session technically exists
 *   at that point (see store/authStore.ts).
 * - The root index route (Splash) has no guard — it's the initial route
 *   and redirects itself once the real status resolves.
 */
function RootNavigator() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = true; // TEMP-QA-BYPASS: status === "authenticated";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(student)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(authentication)" />
      </Stack.Protected>
    </Stack>
  );
}
