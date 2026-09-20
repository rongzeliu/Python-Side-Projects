import type { DietaryTag, FoodEvent } from "@/models/Event";

export function eventWindow(event: FoodEvent) {
  const start = new Date(event.startAt).getTime();
  const end = event.endAt
    ? new Date(event.endAt).getTime()
    : start + 2 * 60 * 60 * 1000;
  return { start, end };
}

export function eventStatus(event: FoodEvent, now = Date.now()) {
  const { start, end } = eventWindow(event);
  if (now >= start && now <= end) return "now" as const;
  const startDay = new Date(start);
  const today = new Date(now);
  if (
    startDay.getFullYear() === today.getFullYear() &&
    startDay.getMonth() === today.getMonth() &&
    startDay.getDate() === today.getDate() &&
    start > now
  ) {
    return "today" as const;
  }
  if (end < now) return "past" as const;
  return "upcoming" as const;
}

export const DIETARY_OPTIONS: { id: DietaryTag; label: string }[] = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "halal", label: "Halal" },
  { id: "gluten-free", label: "Gluten-free" },
];
