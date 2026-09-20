"use client";

import dynamic from "next/dynamic";
import type { FoodEvent } from "@/models/Event";

const Map = dynamic(() => import("@/components/CampusMap").then((m) => m.CampusMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-2xl bg-white text-sm text-[var(--muted)] ring-1 ring-[var(--line)]">
      Loading St. George map…
    </div>
  ),
});

export function EventMap({ events }: { events: FoodEvent[] }) {
  return <Map events={events} />;
}
