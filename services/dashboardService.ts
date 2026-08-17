import { useAuthStore } from "@/store/authStore";
import { useProcessStore } from "@/store/processStore";
import type { StudentDashboardSummary } from "@/types/dashboard";

export async function fetchStudentDashboard(): Promise<StudentDashboardSummary> {
  const authUser = useAuthStore.getState().user;
  const { isRegistered, isPaymentSubmitted, isPaymentVerified } =
    useProcessStore.getState();

  // Short simulated delay for smooth loading
  await new Promise((resolve) => setTimeout(resolve, 300));

  const isFullySet = isPaymentVerified;

  return {
    registrationActive: isRegistered || isFullySet,
    paymentVerified: isFullySet,
    qrPassReady: isFullySet,
    registeredEvents: [
      {
        id: "evt-codecraft",
        title: "CodeCraft",
        category: "Coding",
        date: "2026-08-23",
        time: "09:00 AM",
        location: "Lab 404",
        status: isFullySet ? "registered" : "pending_payment",
      },
      {
        id: "evt-ai-innovators",
        title: "AI Innovators",
        category: "AI / ML",
        date: "2026-08-24",
        time: "10:30 AM",
        location: "Seminar Hall",
        status: isFullySet ? "registered" : "pending_payment",
      },
      {
        id: "evt-tech-quiz",
        title: "Tech Quiz",
        category: "Quiz",
        date: "2026-08-24",
        time: "02:00 PM",
        location: "Auditorium",
        status: "pending_payment",
      },
      {
        id: "evt-robowar",
        title: "RoboWars",
        category: "Robotics",
        date: "2026-08-25",
        time: "11:00 AM",
        location: "Ground Floor Arena",
        status: isFullySet ? "registered" : "pending_payment",
      },
    ],
    nextEvent: {
      id: "evt-ai-innovators",
      title: "AI Innovators",
      date: "2026-08-24",
      time: "10:30 AM",
      location: "Seminar Hall",
      daysRemaining: 1,
    },
    qrPassValue: isFullySet ? "ITF2026-PASS-8921-RPSIT" : null,
    paymentStatus: {
      status: isFullySet ? "verified" : isPaymentSubmitted ? "pending" : "none",
      message: isFullySet
        ? `Welcome, ${authUser?.fullName || "Delegate"}! Your payment is successfully verified.`
        : isPaymentSubmitted
        ? "Payment proof submitted! Verification in progress."
        : "Complete registration & payment to activate pass.",
    },
    certificateCount: isFullySet ? 1 : 0,
    todaySchedule: [
      {
        id: "sch-1",
        time: "09:30 AM",
        title: "Registration & Check-in",
        location: "Main Block",
      },
      {
        id: "sch-2",
        time: "11:00 AM",
        title: "AI Innovators",
        location: "Seminar Hall",
      },
      {
        id: "sch-3",
        time: "02:00 PM",
        title: "Tech Quiz",
        location: "Auditorium",
      },
    ],
    unreadNotificationCount: 3,
  };
}

