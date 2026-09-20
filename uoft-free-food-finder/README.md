# UofT Free Food Finder

Map and list of **free food events** on the University of Toronto St. George (UTSG) campus. The app ingests Student Life / college calendars, club pages, and Instagram captions, keeps only posts that mention free food, and plots them on a campus map.

## Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL via Prisma (optional). Local JSON store is used if `DATABASE_URL` is unset so `npm run dev` works immediately.
- **Map:** Leaflet.js (OpenStreetMap by default, Mapbox tiles if `NEXT_PUBLIC_MAPBOX_TOKEN` is set)
- **Scrapers:** Node (`cheerio`, `rss-parser`, Apify Instagram) plus an optional Python BeautifulSoup CLI

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Seeded UTSG events load automatically (JSON file at `data/events.store.json`).

| Route | What it does |
| --- | --- |
| `/` | Interactive campus map + side list |
| `/feed` | Filterable upcoming / today / right-now list |
| `/submit` | Manual club submission + “run scrapers” |
| `GET /api/events` | `?when=upcoming\|today\|now\|all&dietary=vegan,halal` |
| `POST /api/events/submit` | Crowdsourced event |
| `POST /api/scrape` | Run ingestion pipeline |

## PostgreSQL (optional)

```bash
docker compose up -d
npx prisma migrate dev --name init
npx prisma db seed
```

Set `DATABASE_URL` in `.env.local` to the value in `.env.example`. After that, API routes persist to Postgres instead of the JSON file.

## Scrapers

### Node (primary)

```bash
npm run scrape
```

or from the Submit page, **Ingest sources now**.

Pipeline (`lib/scraper`):

1. Official calendars / college HTML + RSS (`lib/scraper/sources.ts`)
2. Instagram captions via Apify when `APIFY_TOKEN` is set; otherwise fixture captions (`lib/scraper/instagram.ts`)
3. Keyword / NLP filter so only free-food posts are stored (`lib/scraper/nlp.ts`)
4. Building name → lat/lng using the UTSG lookup table (`lib/scraper/geocode.ts`)

If a live site blocks the request, that source is skipped and others still run. Seed + Instagram fixtures keep the map populated for local demos.

### Python (optional)

```bash
cd python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scraper.py
```

This CLI fetches the same public college event URLs with the standard library / HTML parser. Wire Playwright in if a source is fully client-rendered.

### Instagram

Set `APIFY_TOKEN` and optionally `APIFY_INSTAGRAM_ACTOR`. Handles come from `INSTAGRAM_HANDLES`. Without a token, the Instagram step uses sample captions so you can still test permalink + keyword extraction.

## Environment

See `.env.example` for `DATABASE_URL`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `APIFY_TOKEN`, `INSTAGRAM_HANDLES`, and `SCRAPE_SECRET`.

If `SCRAPE_SECRET` is set, `POST /api/scrape` must send `x-scrape-secret`.
