export type DietaryTag = "vegetarian" | "vegan" | "halal" | "gluten-free";

export type EventSource =
  | "student-life"
  | "utsu"
  | "college"
  | "club"
  | "instagram"
  | "rss"
  | "manual";

export type FoodEvent = {
  id: string;
  title: string;
  hostClub: string;
  description: string;
  startAt: string;
  endAt: string | null;
  building: string;
  room: string | null;
  lat: number;
  lng: number;
  foodType: string;
  dietary: DietaryTag[];
  source: EventSource;
  sourceUrl: string;
  imageUrl: string | null;
  approved: boolean;
  externalId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ScrapedEventInput = {
  title: string;
  hostClub: string;
  description: string;
  startAt: string;
  endAt?: string | null;
  building?: string;
  room?: string | null;
  foodType?: string;
  dietary?: DietaryTag[];
  source: EventSource;
  sourceUrl: string;
  imageUrl?: string | null;
  externalId?: string | null;
};

export type CampusBuilding = {
  aliases: string[];
  name: string;
  shortName: string;
  lat: number;
  lng: number;
};
