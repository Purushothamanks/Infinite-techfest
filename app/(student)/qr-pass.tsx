import { QrCode } from "lucide-react-native";

import { ComingSoonScreen } from "@/components/dashboard/ComingSoonScreen";

/**
 * Placeholder stub for the full-screen QR Pass view (see
 * constants/navigation.ts ROUTES.QR_PASS doc). Replace with the real
 * full-size QR pass screen once its design exists.
 */
export default function QrPassScreen() {
  return (
    <ComingSoonScreen
      title="Your QR Pass"
      description="Your full-size, scannable QR pass will appear here soon."
      icon={QrCode}
    />
  );
}
