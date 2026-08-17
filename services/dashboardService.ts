import { useAuthStore } from "@/store/authStore";
import type { StudentDashboardSummary } from "@/types/dashboard";

export async function fetchStudentDashboard(): Promise<StudentDashboardSummary> {
  const authUser = useAuthStore.getState().user;

  // Short simulated delay for smooth skeleton loading
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    ...MOCK_DASHBOARD_SUMMARY,
    paymentStatus: {
      status: "verified",
      message: `Welcome, ${authUser?.fullName || "Delegate"}! Your payment is verified.`,
    },
  };
}

const MOCK_DASHBOARD_SUMMARY: StudentDashboardSummary = {
  registrationActive: true,
  paymentVerified: true,
  qrPassReady: true,
  registeredEvents: [
    {
      id: "evt-codecraft",
      title: "CodeCraft",
      category: "Coding",
      date: "2026-08-23",
      time: "09:00 AM",
      location: "Lab 404",
      status: "registered",
    },
    {
      id: "evt-ai-innovators",
      title: "AI Innovators",
      category: "AI / ML",
      date: "2026-08-24",
      time: "10:30 AM",
      location: "Seminar Hall",
      status: "registered",
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
      status: "registered",
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
  qrPassValue: "ITF2026-PASS-DEMO-0001",
  paymentStatus: {
    status: "verified",
    message: "Your payment has been successfully verified.",
  },
  certificateCount: 0,
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
