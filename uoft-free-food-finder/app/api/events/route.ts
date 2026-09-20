import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { filterEvents, listEvents } from "@/lib/events";
import type { DietaryTag } from "@/models/Event";

const Query = z.object({
  when: z.enum(["all", "today", "now", "upcoming"]).optional(),
  dietary: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const parsed = Query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  const dietary = (parsed.data.dietary?.split(",").filter(Boolean) ?? []) as DietaryTag[];
  const events = filterEvents(await listEvents(), {
    when: parsed.data.when ?? "upcoming",
    dietary,
  });
  return NextResponse.json({ events });
}
