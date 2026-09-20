import { Header } from "@/components/Header";
import { ScrapeButton } from "@/components/ScrapeButton";
import { SubmitForm } from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header current="/submit" />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-5 px-4 py-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--navy)]">
            Submit a free food event
          </h1>
          <p className="mt-2 mb-5 text-[var(--muted)]">
            Clubs can post a link, room, and time so the listing does not wait on the next scrape.
            The same keyword filter used on calendars still applies.
          </p>
          <SubmitForm />
        </section>
        <aside className="space-y-4">
          <ScrapeButton />
          <div className="rounded-2xl bg-white p-5 text-sm leading-6 ring-1 ring-[var(--line)]">
            <h2 className="font-semibold text-[var(--navy)]">What gets indexed</h2>
            <p className="mt-2 text-[var(--muted)]">
              Posts must say free food, complimentary refreshments, or a specific giveaway such as
              pizza or snacks. Dietary tags are picked up automatically from vegan, vegetarian,
              halal, and gluten-free mentions.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
