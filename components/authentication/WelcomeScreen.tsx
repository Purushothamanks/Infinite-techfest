import { router } from "expo-router";
import { LogIn, Star, UserPlus } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";

const LOGO_ASSET = require("@/assets/images/Authentication/Infinite Techfest 2026 Logo Welcome Screen.jpeg");
const HERO_ASSET = require("@/assets/images/Authentication/hero illustration (White Background).png");

const BUTTON_ICON_SIZE = 20;
const DIVIDER_STAR_SIZE = 14;

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-2 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Content section */}
        <View className="items-center">
          <Image
            source={LOGO_ASSET}
            resizeMode="contain"
            style={{ width: 280, height: 75 }}
            accessibilityRole="image"
            accessibilityLabel="Infinite Techfest 2026 logo"
          />

          <Image
            source={HERO_ASSET}
            resizeMode="contain"
            style={{ width: "100%", height: 180, marginTop: 12 }}
            accessibilityRole="image"
            accessibilityLabel="Students and technology illustrations"
          />

          <View className="mt-4 items-center">
            <Text className="text-center font-poppins-bold text-2xl leading-8 text-primary">
              Innovate. <Text className="text-royalblue">Collaborate.</Text> <Text className="text-accent">Inspire.</Text>
            </Text>
          </View>

          <Text className="mt-2 max-w-[310px] text-center font-poppins-regular text-xs leading-5 text-text-secondary">
            Join the biggest technical symposium and participate in coding
            contests, hackathons, workshops, paper presentations, project expos,
            and technical competitions.
          </Text>
        </View>

        {/* Action section */}
        <View className="mt-6">
          <TouchableOpacity
            onPress={() => router.push(ROUTES.REGISTER)}
            accessibilityRole="button"
            accessibilityLabel="Create Account"
            className="h-13 flex-row items-center justify-center gap-2 rounded-full bg-primary"
          >
            <UserPlus size={BUTTON_ICON_SIZE} color={colors.text.inverse} />
            <Text className="font-poppins-semibold text-sm text-text-inverse">
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(ROUTES.LOGIN)}
            accessibilityRole="button"
            accessibilityLabel="Sign In"
            className="mt-3 h-13 flex-row items-center justify-center gap-2 rounded-full border border-primary bg-surface"
          >
            <LogIn size={BUTTON_ICON_SIZE} color={colors.primary} />
            <Text className="font-poppins-semibold text-sm text-primary">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Quick Demo Access Button */}
          <TouchableOpacity
            onPress={() => router.push(ROUTES.HOME)}
            accessibilityRole="button"
            accessibilityLabel="Explore Student Module"
            className="mt-3 h-12 flex-row items-center justify-center gap-2 rounded-full bg-accent/20 border border-accent"
          >
            <Text className="font-poppins-bold text-xs text-primary">
              ⚡ Explore Student Dashboard (Demo) →
            </Text>
          </TouchableOpacity>

          <View className="mt-5 flex-row items-center justify-center gap-3">
            <View className="h-px flex-1 bg-border" />
            <Star
              size={DIVIDER_STAR_SIZE}
              color={colors.accent}
              fill={colors.accent}
            />
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="mt-4 flex-row items-center justify-center gap-2">
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text className="font-poppins-regular text-xs text-primary">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text className="font-poppins-regular text-xs text-text-disabled">
              •
            </Text>
            <TouchableOpacity onPress={() => {}} accessibilityRole="link">
              <Text className="font-poppins-regular text-xs text-primary">
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 items-center">
            <Text className="font-poppins-regular text-[11px] text-text-secondary">
              Powered by
            </Text>
            <Text className="mt-0.5 font-poppins-semibold text-xs text-primary">
              R.P. Sarathy Institute of Technology
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
