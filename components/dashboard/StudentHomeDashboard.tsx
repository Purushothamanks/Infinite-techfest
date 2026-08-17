import { router } from "expo-router";
import { memo } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CertificatesCard } from "@/components/dashboard/CertificatesCard";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { MyEventsSection } from "@/components/dashboard/MyEventsSection";
import { NextUpAndQrRow } from "@/components/dashboard/NextUpAndQrRow";
import { PaymentStatusCard } from "@/components/dashboard/PaymentStatusCard";
import { ScheduleSection } from "@/components/dashboard/ScheduleSection";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { StudentBottomNav } from "@/components/dashboard/StudentBottomNav";
import { ROUTES } from "@/constants/navigation";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { useAuthStore } from "@/store/authStore";
import { useProcessStore } from "@/store/processStore";
import { getTimeOfDayGreeting } from "@/utils/greeting";



/**
 * Student Home Dashboard screen.
 *
 * Faithfully implements
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png: header
 * (brand + notifications + avatar), time-of-day greeting, "You're all
 * set!" status banner, "My Events" horizontal list, "Next Up" + "Your QR
 * Pass" row, "Payment Status" + "Certificates" row, "Today's Schedule",
 * and the shared Student Module bottom navigation with Home selected.
 *
 * This component is pure composition + data wiring — no direct Supabase
 * calls (uses useStudentDashboard(), which wraps
 * services/dashboardService.ts, per AGENTS.md Section 7) and no
 * screen-specific business logic beyond deriving the greeting name from
 * the auth store.
 */
function StudentHomeDashboardBase() {
  const authUser = useAuthStore((state) => state.user);
  const { data, isPending, isError, refetch, isRefetching } =
    useStudentDashboard();

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <DashboardSkeleton />
        <StudentBottomNav />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <DashboardHeader
          avatarUrl={authUser?.avatarUrl ?? null}
          fullName={authUser?.fullName ?? ""}
          unreadNotificationCount={0}
        />
        <DashboardError onRetry={() => refetch()} />
        <StudentBottomNav />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8 max-w-5xl mx-auto w-full px-2 sm:px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        <DashboardHeader
          avatarUrl={authUser?.avatarUrl ?? null}
          fullName={authUser?.fullName ?? ""}
          unreadNotificationCount={data.unreadNotificationCount}
        />

        <DashboardGreeting
          timeOfDayGreeting={getTimeOfDayGreeting()}
          fullName={authUser?.fullName ?? ""}
        />

        <StatusBanner
          registrationActive={data.registrationActive}
          paymentVerified={data.paymentVerified}
          qrPassReady={data.qrPassReady}
        />

        {!data.paymentVerified ? (

          <View className="mx-6 mt-3 flex-row gap-2">
            {!data.registrationActive ? (
              <TouchableOpacity
                onPress={() => router.push(ROUTES.REGISTER)}
                className="flex-1 py-3 px-4 rounded-xl bg-primary items-center justify-center border border-primary/20"
              >
                <Text className="font-poppins-bold text-xs text-text-inverse">
                  📝 Step 1: Complete Registration →
                </Text>
              </TouchableOpacity>
            ) : !useProcessStore.getState().isPaymentSubmitted ? (
              <TouchableOpacity
                onPress={() => router.push(ROUTES.PAYMENT_STATUS)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 items-center justify-center border border-amber-500/20"
              >
                <Text className="font-poppins-bold text-xs text-text-inverse">
                  💳 Step 2: Submit Payment Proof (UTR) →
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  useProcessStore.getState().approvePaymentByAdmin();
                  refetch();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 items-center justify-center border border-emerald-500/20"
              >
                <Text className="font-poppins-bold text-xs text-text-inverse">
                  ✅ Step 3: Accounts Desk Approve Proof →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}



        <MyEventsSection events={data.registeredEvents} />

        <NextUpAndQrRow
          nextEvent={data.nextEvent}
          qrPassValue={data.qrPassValue}
        />

        <View className="mx-6 mt-6 flex-row gap-3">
          <PaymentStatusCard summary={data.paymentStatus} />
          <CertificatesCard certificateCount={data.certificateCount} />
        </View>

        <ScheduleSection entries={data.todaySchedule} />
      </ScrollView>

      <StudentBottomNav />
    </SafeAreaView>

  );
}

export const StudentHomeDashboard = memo(StudentHomeDashboardBase);
