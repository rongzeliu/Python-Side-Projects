import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DietaryTag, FoodEvent } from "@/models/Event";
import { getPrisma, hasPostgres } from "@/lib/db";
import { seedEvents } from "@/lib/seed";

const STORE_PATH = path.join(process.cwd(), "data", "events.store.json");

function fromPrisma(row: {
  id: string;
  title: string;
  hostClub: string;
  description: string;
  startAt: Date;
  endAt: Date | null;
  building: string;
  room: string | null;
  lat: number;
  lng: number;
  foodType: string;
  dietary: string[];
  source: string;
  sourceUrl: string;
  imageUrl: string | null;
  approved: boolean;
  externalId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): FoodEvent {
  return {
    ...row,
    startAt: row.startAt.toISOString(),
    endAt: row.endAt ? row.endAt.toISOString() : null,
    dietary: row.dietary as DietaryTag[],
    source: row.source as FoodEvent["source"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function readJsonStore(): Promise<FoodEvent[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FoodEvent[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    // first run
  }
  const seeded = seedEvents();
  await writeJsonStore(seeded);
  return seeded;
}

async function writeJsonStore(events: FoodEvent[]) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(events, null, 2));
}

export async function listEvents(): Promise<FoodEvent[]> {
  if (hasPostgres()) {
    try {
      const prisma = await getPrisma();
      if (!prisma) return readJsonStore();
      const rows = await prisma.event.findMany({
        where: { approved: true },
        orderBy: { startAt: "asc" },
      });
      if (rows.length === 0) {
        const seeded = seedEvents();
        await upsertEvents(seeded);
        return seeded;
      }
      return rows.map(fromPrisma);
    } catch {
      return readJsonStore();
    }
  }
  return readJsonStore();
}

export async function upsertEvents(incoming: FoodEvent[]): Promise<FoodEvent[]> {
  if (hasPostgres()) {
    try {
      const prisma = await getPrisma();
      if (prisma) {
        const saved: FoodEvent[] = [];
        for (const event of incoming) {
          const row = await prisma.event.upsert({
            where: { externalId: event.externalId ?? event.id },
            create: {
              title: event.title,
              hostClub: event.hostClub,
              description: event.description,
              startAt: new Date(event.startAt),
              endAt: event.endAt ? new Date(event.endAt) : null,
              building: event.building,
              room: event.room,
              lat: event.lat,
              lng: event.lng,
              foodType: event.foodType,
              dietary: event.dietary,
              source: event.source,
              sourceUrl: event.sourceUrl,
              imageUrl: event.imageUrl,
              approved: event.approved,
              externalId: event.externalId ?? event.id,
            },
            update: {
              title: event.title,
              hostClub: event.hostClub,
              description: event.description,
              startAt: new Date(event.startAt),
              endAt: event.endAt ? new Date(event.endAt) : null,
              building: event.building,
              room: event.room,
              lat: event.lat,
              lng: event.lng,
              foodType: event.foodType,
              dietary: event.dietary,
              source: event.source,
              sourceUrl: event.sourceUrl,
              imageUrl: event.imageUrl,
              approved: event.approved,
            },
          });
          saved.push(fromPrisma(row));
        }
        return saved;
      }
    } catch {
      // fall through to JSON
    }
  }

  const existing = await readJsonStore();
  const map = new Map(existing.map((e) => [e.externalId ?? e.id, e]));
  for (const event of incoming) {
    const key = event.externalId ?? event.id;
    const prev = map.get(key);
    map.set(key, {
      ...event,
      id: prev?.id ?? event.id,
      createdAt: prev?.createdAt ?? event.createdAt,
      updatedAt: new Date().toISOString(),
    });
  }
  const merged = [...map.values()].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
  await writeJsonStore(merged);
  return incoming;
}

export async function createManualEvent(event: FoodEvent): Promise<FoodEvent> {
  const [saved] = await upsertEvents([event]);
  return saved;
}

export function filterEvents(
  events: FoodEvent[],
  opts: { dietary?: DietaryTag[]; when?: "all" | "today" | "now" | "upcoming" },
) {
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return events.filter((event) => {
    if (!event.approved) return false;
    const start = new Date(event.startAt).getTime();
    const end = event.endAt ? new Date(event.endAt).getTime() : start + 2 * 3600 * 1000;
    if (opts.dietary?.length) {
      const has = opts.dietary.every((tag) => event.dietary.includes(tag));
      if (!has) return false;
    }
    if (opts.when === "now") return start <= now && now <= end;
    if (opts.when === "today") return start >= startOfDay.getTime() && start <= endOfDay.getTime();
    if (opts.when === "upcoming") return end >= now;
    return true;
  });
}
