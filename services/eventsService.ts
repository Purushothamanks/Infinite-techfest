import { useProcessStore } from "@/store/processStore";
import type { EventCategory, EventDetail } from "@/types/events";

export const MOCK_EVENTS: EventDetail[] = [
  {
    id: "evt-codecraft",
    title: "CodeCraft",
    category: "Coding",
    type: "individual",
    date: "2026-08-23",
    time: "09:00 AM - 12:00 PM",
    location: "Lab 404, CSE Block",
    registrationFee: 150,
    registrationDeadline: "2026-08-22",
    shortDescription: "Ultimate competitive programming challenge testing speed and algorithmic logic.",
    fullDescription:
      "CodeCraft is the flagship programming contest of Infinite Techfest 2026. Participants will solve complex algorithmic problems under time constraints. Compete against top coders across colleges and win cash prizes!",
    rules: [
      "Individual participation only.",
      "Round 1: Debugging & Syntax Challenge (30 mins).",
      "Round 2: Algorithmic Problem Solving (90 mins).",
      "Supported languages: C++, Java, Python 3.",
      "Plagiarism or external AI tools will lead to immediate disqualification."
    ],
    prizes: [
      { position: "1st Place", amount: "₹5,000 + Trophy" },
      { position: "2nd Place", amount: "₹3,000 + Medal" },
      { position: "3rd Place", amount: "₹1,500 + Certificate" }
    ],
    coordinators: [
      { name: "Dr. K. Ramanathan", role: "Staff Coordinator", phone: "+91 98421 23456" },
      { name: "S. Vignesh", role: "Student Coordinator", phone: "+91 94432 10987" }
    ],
    isRegistered: true,
    registrationStatus: "registered"
  },
  {
    id: "evt-ai-innovators",
    title: "AI Innovators",
    category: "AI / ML",
    type: "team",
    minTeamSize: 2,
    maxTeamSize: 4,
    date: "2026-08-24",
    time: "10:30 AM - 04:00 PM",
    location: "Seminar Hall, IT Block",
    registrationFee: 300,
    registrationDeadline: "2026-08-23",
    shortDescription: "Build and pitch real-world AI, Machine Learning, and Computer Vision solutions.",
    fullDescription:
      "AI Innovators invites teams to present working prototypes of Artificial Intelligence applications. Solutions should address domain challenges in healthcare, smart cities, education, or automation.",
    rules: [
      "Team size: 2 to 4 members.",
      "Working live demo / prototype is mandatory.",
      "10 minutes presentation + 5 minutes Q&A with jury.",
      "Judging criteria: Innovation (30%), Technical execution (40%), UI/UX (15%), Pitch (15%)."
    ],
    prizes: [
      { position: "1st Place", amount: "₹8,000 + Trophy" },
      { position: "2nd Place", amount: "₹5,000 + Medal" },
      { position: "3rd Place", amount: "₹2,500 + Certificate" }
    ],
    coordinators: [
      { name: "Prof. M. Suresh", role: "Staff Coordinator", phone: "+91 98422 34567" },
      { name: "R. Ananya", role: "Student Coordinator", phone: "+91 94433 21098" }
    ],
    isRegistered: true,
    registrationStatus: "registered"
  },
  {
    id: "evt-tech-quiz",
    title: "Tech Quiz (Mind Bytes)",
    category: "Quiz",
    type: "team",
    minTeamSize: 2,
    maxTeamSize: 2,
    date: "2026-08-24",
    time: "02:00 PM - 04:30 PM",
    location: "Main Auditorium",
    registrationFee: 100,
    registrationDeadline: "2026-08-23",
    shortDescription: "Fast-paced tech trivia covering AI, Big Tech, Cyber Trends & History.",
    fullDescription:
      "Mind Bytes tests your general technical knowledge, tech history, logos, founders, emerging gadgets, and tech trivia.",
    rules: [
      "Teams of 2 members.",
      "Written preliminary round to select top 6 teams.",
      "Stage rounds include Buzzer Round, Audio-Visual, and Rapid Fire.",
      "Quiz master's decision is final."
    ],
    prizes: [
      { position: "1st Place", amount: "₹4,000 + Trophy" },
      { position: "2nd Place", amount: "₹2,500 + Medal" },
      { position: "3rd Place", amount: "₹1,000 + Certificate" }
    ],
    coordinators: [
      { name: "Dr. P. Lakshmi", role: "Staff Coordinator", phone: "+91 98423 45678" },
      { name: "K. Karthik", role: "Student Coordinator", phone: "+91 94434 32109" }
    ],
    isRegistered: true,
    registrationStatus: "pending_payment"
  },
  {
    id: "evt-robowar",
    title: "RoboWars",
    category: "Robotics",
    type: "team",
    minTeamSize: 2,
    maxTeamSize: 5,
    date: "2026-08-25",
    time: "11:00 AM - 03:00 PM",
    location: "Ground Floor Arena, ECE Block",
    registrationFee: 400,
    registrationDeadline: "2026-08-24",
    shortDescription: "Combat robot arena battle. May the strongest robot survive!",
    fullDescription:
      "Enter the steel cage arena in RoboWars. Custom designed wireless battle bots battle for supremacy in knockout rounds.",
    rules: [
      "Bot weight limit: 15kg max.",
      "Power limit: 24V max battery system.",
      "No hazardous chemicals or flame throwers allowed.",
      "Knockout matches of 3 minutes duration each."
    ],
    prizes: [
      { position: "1st Place", amount: "₹10,000 + Championship Belt" },
      { position: "2nd Place", amount: "₹6,000 + Trophy" },
      { position: "3rd Place", amount: "₹3,000 + Medal" }
    ],
    coordinators: [
      { name: "Prof. T. Arunkumar", role: "Staff Coordinator", phone: "+91 98424 56789" },
      { name: "G. Praveen", role: "Student Coordinator", phone: "+91 94435 43210" }
    ],
    isRegistered: true,
    registrationStatus: "registered"
  },
  {
    id: "evt-paper-presentation",
    title: "NexTech Paper Presentation",
    category: "Paper Presentation",
    type: "team",
    minTeamSize: 1,
    maxTeamSize: 3,
    date: "2026-08-23",
    time: "01:30 PM - 04:30 PM",
    location: "Conference Room B",
    registrationFee: 200,
    registrationDeadline: "2026-08-22",
    shortDescription: "Present technical research papers in IEEE format.",
    fullDescription:
      "NexTech Paper Presentation offers a platform to publish and present research papers on Cloud Computing, Quantum Tech, Cybersecurity, Green Energy, and Autonomous Systems.",
    rules: [
      "Maximum 3 authors per paper.",
      "Paper length: 4 to 6 pages in IEEE format.",
      "Presentation time: 8 mins + 2 mins Q&A.",
      "Soft copy must be submitted 2 days before event date."
    ],
    prizes: [
      { position: "1st Place", amount: "₹5,000 + Shield" },
      { position: "2nd Place", amount: "₹3,000 + Medal" },
      { position: "3rd Place", amount: "₹1,500 + Certificate" }
    ],
    coordinators: [
      { name: "Dr. V. Meenakshi", role: "Staff Coordinator", phone: "+91 98425 67890" },
      { name: "M. Deepa", role: "Student Coordinator", phone: "+91 94436 54321" }
    ],
    isRegistered: false,
    registrationStatus: "not_registered"
  },
  {
    id: "evt-webcraft",
    title: "WebCraft UI/UX",
    category: "Web Dev",
    type: "individual",
    date: "2026-08-24",
    time: "09:30 AM - 12:30 PM",
    location: "Lab 202, ECE Block",
    registrationFee: 150,
    registrationDeadline: "2026-08-23",
    shortDescription: "Design & build responsive web interfaces under 3 hours.",
    fullDescription:
      "Craft modern, responsive landing pages or web app views based on a mystery problem statement revealed at start.",
    rules: [
      "Individual participation.",
      "Use HTML/CSS/JS or React/Tailwind.",
      "Evaluated on UI design quality, mobile responsiveness, and clean code."
    ],
    prizes: [
      { position: "1st Place", amount: "₹4,500 + Trophy" },
      { position: "2nd Place", amount: "₹2,500 + Medal" },
      { position: "3rd Place", amount: "₹1,000 + Certificate" }
    ],
    coordinators: [
      { name: "Prof. S. Janani", role: "Staff Coordinator", phone: "+91 98426 78901" },
      { name: "N. Harish", role: "Student Coordinator", phone: "+91 94437 65432" }
    ],
    isRegistered: false,
    registrationStatus: "not_registered"
  },
  {
    id: "evt-bgmi",
    title: "BGMI Battleground",
    category: "Gaming",
    type: "team",
    minTeamSize: 4,
    maxTeamSize: 4,
    date: "2026-08-25",
    time: "01:00 PM - 05:00 PM",
    location: "Auditorium Annex",
    registrationFee: 200,
    registrationDeadline: "2026-08-24",
    shortDescription: "Squad BGMI e-sports tournament with custom room battles.",
    fullDescription:
      "Battle against top collegiate squads in BGMI. Custom room matches played on Erangel and Miramar maps.",
    rules: [
      "Squad of 4 players.",
      "Mobile devices only. Emulators strictly banned.",
      "Hacks or exploits lead to instant squad ban."
    ],
    prizes: [
      { position: "1st Place", amount: "₹6,000 + Trophy" },
      { position: "2nd Place", amount: "₹4,000 + Medal" },
      { position: "3rd Place", amount: "₹2,000 + Certificate" }
    ],
    coordinators: [
      { name: "Prof. R. Balaji", role: "Staff Coordinator", phone: "+91 98427 89012" },
      { name: "A. Rahul", role: "Student Coordinator", phone: "+91 94438 76543" }
    ],
    isRegistered: false,
    registrationStatus: "not_registered"
  }
];

export async function fetchEvents(category: EventCategory = "All", searchQuery: string = ""): Promise<EventDetail[]> {
  await new Promise((res) => setTimeout(res, 200));
  const { isPaymentVerified } = useProcessStore.getState();

  let filtered = MOCK_EVENTS.map((e) => ({
    ...e,
    registrationStatus: isPaymentVerified
      ? e.registrationStatus
      : ("not_registered" as const),
    isRegistered: isPaymentVerified ? e.isRegistered : false,
  }));

  if (category !== "All") {
    filtered = filtered.filter((e) => e.category === category);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (e) => e.title.toLowerCase().includes(q) || e.shortDescription.toLowerCase().includes(q)
    );
  }
  return filtered;
}

export async function fetchEventById(id: string): Promise<EventDetail | null> {
  await new Promise((res) => setTimeout(res, 150));
  const { isPaymentVerified } = useProcessStore.getState();
  const found = MOCK_EVENTS.find((e) => e.id === id);
  if (!found) return null;
  return {
    ...found,
    registrationStatus: isPaymentVerified
      ? found.registrationStatus
      : ("not_registered" as const),
    isRegistered: isPaymentVerified ? found.isRegistered : false,
  };
}

