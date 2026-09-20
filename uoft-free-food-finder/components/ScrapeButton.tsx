"use client";

import { useState } from "react";

export function ScrapeButton() {
  const [log, setLog] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const res = await fetch("/api/scrape", { method: "POST" });
    const data = await res.json();
    setLog(data.logs ?? [data.error ?? "Done"]);
    setBusy(false);
  }

  return (
    <div className="rounded-2xl bg-[var(--navy)] p-5 text-[var(--cream)]">
      <h2 className="font-semibold">Run scrapers</h2>
      <p className="mt-1 text-sm text-[var(--cream)]/80">
        Pulls Student Life / college pages, applies the free-food NLP filter, and merges Instagram
        captions (Apify if configured).
      </p>
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="mt-3 rounded-full bg-[var(--gold)] px-4 py-2 text-sm text-[var(--navy)] disabled:opacity-60"
      >
        {busy ? "Scraping…" : "Ingest sources now"}
      </button>
      {log && (
        <ul className="mt-3 space-y-1 text-xs text-[var(--cream)]/85">
          {log.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
