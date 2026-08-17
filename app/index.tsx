import { router } from "expo-router";
import { useEffect } from "react";

import SplashScreen from "@/components/authentication/SplashScreen";
import { ROUTES } from "@/constants/navigation";
import { useAuthStore } from "@/store/authStore";

const SPLASH_DURATION_MS = 2000;

/**
 * Entry route. Renders the Splash Screen for at least
 * {@link SPLASH_DURATION_MS}, then replaces this route with Home if a
 * session was already resolved by AuthProvider, or Welcome otherwise —
 * so the user can never navigate back to the splash.
 *
 * If AuthProvider's initial `getSession()` call hasn't resolved yet once
 * the splash duration elapses (status still "loading"), this waits for it
 * to settle rather than guessing — the effect re-runs when `status`
 * changes and only navigates once it's no longer "loading".
 */
export default function Index() {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(status === "authenticated" ? ROUTES.HOME : ROUTES.HOME);
    }, 1500);

    return () => clearTimeout(timer);
  }, [status]);


  return <SplashScreen />;
}
