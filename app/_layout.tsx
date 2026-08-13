import "@/global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/authStore";

SplashScreen.preventAutoHideAsync();

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
              <MobileViewportWrapper>
                <RootNavigator />
              </MobileViewportWrapper>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Mobile Viewport Wrapper:
 * Enforces a mobile device aspect ratio and frame on desktop web browsers,
 * while expanding 100% full screen on actual mobile devices and narrow viewports.
 */
function MobileViewportWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") {
    return <View className="flex-1 bg-background">{children}</View>;
  }

  return (
    <View className="flex-1 w-full h-full bg-slate-900 items-center justify-center">
      <View className="w-full max-w-[430px] h-full sm:h-[92vh] sm:max-h-[920px] bg-background sm:rounded-[36px] sm:shadow-2xl overflow-hidden sm:border-4 sm:border-slate-800 flex-1">
        {children}
      </View>
    </View>
  );
}

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
