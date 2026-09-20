import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createManualEvent } from "@/lib/events";
import { classifyEventText } from "@/lib/scraper/nlp";
import { extractRoom, geocodeBuilding } from "@/lib/scraper/geocode";
import { toFoodEvent } from "@/lib/scraper";

const Body = z.object({
  title: z.string().min(3).max(140),
  hostClub: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  startAt: z.string(),
  endAt: z.string().optional().nullable(),
  building: z.string().min(2),
  room: z.string().optional().nullable(),
  sourceUrl: z.string().url(),
  imageUrl: z.string().url().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the form fields", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const text = `${parsed.data.title}\n${parsed.data.description}`;
  const classified = classifyEventText(text);
  if (!classified.isFreeFood) {
    return NextResponse.json(
      {
        error:
          "The description must mention free food, complimentary refreshments, or a specific free item (pizza, snacks, lunch, etc.).",
      },
      { status: 422 },
    );
  }

  const geo = geocodeBuilding(`${parsed.data.building} ${text}`);
  const event = await createManualEvent(
    toFoodEvent({
      title: parsed.data.title,
      hostClub: parsed.data.hostClub,
      description: parsed.data.description,
      startAt: new Date(parsed.data.startAt).toISOString(),
      endAt: parsed.data.endAt ? new Date(parsed.data.endAt).toISOString() : null,
      building: geo.name,
      room: parsed.data.room || extractRoom(text),
      foodType: classified.foodType,
      dietary: classified.dietary,
      source: "manual",
      sourceUrl: parsed.data.sourceUrl,
      imageUrl: parsed.data.imageUrl ?? null,
      externalId: `manual:${parsed.data.sourceUrl}:${parsed.data.startAt}`,
    }),
  );

  return NextResponse.json({ event }, { status: 201 });
}
