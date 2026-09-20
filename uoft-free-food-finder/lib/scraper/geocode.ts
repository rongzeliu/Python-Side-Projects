import type { CampusBuilding } from "@/models/Event";

export const UTSG_CENTER: [number, number] = [43.6629, -79.3957];

export const UTSG_BOUNDS: [[number, number], [number, number]] = [
  [43.6548, -79.4085],
  [43.6718, -79.384],
];

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  {
    name: "Bahen Centre for Information Technology",
    shortName: "Bahen",
    aliases: ["bahen", "ba", "bahen centre", "ba 11"],
    lat: 43.6598,
    lng: -79.3972,
  },
  {
    name: "Sidney Smith Hall",
    shortName: "Sid Smith",
    aliases: ["sidney smith", "sid smith", "ss", "sidney smith hall"],
    lat: 43.6629,
    lng: -79.3986,
  },
  {
    name: "Robarts Library",
    shortName: "Robarts",
    aliases: ["robarts", "robarts library", "john p. robarts"],
    lat: 43.6645,
    lng: -79.3995,
  },
  {
    name: "Hart House",
    shortName: "Hart House",
    aliases: ["hart house", "hart house circle"],
    lat: 43.6636,
    lng: -79.3943,
  },
  {
    name: "Convocation Hall",
    shortName: "Con Hall",
    aliases: ["convocation hall", "con hall"],
    lat: 43.6609,
    lng: -79.3954,
  },
  {
    name: "Medical Sciences Building",
    shortName: "Med Sci",
    aliases: ["medical sciences", "msb", "med sci"],
    lat: 43.6609,
    lng: -79.3936,
  },
  {
    name: "Myhal Centre",
    shortName: "Myhal",
    aliases: ["myhal", "myhal centre"],
    lat: 43.6607,
    lng: -79.3965,
  },
  {
    name: "Sandford Fleming Building",
    shortName: "SF",
    aliases: ["sandford fleming", "sf building", "sf"],
    lat: 43.6601,
    lng: -79.395,
  },
  {
    name: "University College",
    shortName: "UC",
    aliases: ["university college", "uc", "uc quad", "west hall"],
    lat: 43.6623,
    lng: -79.3957,
  },
  {
    name: "Trinity College",
    shortName: "Trinity",
    aliases: ["trinity", "trinity college", "seeley hall", "strachan hall"],
    lat: 43.6653,
    lng: -79.3955,
  },
  {
    name: "Victoria College",
    shortName: "Vic",
    aliases: ["victoria college", "vic", "vic chapel", "old vic", "goldring"],
    lat: 43.6669,
    lng: -79.3918,
  },
  {
    name: "New College",
    shortName: "New College",
    aliases: ["new college", "wilson hall", "wetmore hall", "45 willcocks"],
    lat: 43.6593,
    lng: -79.4009,
  },
  {
    name: "Innis College",
    shortName: "Innis",
    aliases: ["innis", "innis college", "innis town hall"],
    lat: 43.6656,
    lng: -79.3994,
  },
  {
    name: "St. Michael's College",
    shortName: "SMC",
    aliases: ["st michael", "st. michael", "smc", "brennan hall", "kelly library"],
    lat: 43.6655,
    lng: -79.3898,
  },
  {
    name: "Gerstein Science Information Centre",
    shortName: "Gerstein",
    aliases: ["gerstein"],
    lat: 43.6619,
    lng: -79.3938,
  },
  {
    name: "Athletic Centre",
    shortName: "AC",
    aliases: ["athletic centre", "ac", "goldring centre"],
    lat: 43.6628,
    lng: -79.4006,
  },
  {
    name: "Student Commons",
    shortName: "Student Commons",
    aliases: ["student commons", "utsu", "230 college"],
    lat: 43.6589,
    lng: -79.399,
  },
  {
    name: "OISE",
    shortName: "OISE",
    aliases: ["oise", "ontario institute"],
    lat: 43.6681,
    lng: -79.3986,
  },
  {
    name: "Rotman School of Management",
    shortName: "Rotman",
    aliases: ["rotman"],
    lat: 43.6652,
    lng: -79.3985,
  },
  {
    name: "Faculty of Music",
    shortName: "Edward Johnson",
    aliases: ["edward johnson", "faculty of music", "ejb"],
    lat: 43.6667,
    lng: -79.3943,
  },
  {
    name: "Lassonde Mining Building",
    shortName: "Lassonde",
    aliases: ["lassonde", "mining building"],
    lat: 43.6596,
    lng: -79.3934,
  },
  {
    name: "Galbraith Building",
    shortName: "GB",
    aliases: ["galbraith", "gb"],
    lat: 43.66,
    lng: -79.3961,
  },
  {
    name: "Koffler Student Services Centre",
    shortName: "Koffler",
    aliases: ["koffler", "career centre"],
    lat: 43.6593,
    lng: -79.397,
  },
];

const FALLBACK: CampusBuilding = {
  name: "King's College Circle",
  shortName: "Front Campus",
  aliases: ["front campus", "king's college circle", "kcc"],
  lat: 43.6619,
  lng: -79.3957,
};

export function geocodeBuilding(text: string | undefined | null): CampusBuilding {
  if (!text) return FALLBACK;
  const hay = text.toLowerCase();
  let best: CampusBuilding | null = null;
  let bestLen = 0;
  for (const building of CAMPUS_BUILDINGS) {
    for (const alias of building.aliases) {
      if (hay.includes(alias) && alias.length > bestLen) {
        best = building;
        bestLen = alias.length;
      }
    }
  }
  return best ?? FALLBACK;
}

export function extractRoom(text: string): string | null {
  const match = text.match(
    /\b(?:room|rm\.?|rm)\s*([A-Z]{0,3}\s?\d{2,4}[A-Z]?)\b/i,
  );
  if (match) return match[1].replace(/\s+/g, "");
  const code = text.match(/\b([A-Z]{2})\s?(\d{3,4})\b/);
  if (code) return `${code[1]} ${code[2]}`;
  return null;
}
