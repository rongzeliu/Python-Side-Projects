import type { FoodEvent, ScrapedEventInput } from "@/models/Event";
import { geocodeBuilding } from "@/lib/scraper/geocode";
import { classifyEventText } from "@/lib/scraper/nlp";
import { scrapeInstagram } from "@/lib/scraper/instagram";
import { scrapeOfficialSources } from "@/lib/scraper/sources";
import { upsertEvents } from "@/lib/events";

function toFoodEvent(input: ScrapedEventInput): FoodEvent {
  const classified = classifyEventText(
    `${input.title}\n${input.description}\n${input.foodType ?? ""}`,
  );
  const building = geocodeBuilding(
    `${input.building ?? ""} ${input.title} ${input.description}`,
  );
  const now = new Date().toISOString();
  return {
    id: input.externalId ?? crypto.randomUUID(),
    title: input.title,
    hostClub: input.hostClub,
    description: input.description,
    startAt: input.startAt,
    endAt: input.endAt ?? null,
    building: input.building ?? building.name,
    room: input.room ?? null,
    lat: building.lat,
    lng: building.lng,
    foodType: input.foodType ?? classified.foodType,
    dietary: input.dietary ?? classified.dietary,
    source: input.source,
    sourceUrl: input.sourceUrl,
    imageUrl: input.imageUrl ?? null,
    approved: input.source === "manual" ? true : true,
    externalId: input.externalId ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function runIngestion() {
  const [official, instagram] = await Promise.all([
    scrapeOfficialSources(),
    scrapeInstagram(),
  ]);
  const combined = [...official.events, ...instagram.events].map(toFoodEvent);
  const saved = await upsertEvents(combined);
  return {
    saved: saved.length,
    logs: [...official.logs, ...instagram.logs],
  };
}

export { toFoodEvent };
