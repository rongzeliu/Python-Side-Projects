import { NextRequest, NextResponse } from "next/server";
import { runIngestion } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  const secret = process.env.SCRAPE_SECRET;
  if (secret) {
    const header = req.headers.get("x-scrape-secret");
    if (header !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await runIngestion();
  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({
    hint: "POST this endpoint to run scrapers. Optional header: x-scrape-secret",
  });
}
