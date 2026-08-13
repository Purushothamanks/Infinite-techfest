import type { LucideIcon } from "lucide-react-native";
import { Brain, Code2, Cpu, HelpCircle, Sparkles } from "lucide-react-native";

import type { CategoryTintKey } from "@/theme/colors";

interface EventCategoryVisual {
  icon: LucideIcon;
  tint: CategoryTintKey;
}

/**
 * Maps an event category label (as returned by
 * services/dashboardService.ts) to the icon + tint shown on its "My
 * Events" card badge, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png (Coding
 * -> code brackets on blue, AI / ML -> brain on violet, Quiz -> question
 * mark on amber).
 *
 * Uses the project's existing icon library (lucide-react-native) only —
 * no custom asset needed for these badges, per the task's icon-library
 * restriction. Unrecognized categories fall back to a neutral Sparkles
 * icon so a new/unlisted category never renders blank.
 */
const EVENT_CATEGORY_VISUALS: Record<string, EventCategoryVisual> = {
  Coding: { icon: Code2, tint: "blue" },
  "AI / ML": { icon: Brain, tint: "violet" },
  Quiz: { icon: HelpCircle, tint: "amber" },
  Robotics: { icon: Cpu, tint: "green" },
};

const DEFAULT_CATEGORY_VISUAL: EventCategoryVisual = {
  icon: Sparkles,
  tint: "blue",
};

export function getEventCategoryVisual(category: string): EventCategoryVisual {
  return EVENT_CATEGORY_VISUALS[category] ?? DEFAULT_CATEGORY_VISUAL;
}
