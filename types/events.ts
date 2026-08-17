export type EventCategory =
  | "All"
  | "Coding"
  | "AI / ML"
  | "Quiz"
  | "Robotics"
  | "Paper Presentation"
  | "Web Dev"
  | "Gaming"
  | "Non-Tech";

export type EventType = "individual" | "team";

export interface EventCoordinator {
  name: string;
  role: "Staff Coordinator" | "Student Coordinator";
  phone: string;
  email?: string;
}

export interface EventPrize {
  position: "1st Place" | "2nd Place" | "3rd Place";
  amount: string;
}

export interface EventDetail {
  id: string;
  title: string;
  category: EventCategory;
  type: EventType;
  minTeamSize?: number;
  maxTeamSize?: number;
  date: string;
  time: string;
  location: string;
  registrationFee: number; // in INR (0 for free)
  registrationDeadline: string;
  shortDescription: string;
  fullDescription: string;
  rules: string[];
  prizes: EventPrize[];
  coordinators: EventCoordinator[];
  isRegistered?: boolean;
  registrationStatus?: "registered" | "pending_payment" | "not_registered";
  imageUrl?: string;
}
