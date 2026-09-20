import Parser from "rss-parser";
import * as cheerio from "cheerio";
import type { ScrapedEventInput } from "@/models/Event";
import { classifyEventText } from "@/lib/scraper/nlp";
import { extractRoom, geocodeBuilding } from "@/lib/scraper/geocode";

const rss = new Parser({ timeout: 12000 });

const SOURCES = [
  {
    id: "student-life" as const,
    name: "UofT Student Life",
    rss: "https://www.studentlife.utoronto.ca/events/rss",
    html: "https://www.studentlife.utoronto.ca/events",
  },
  {
    id: "utsu" as const,
    name: "UTSU",
    rss: null,
    html: "https://www.utsu.ca/events/",
  },
  {
    id: "college" as const,
    name: "New College",
    rss: null,
    html: "https://www.newcollege.utoronto.ca/events/",
  },
  {
    id: "college" as const,
    name: "Trinity College",
    rss: null,
    html: "https://www.trinity.utoronto.ca/events/",
  },
  {
    id: "college" as const,
    name: "Victoria College",
    rss: null,
    html: "https://www.vic.utoronto.ca/news-events/events/",
  },
  {
    id: "college" as const,
    name: "University College",
    rss: null,
    html: "https://www.uc.utoronto.ca/events",
  },
  {
    id: "college" as const,
    name: "Innis College",
    rss: null,
    html: "https://innis.utoronto.ca/events/",
  },
  {
    id: "college" as const,
    name: "St. Michael's College",
    rss: null,
    html: "https://stmikes.utoronto.ca/events",
  },
];

function toIso(value: string | Date | undefined): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function normalizeCandidate(
  source: ScrapedEventInput["source"],
  hostClub: string,
  title: string,
  description: string,
  link: string,
  startAt: string | null,
): ScrapedEventInput | null {
  const blob = `${title}\n${description}`;
  const classified = classifyEventText(blob);
  if (!classified.isFreeFood) return null;
  const building = geocodeBuilding(blob);
  return {
    title: title.trim() || "Untitled free food event",
    hostClub,
    description: description.trim().slice(0, 1200) || title,
    startAt: startAt ?? new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    building: building.name,
    room: extractRoom(blob),
    foodType: classified.foodType,
    dietary: classified.dietary,
    source,
    sourceUrl: link,
    externalId: `${source}:${link || title}`,
  };
}

async function scrapeRss(
  url: string,
  source: ScrapedEventInput["source"],
  hostClub: string,
): Promise<ScrapedEventInput[]> {
  const feed = await rss.parseURL(url);
  const out: ScrapedEventInput[] = [];
  for (const item of feed.items) {
    const event = normalizeCandidate(
      source,
      hostClub,
      item.title ?? "",
      `${item.contentSnippet ?? ""}\n${item.content ?? ""}`,
      item.link ?? url,
      toIso(item.isoDate) ?? toIso(item.pubDate),
    );
    if (event) out.push(event);
  }
  return out;
}

async function scrapeHtml(
  url: string,
  source: ScrapedEventInput["source"],
  hostClub: string,
): Promise<ScrapedEventInput[]> {
  const res = await fetch(url, {
    headers: { "user-agent": "UofT-Free-Food-Finder/1.0 (campus student project)" },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return [];
  const html = await res.text();
  const $ = cheerio.load(html);
  const out: ScrapedEventInput[] = [];

  $("article, .event, .event-card, li, .views-row, .card").each((_, el) => {
    const node = $(el);
    const title =
      node.find("h1,h2,h3,h4,.event-title,.title").first().text() ||
      node.find("a").first().text();
    const description = node.text();
    const href = node.find("a[href]").first().attr("href");
    const link = href ? new URL(href, url).toString() : url;
    const timeText =
      node.find("time").attr("datetime") || node.find("time").text() || "";
    const event = normalizeCandidate(
      source,
      hostClub,
      title,
      description,
      link,
      toIso(timeText),
    );
    if (event) out.push(event);
  });

  return out;
}

export async function scrapeOfficialSources(): Promise<{
  events: ScrapedEventInput[];
  logs: string[];
}> {
  const events: ScrapedEventInput[] = [];
  const logs: string[] = [];

  for (const source of SOURCES) {
    try {
      let found: ScrapedEventInput[] = [];
      if (source.rss) {
        found = await scrapeRss(source.rss, source.id, source.name);
      }
      if (found.length === 0) {
        found = await scrapeHtml(source.html, source.id, source.name);
      }
      logs.push(`${source.name}: ${found.length} free-food event(s)`);
      events.push(...found);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logs.push(`${source.name}: skipped (${message})`);
    }
  }

  const unique = new Map<string, ScrapedEventInput>();
  for (const event of events) {
    unique.set(event.externalId ?? event.sourceUrl, event);
  }
  return { events: [...unique.values()], logs };
}
