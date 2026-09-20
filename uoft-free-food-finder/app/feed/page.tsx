import { Header } from "@/components/Header";
import { EventExplorer } from "@/components/EventExplorer";

export default function FeedPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header current="/feed" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--navy)]">Upcoming list</h1>
          <p className="mt-2 text-[var(--muted)]">
            Day view and upcoming feed. Filter by vegetarian, vegan, halal, or gluten-free when
            those words appear in the original post.
          </p>
        </section>
        <EventExplorer mode="feed" />
      </main>
    </div>
  );
}
