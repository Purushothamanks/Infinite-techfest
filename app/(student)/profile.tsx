import { router } from "expo-router";
import { ArrowLeft, LogOut, User } from "lucide-react-native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ROUTES } from "@/constants/navigation";
import { signOut } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/theme";

const BACK_ICON_SIZE = 22;
const CONTENT_ICON_SIZE = 30;
const SIGN_OUT_ICON_SIZE = 18;

/**
 * Placeholder stub for the Profile screen (see
 * constants/navigation.ts ROUTES.PROFILE doc). Unlike the other
 * placeholder stubs, this one keeps the Sign Out action — it was moved
 * here from the old app/(student)/home.tsx placeholder now that Home
 * renders the real dashboard (which has no sign-out control in the
 * approved design). Replace with the real Profile screen once its design
 * exists; keep Sign Out available somewhere in that screen too.
 */
export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    router.replace(ROUTES.WELCOME);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="h-10 flex-row items-center px-6 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
          className="h-10 w-10 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <ArrowLeft size={BACK_ICON_SIZE} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <View className="h-16 w-16 items-center justify-center rounded-full border border-border bg-surface">
          <User size={CONTENT_ICON_SIZE} color={colors.primary} />
        </View>
        <Text className="mt-4 text-center font-poppins-bold text-lg text-primary">
          {user?.fullName || "Student"}
        </Text>
        <Text className="mt-1 text-center font-poppins-regular text-sm text-text-secondary">
          {user?.email ?? ""}
        </Text>
        <View className="mt-3 rounded-full bg-background px-4 py-1.5 border border-border">
          <Text className="font-poppins-semibold text-xs text-text-secondary">
            Full profile coming soon
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          disabled={isSigningOut}
          accessibilityRole="button"
          accessibilityLabel="Sign Out"
          accessibilityHint="Signs you out of your account"
          className={`mt-10 h-12 w-full flex-row items-center justify-center gap-2 rounded-full border border-primary bg-surface ${
            isSigningOut ? "opacity-60" : ""
          }`}
        >
          {isSigningOut ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <LogOut size={SIGN_OUT_ICON_SIZE} color={colors.primary} />
              <Text className="font-poppins-semibold text-sm text-primary">
                Sign Out
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
