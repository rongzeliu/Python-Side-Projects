import { Header } from "@/components/Header";
import { EventExplorer } from "@/components/EventExplorer";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header current="/" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6">
        <section>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--tomato)]">St. George campus</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--navy)]">
            Find free food on campus
          </h1>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            Live map of pizza nights, leftover lunches, and club snacks pulled from UofT calendars,
            college sites, and Instagram captions — plus events students submit themselves.
          </p>
        </section>
        <EventExplorer mode="map" />
      </main>
    </div>
  );
}
