import { NextResponse } from "next/server";
import { CAMPUS_BUILDINGS, UTSG_BOUNDS, UTSG_CENTER } from "@/lib/scraper/geocode";

export async function GET() {
  return NextResponse.json({
    center: UTSG_CENTER,
    bounds: UTSG_BOUNDS,
    buildings: CAMPUS_BUILDINGS,
  });
}
