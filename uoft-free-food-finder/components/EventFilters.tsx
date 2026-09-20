"use client";

import type { DietaryTag } from "@/models/Event";
import { DIETARY_OPTIONS } from "@/lib/status";

const WHEN = [
  { id: "upcoming", label: "Upcoming" },
  { id: "now", label: "Right now" },
  { id: "today", label: "Today" },
  { id: "all", label: "All" },
] as const;

export function EventFilters({
  when,
  dietary,
  onWhen,
  onDietary,
}: {
  when: string;
  dietary: DietaryTag[];
  onWhen: (value: string) => void;
  onDietary: (value: DietaryTag[]) => void;
}) {
  function toggle(tag: DietaryTag) {
    onDietary(
      dietary.includes(tag) ? dietary.filter((t) => t !== tag) : [...dietary, tag],
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {WHEN.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onWhen(option.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              when === option.id
                ? "bg-[var(--navy)] text-[var(--cream)]"
                : "bg-white text-[var(--navy)] ring-1 ring-[var(--line)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => toggle(option.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              dietary.includes(option.id)
                ? "bg-[var(--tomato)] text-white"
                : "bg-white text-[var(--ink)] ring-1 ring-[var(--line)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
