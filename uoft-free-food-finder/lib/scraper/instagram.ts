import type { ScrapedEventInput } from "@/models/Event";
import { classifyEventText } from "@/lib/scraper/nlp";
import { extractRoom, geocodeBuilding } from "@/lib/scraper/geocode";

const FIXTURE_POSTS = [
  {
    handle: "uoftsu",
    permalink: "https://www.instagram.com/p/demo-utsu-pizza/",
    caption:
      "FREE PIZZA on Front Campus tonight at 6pm! Vegetarian and halal slices available. Hosted by UTSU. See you at King's College Circle.",
    takenAt: hoursFromNow(3),
  },
  {
    handle: "cssu_uoft",
    permalink: "https://www.instagram.com/p/demo-cssu-snacks/",
    caption:
      "CSSU midterm survival night in Bahen BA 1130. Free snacks, coffee, and gluten-free cookies. Tomorrow 7–10pm.",
    takenAt: hoursFromNow(26),
  },
  {
    handle: "newcollegesu",
    permalink: "https://www.instagram.com/p/demo-new-college/",
    caption:
      "New College late-night study break: free bubble tea and snacks in Wilson Hall lounge. Vegan options. Friday 8pm.",
    takenAt: hoursFromNow(50),
  },
];

function hoursFromNow(hours: number) {
  return new Date(Date.now() + hours * 3600 * 1000).toISOString();
}

type ApifyItem = {
  caption?: string;
  url?: string;
  timestamp?: string;
  ownerUsername?: string;
};

async function fetchApifyPosts(handles: string[]): Promise<ApifyItem[]> {
  const token = process.env.APIFY_TOKEN;
  const actor = process.env.APIFY_INSTAGRAM_ACTOR ?? "apify/instagram-scraper";
  if (!token) return [];

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${actor}/runs?token=${token}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        directUrls: handles.map((h) => `https://www.instagram.com/${h}/`),
        resultsType: "posts",
        resultsLimit: 12,
      }),
    },
  );
  if (!runRes.ok) {
    throw new Error(`Apify run failed (${runRes.status})`);
  }
  const run = (await runRes.json()) as { data?: { defaultDatasetId?: string } };
  const datasetId = run.data?.defaultDatasetId;
  if (!datasetId) return [];

  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`,
  );
  if (!itemsRes.ok) return [];
  return (await itemsRes.json()) as ApifyItem[];
}

function toEvent(item: {
  handle: string;
  permalink: string;
  caption: string;
  takenAt?: string;
}): ScrapedEventInput | null {
  const classified = classifyEventText(item.caption);
  if (!classified.isFreeFood) return null;
  const building = geocodeBuilding(item.caption);
  return {
    title: `${classified.foodType} from @${item.handle}`,
    hostClub: `@${item.handle}`,
    description: item.caption,
    startAt: item.takenAt ?? new Date().toISOString(),
    building: building.name,
    room: extractRoom(item.caption),
    foodType: classified.foodType,
    dietary: classified.dietary,
    source: "instagram",
    sourceUrl: item.permalink,
    externalId: `instagram:${item.permalink}`,
  };
}

export async function scrapeInstagram(): Promise<{
  events: ScrapedEventInput[];
  logs: string[];
}> {
  const handles = (process.env.INSTAGRAM_HANDLES ?? "uoftsu")
    .split(",")
    .map((h) => h.trim().replace(/^@/, ""))
    .filter(Boolean);

  const logs: string[] = [];
  let items: { handle: string; permalink: string; caption: string; takenAt?: string }[] =
    [];

  try {
    const apifyItems = await fetchApifyPosts(handles);
    if (apifyItems.length) {
      items = apifyItems.map((item) => ({
        handle: item.ownerUsername ?? "campus",
        permalink: item.url ?? "",
        caption: item.caption ?? "",
        takenAt: item.timestamp,
      }));
      logs.push(`Instagram (Apify): ${apifyItems.length} post(s)`);
    }
  } catch (error) {
    logs.push(
      `Instagram (Apify): ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (items.length === 0) {
    items = FIXTURE_POSTS;
    logs.push("Instagram: using fixture captions (set APIFY_TOKEN for live posts)");
  }

  const events = items
    .map(toEvent)
    .filter((event): event is ScrapedEventInput => Boolean(event));
  logs.push(`Instagram: ${events.length} free-food post(s) after NLP filter`);
  return { events, logs };
}
