"use client";

import { FormEvent, useState } from "react";
import { CAMPUS_BUILDINGS } from "@/lib/scraper/geocode";

export function SubmitForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setStatus(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title")),
      hostClub: String(form.get("hostClub")),
      description: String(form.get("description")),
      startAt: String(form.get("startAt")),
      endAt: String(form.get("endAt") || "") || null,
      building: String(form.get("building")),
      room: String(form.get("room") || "") || null,
      sourceUrl: String(form.get("sourceUrl")),
      imageUrl: String(form.get("imageUrl") || "") || null,
    };
    const res = await fetch("/api/events/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save this event.");
      return;
    }
    setStatus("Posted. It should show up on the map and feed immediately.");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-[var(--line)]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Event title
          <input required name="title" className="field" placeholder="CSSU free pizza" />
        </label>
        <label className="grid gap-1 text-sm">
          Host club
          <input required name="hostClub" className="field" placeholder="Computer Science Student Union" />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        Description (must mention free food)
        <textarea
          required
          name="description"
          rows={4}
          className="field"
          placeholder="Free pizza and vegetarian snacks in Bahen BA 1130..."
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Starts
          <input required type="datetime-local" name="startAt" className="field" />
        </label>
        <label className="grid gap-1 text-sm">
          Ends
          <input type="datetime-local" name="endAt" className="field" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Building
          <select required name="building" className="field" defaultValue="Bahen Centre">
            {CAMPUS_BUILDINGS.map((building) => (
              <option key={building.shortName} value={building.name}>
                {building.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Room
          <input name="room" className="field" placeholder="BA 1130" />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        Original post link
        <input required type="url" name="sourceUrl" className="field" placeholder="https://..." />
      </label>
      <label className="grid gap-1 text-sm">
        Image URL (optional)
        <input type="url" name="imageUrl" className="field" placeholder="https://..." />
      </label>
      {error && <p className="text-sm text-[var(--tomato)]">{error}</p>}
      {status && <p className="text-sm text-emerald-700">{status}</p>}
      <button
        disabled={busy}
        className="rounded-full bg-[var(--navy)] px-4 py-2 text-sm text-[var(--cream)] disabled:opacity-60"
      >
        {busy ? "Posting…" : "Submit free food event"}
      </button>
    </form>
  );
}
