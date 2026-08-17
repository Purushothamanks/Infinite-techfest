import "@/global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme";

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

function MobileViewportWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") {
    return <View style={styles.nativeContainer}>{children}</View>;
  }

  return (
    <View style={styles.webOuterBackground}>
      <View style={styles.webResponsiveFrame}>{children}</View>
    </View>
  );
}

function RootNavigator() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = status === "authenticated";

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

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webOuterBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#0A1128",
    alignItems: "center",
    justifyContent: "center",
  },
  webResponsiveFrame: {
    flex: 1,
    width: "100%",
    maxWidth: 1280,
    height: "100%",
    backgroundColor: colors.background,
    overflow: "hidden",
    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.4)",
  },
});

