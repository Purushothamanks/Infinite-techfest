import * as IntentLauncher from "expo-intent-launcher";
import { Linking, Platform } from "react-native";

/** Generic launcher action, paired with the APP_EMAIL category below to
 * resolve to the default email app's launcher activity. Passed as a raw
 * string since it isn't one of the Settings-screen values in
 * IntentLauncher.ActivityAction. See
 * https://developer.android.com/reference/android/content/Intent#ACTION_MAIN */
const ANDROID_MAIN_ACTION = "android.intent.action.MAIN";

/** Android intent category that resolves to the device's default email
 * app's home/inbox screen, as opposed to "mailto:" which always opens a
 * compose screen. See
 * https://developer.android.com/reference/android/content/Intent#CATEGORY_APP_EMAIL */
const ANDROID_APP_EMAIL_CATEGORY = "android.intent.category.APP_EMAIL";

/**
 * Opens the device's default email application's home screen (inbox),
 * not a compose/send screen. Used by the Verify Email screen's
 * "Open Email App" action per
 * Designs/Authentication/5. Email Verification Screen.png.
 *
 * On Android, launches an intent with the APP_EMAIL category, which the OS
 * routes to the default mail app's launcher activity. On iOS, there's no
 * equivalent public API to open the Mail app directly, so it falls back to
 * the "message:" scheme (opens the Mail app's inbox).
 *
 * Returns whether the email app could be opened, so the caller can show a
 * fallback if not (e.g. no mail app configured on the device).
 */
export async function openEmailApp(): Promise<boolean> {
  if (Platform.OS === "android") {
    try {
      await IntentLauncher.startActivityAsync(ANDROID_MAIN_ACTION, {
        category: ANDROID_APP_EMAIL_CATEGORY,
      });
      return true;
    } catch {
      return false;
    }
  }

  const messageUrl = "message:";

  try {
    const canOpen = await Linking.canOpenURL(messageUrl);
    if (!canOpen) {
      return false;
    }

    await Linking.openURL(messageUrl);
    return true;
  } catch {
    return false;
  }
}
