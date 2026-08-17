import { useLocalSearchParams } from "expo-router";
import { CalendarDays } from "lucide-react-native";

import { ComingSoonScreen } from "@/components/dashboard/ComingSoonScreen";

/**
 * Placeholder stub for Event Details (see
 * constants/navigation.ts eventDetailsRoute() doc). Replace with the real
 * Event Details screen once its design exists. `eventId` is read but not
 * yet used — kept here so the dynamic segment resolves and future
 * implementation can fetch the event by id.
 */
export default function EventDetailsScreen() {
  useLocalSearchParams<{ eventId: string }>();

  return (
    <ComingSoonScreen
      title="Event Details"
      description="Full event details will appear here soon."
      icon={CalendarDays}
    />
  );
}
