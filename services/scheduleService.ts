export interface ScheduleSession {
  id: string;
  day: "Day 1" | "Day 2";
  date: string;
  time: string;
  title: string;
  category: "Keynote" | "Technical" | "Non-Technical" | "Workshop" | "General";
  location: string;
  speakerOrHost?: string;
  isBookmarked?: boolean;
}

export const MOCK_SCHEDULE: ScheduleSession[] = [
  {
    id: "sch-101",
    day: "Day 1",
    date: "2026-08-23",
    time: "08:30 AM - 09:30 AM",
    title: "Registration & Student Kit Distribution",
    category: "General",
    location: "Main Gate & Welcome Desk",
    speakerOrHost: "Organizing Committee",
    isBookmarked: true
  },
  {
    id: "sch-102",
    day: "Day 1",
    date: "2026-08-23",
    time: "09:30 AM - 10:30 AM",
    title: "Grand Inauguration Ceremony",
    category: "Keynote",
    location: "Main Auditorium",
    speakerOrHost: "Chief Guest Dr. A. Sivathanu Pillai (ISRO / BrahMos)",
    isBookmarked: true
  },
  {
    id: "sch-103",
    day: "Day 1",
    date: "2026-08-23",
    time: "10:30 AM - 01:00 PM",
    title: "CodeCraft Flagship Coding Round 1 & 2",
    category: "Technical",
    location: "Lab 404, CSE Block",
    speakerOrHost: "Dr. K. Ramanathan",
    isBookmarked: true
  },
  {
    id: "sch-104",
    day: "Day 1",
    date: "2026-08-23",
    time: "01:30 PM - 04:30 PM",
    title: "NexTech Paper Presentation",
    category: "Technical",
    location: "Conference Room B",
    speakerOrHost: "Dr. V. Meenakshi",
    isBookmarked: false
  },
  {
    id: "sch-105",
    day: "Day 1",
    date: "2026-08-23",
    time: "03:00 PM - 05:00 PM",
    title: "Hands-on Workshop: Building LLM Apps with Agentic Frameworks",
    category: "Workshop",
    location: "Lab 101, IT Block",
    speakerOrHost: "Google Tech Lead Guest Speaker",
    isBookmarked: true
  },
  {
    id: "sch-201",
    day: "Day 2",
    date: "2026-08-24",
    time: "09:30 AM - 12:30 PM",
    title: "WebCraft UI/UX Design Hack",
    category: "Technical",
    location: "Lab 202, ECE Block",
    speakerOrHost: "Prof. S. Janani",
    isBookmarked: false
  },
  {
    id: "sch-202",
    day: "Day 2",
    date: "2026-08-24",
    time: "10:30 AM - 04:00 PM",
    title: "AI Innovators Project Expo & Pitch",
    category: "Technical",
    location: "Seminar Hall, IT Block",
    speakerOrHost: "Prof. M. Suresh",
    isBookmarked: true
  },
  {
    id: "sch-203",
    day: "Day 2",
    date: "2026-08-24",
    time: "02:00 PM - 04:30 PM",
    title: "Mind Bytes Tech Quiz Finals",
    category: "Non-Technical",
    location: "Main Auditorium",
    speakerOrHost: "Quiz Master P. Lakshmi",
    isBookmarked: true
  },
  {
    id: "sch-204",
    day: "Day 2",
    date: "2026-08-24",
    time: "04:30 PM - 06:00 PM",
    title: "Valedictory & Prize Distribution Ceremony",
    category: "Keynote",
    location: "Main Auditorium",
    speakerOrHost: "Principal & Chairman, RPSIT",
    isBookmarked: true
  }
];

export async function fetchSchedule(dayFilter: "Day 1" | "Day 2" = "Day 1"): Promise<ScheduleSession[]> {
  await new Promise((res) => setTimeout(res, 150));
  return MOCK_SCHEDULE.filter((s) => s.day === dayFilter);
}
