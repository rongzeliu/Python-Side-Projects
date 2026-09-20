import { format } from "date-fns";
import { Countdown } from "@/components/Countdown";
import type { FoodEvent } from "@/models/Event";

export function EventCard({ event }: { event: FoodEvent }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[var(--line)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--tomato)]">{event.foodType}</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--navy)]">{event.title}</h2>
          <p className="text-sm text-[var(--muted)]">{event.hostClub}</p>
        </div>
        <Countdown event={event} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--ink)]">{event.description}</p>
      <dl className="mt-3 grid gap-1 text-sm">
        <div>
          <dt className="inline text-[var(--muted)]">When: </dt>
          <dd className="inline">
            {format(new Date(event.startAt), "EEE MMM d, h:mm a")}
            {event.endAt ? ` – ${format(new Date(event.endAt), "h:mm a")}` : ""}
          </dd>
        </div>
        <div>
          <dt className="inline text-[var(--muted)]">Where: </dt>
          <dd className="inline">
            {event.room ? `${event.room}, ` : ""}
            {event.building}
          </dd>
        </div>
      </dl>
      {event.dietary.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {event.dietary.map((tag) => (
            <span key={tag} className="rounded-full bg-[var(--cream)] px-2 py-0.5 text-xs capitalize">
              {tag}
            </span>
          ))}
        </div>
      )}
      <a
        href={event.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-full bg-[var(--navy)] px-3 py-1.5 text-sm text-[var(--cream)]"
      >
        View original post
      </a>
    </article>
  );
}
