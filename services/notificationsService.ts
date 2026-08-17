import { useProcessStore } from "@/store/processStore";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: "Announcement" | "Registration" | "Payment" | "Schedule";
  isRead: boolean;
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  await new Promise((res) => setTimeout(res, 150));
  const { isRegistered, isPaymentSubmitted, isPaymentVerified } =
    useProcessStore.getState();

  const list: NotificationItem[] = [];

  // Add process notification only if user actually completed payment verification
  if (isPaymentVerified) {
    list.push({
      id: "notif-verified-real",
      title: "Payment Verified & Pass Active! 🎉",
      message:
        "Your payment proof (UTR: 429810294812) has been verified by the accounts desk. Receipt #ITF-8921 issued.",
      timestamp: "Just now",
      category: "Payment",
      isRead: false,
    });
  } else if (isPaymentSubmitted) {
    list.push({
      id: "notif-pending-real",
      title: "Payment Verification Underway ⏳",
      message:
        "Your submitted UTR reference (429810294812) is currently being verified by the RPSIT accounts team.",
      timestamp: "10 mins ago",
      category: "Payment",
      isRead: false,
    });
  }

  if (isRegistered) {
    list.push({
      id: "notif-reg-real",
      title: "Registration Initiated 📝",
      message:
        "You have submitted your registration for CodeCraft, AI Innovators, and RoboWars.",
      timestamp: "15 mins ago",
      category: "Registration",
      isRead: false,
    });
  }

  // Real Event Schedule, Start & End Timers
  list.push(
    {
      id: "notif-event-codecraft-start",
      title: "⏰ Event Starting Soon: CodeCraft",
      message:
        "CodeCraft competitive programming starts in 30 minutes (09:00 AM) at Lab 404, CSE Block. Present your QR pass at hall entry.",
      timestamp: "08:30 AM Today",
      category: "Schedule",
      isRead: false,
    },
    {
      id: "notif-event-ai-start",
      title: "🚀 Event Alert: AI Innovators Hackathon",
      message:
        "AI Innovators live prototype presentation starts at 10:30 AM in Seminar Hall, IT Block. Team check-in open.",
      timestamp: "09:45 AM Today",
      category: "Schedule",
      isRead: false,
    },
    {
      id: "notif-event-quiz-end",
      title: "⏳ Event Closing: Mind Bytes Tech Quiz",
      message:
        "Tech Quiz preliminary written round concludes at 04:30 PM in Main Auditorium. Top 6 finalists will be announced at 05:00 PM.",
      timestamp: "04:00 PM Today",
      category: "Schedule",
      isRead: true,
    },
    {
      id: "notif-announcement-keynote",
      title: "📢 Keynote Address: Main Auditorium",
      message:
        "Chief Guest Dr. A. Sivathanu Pillai will deliver the inaugural keynote on Day 1 at 09:30 AM.",
      timestamp: "Yesterday",
      category: "Announcement",
      isRead: true,
    },
    {
      id: "notif-welcome",
      title: "Welcome to Infinite Techfest 2026",
      message:
        "Welcome to RPSIT's national technical symposium! Complete registration & payment to activate your scannable QR pass.",
      timestamp: "2 days ago",
      category: "Announcement",
      isRead: true,
    }
  );

  return list;
}

