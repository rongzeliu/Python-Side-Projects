"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import { EventMap } from "@/components/EventMap";
import type { DietaryTag, FoodEvent } from "@/models/Event";

export function EventExplorer({ mode }: { mode: "map" | "feed" }) {
  const [when, setWhen] = useState("upcoming");
  const [dietary, setDietary] = useState<DietaryTag[]>([]);
  const [events, setEvents] = useState<FoodEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ when });
    if (dietary.length) params.set("dietary", dietary.join(","));
    setLoading(true);
    fetch(`/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { events: FoodEvent[] }) => setEvents(data.events ?? []))
      .finally(() => setLoading(false));
  }, [when, dietary]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <EventFilters when={when} dietary={dietary} onWhen={setWhen} onDietary={setDietary} />
      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading events…</p>
      ) : events.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm ring-1 ring-[var(--line)]">
          No matching free food events. Try clearing filters or submit a posting.
        </p>
      ) : mode === "map" ? (
        <div className="grid min-h-[70vh] gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-h-[420px] overflow-hidden">
            <EventMap events={events} />
          </div>
          <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
