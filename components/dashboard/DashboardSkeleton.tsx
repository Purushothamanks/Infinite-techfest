import { View } from "react-native";

import { SkeletonBlock } from "@/components/dashboard/SkeletonBlock";

/**
 * Polished loading state for the Student Home Dashboard — shown while
 * useStudentDashboard() (hooks/useStudentDashboard.ts) is fetching, per
 * the task brief's "Create a polished dashboard loading state... Do not
 * show a blank screen while data loads" requirement.
 *
 * Mirrors the real dashboard's layout (header, banner, events row, next
 * up + QR grid, payment + certificates grid, schedule) using pulsing
 * SkeletonBlock rectangles sized to match each section, so the loading
 * state reads as "this screen is loading" rather than a generic spinner.
 */
export function DashboardSkeleton() {
  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-6 pt-2">
        <SkeletonBlock className="h-9 w-40" />
        <View className="flex-row items-center gap-3">
          <SkeletonBlock className="h-11 w-11 rounded-full" />
          <SkeletonBlock className="h-11 w-11 rounded-full" />
        </View>
      </View>

      <View className="mt-6 px-6">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="mt-2 h-7 w-56" />
      </View>

      <SkeletonBlock className="mx-6 mt-5 h-28 rounded-2xl" />

      <View className="mt-6 px-6">
        <SkeletonBlock className="h-6 w-24" />
      </View>
      <View className="mt-3 flex-row gap-3 px-6">
        <SkeletonBlock className="h-40 w-48 rounded-2xl" />
        <SkeletonBlock className="h-40 w-48 rounded-2xl" />
      </View>

      <View className="mt-6 flex-row gap-3 px-6">
        <SkeletonBlock className="h-52 flex-1 rounded-2xl" />
        <SkeletonBlock className="h-52 flex-1 rounded-2xl" />
      </View>

      <View className="mt-6 flex-row gap-3 px-6">
        <SkeletonBlock className="h-32 flex-1 rounded-2xl" />
        <SkeletonBlock className="h-32 flex-1 rounded-2xl" />
      </View>

      <View className="mx-6 mt-6">
        <SkeletonBlock className="h-6 w-40" />
        <SkeletonBlock className="mt-3 h-40 rounded-2xl" />
      </View>
    </View>
  );
}
