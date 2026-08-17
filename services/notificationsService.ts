export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: "Announcement" | "Registration" | "Payment" | "Schedule";
  isRead: boolean;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Registration Confirmed!",
    message: "You have successfully registered for CodeCraft & AI Innovators.",
    timestamp: "10 mins ago",
    category: "Registration",
    isRead: false
  },
  {
    id: "notif-2",
    title: "Payment Verification Successful",
    message: "Your payment proof (UTR: 429810294812) has been verified by the accounts desk.",
    timestamp: "1 hour ago",
    category: "Payment",
    isRead: false
  },
  {
    id: "notif-3",
    title: "Inauguration Keynote Speaker Announced",
    message: "Dr. A. Sivathanu Pillai will deliver the Chief Guest address on Day 1 at 09:30 AM in the Main Auditorium.",
    timestamp: "3 hours ago",
    category: "Announcement",
    isRead: false
  },
  {
    id: "notif-4",
    title: "Schedule Updated: RoboWars Arena",
    message: "RoboWars safety inspection starts at 10:00 AM on Day 2 in Ground Floor Arena.",
    timestamp: "Yesterday",
    category: "Schedule",
    isRead: true
  },
  {
    id: "notif-5",
    title: "Welcome to Infinite Techfest 2026",
    message: "Welcome to RPSIT's national technical symposium! Generate your QR pass from the dashboard.",
    timestamp: "2 days ago",
    category: "Announcement",
    isRead: true
  }
];

export async function fetchNotifications(): Promise<NotificationItem[]> {
  await new Promise((res) => setTimeout(res, 150));
  return MOCK_NOTIFICATIONS;
}
