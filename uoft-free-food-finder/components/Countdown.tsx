"use client";

import { useEffect, useState } from "react";
import { eventStatus, eventWindow } from "@/lib/status";
import type { FoodEvent } from "@/models/Event";

function formatRemaining(ms: number) {
  if (ms <= 0) return "ending soon";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function Countdown({ event }: { event: FoodEvent }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const status = eventStatus(event, now);
  const { start, end } = eventWindow(event);

  if (status === "now") {
    return (
      <span className="badge badge-now">
        Right now · {formatRemaining(end - now)} left
      </span>
    );
  }
  if (status === "today") {
    return (
      <span className="badge badge-today">Today · starts in {formatRemaining(start - now)}</span>
    );
  }
  if (status === "upcoming") {
    return <span className="badge badge-soon">Starts in {formatRemaining(start - now)}</span>;
  }
  return <span className="badge">Ended</span>;
}
