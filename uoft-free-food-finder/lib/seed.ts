import type { FoodEvent } from "@/models/Event";
import { geocodeBuilding } from "@/lib/scraper/geocode";

function at(hoursFromNow: number, durationHours = 2): { startAt: string; endAt: string } {
  const start = new Date(Date.now() + hoursFromNow * 3600 * 1000);
  const end = new Date(start.getTime() + durationHours * 3600 * 1000);
  return { startAt: start.toISOString(), endAt: end.toISOString() };
}

function event(
  partial: Omit<FoodEvent, "lat" | "lng" | "createdAt" | "updatedAt" | "approved"> & {
    building: string;
  },
): FoodEvent {
  const geo = geocodeBuilding(partial.building);
  const now = new Date().toISOString();
  return {
    ...partial,
    lat: geo.lat,
    lng: geo.lng,
    building: geo.name,
    approved: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function seedEvents(): FoodEvent[] {
  const happening = at(-0.4, 1.5);
  const laterToday = at(2.5, 2);
  const tonight = at(5, 2);
  const tomorrow = at(22, 3);
  const midweek = at(48, 2);
  const friday = at(80, 2);

  return [
    event({
      id: "seed-now-hart-house",
      title: "Hart House Farm-to-Table Lunch Leftovers",
      hostClub: "Hart House Farm Committee",
      description:
        "Extra vegetarian and vegan lunch from today's farm-to-table workshop is out in the Great Hall. Free food until it runs out.",
      ...happening,
      building: "Hart House",
      room: "Great Hall",
      foodType: "Full lunch",
      dietary: ["vegetarian", "vegan"],
      source: "college",
      sourceUrl: "https://harthouse.ca/events",
      imageUrl: null,
      externalId: "seed:hart-house-lunch",
    }),
    event({
      id: "seed-today-bahen",
      title: "CSSU Midterm Fuel: Free Pizza",
      hostClub: "Computer Science Student Union",
      description:
        "Free pizza in Bahen before the 209 midterm review. Halal and vegetarian slices labelled. Snacks and juice too.",
      ...laterToday,
      building: "Bahen Centre",
      room: "BA 1130",
      foodType: "Pizza",
      dietary: ["vegetarian", "halal"],
      source: "club",
      sourceUrl: "https://cssu.ca/events",
      imageUrl: null,
      externalId: "seed:cssu-pizza",
    }),
    event({
      id: "seed-today-utsu",
      title: "UTSU Welcome Back BBQ",
      hostClub: "University of Toronto Students' Union",
      description:
        "Complimentary burgers, veggie burgers, and snacks on Front Campus. Gluten-free buns available at the last tent.",
      ...tonight,
      building: "King's College Circle",
      room: "Front Campus",
      foodType: "Burgers",
      dietary: ["vegetarian", "gluten-free"],
      source: "utsu",
      sourceUrl: "https://www.utsu.ca/events/",
      imageUrl: null,
      externalId: "seed:utsu-bbq",
    }),
    event({
      id: "seed-tomorrow-robarts",
      title: "Late Night at Robarts: Donuts & Coffee",
      hostClub: "UofT Libraries Student Experience",
      description:
        "Free donuts, coffee, and gluten-free cookies on the 2nd floor during late night hours. Complimentary snacks while studying.",
      ...tomorrow,
      building: "Robarts Library",
      room: "2nd floor",
      foodType: "Donuts · Coffee",
      dietary: ["gluten-free"],
      source: "student-life",
      sourceUrl: "https://onesearch.library.utoronto.ca/",
      imageUrl: null,
      externalId: "seed:robarts-donuts",
    }),
    event({
      id: "seed-vic-tea",
      title: "Vic High Table Leftovers",
      hostClub: "VUSAC",
      description:
        "Free dinner leftovers outside Old Vic after High Table. Halal and vegetarian labelled. Refreshments served.",
      ...midweek,
      building: "Victoria College",
      room: "Old Vic foyer",
      foodType: "Dinner",
      dietary: ["vegetarian", "halal"],
      source: "college",
      sourceUrl: "https://www.vic.utoronto.ca/news-events/events/",
      imageUrl: null,
      externalId: "seed:vic-hightable",
    }),
    event({
      id: "seed-trinity",
      title: "Trinity College Tea & Biscuits",
      hostClub: "Trinity College Literary Institute",
      description:
        "Complimentary tea, biscuits, and vegan cookies in Seeley Hall after Question Period. Free snacks for all students.",
      ...midweek,
      building: "Trinity College",
      room: "Seeley Hall",
      foodType: "Snacks",
      dietary: ["vegan", "vegetarian"],
      source: "college",
      sourceUrl: "https://www.trinity.utoronto.ca/events/",
      imageUrl: null,
      externalId: "seed:trinity-tea",
    }),
    event({
      id: "seed-new-college",
      title: "New College Study Break Bubble Tea",
      hostClub: "New College Student Council",
      description:
        "Free bubble tea and snacks in the Wilson Hall lounge. Vegan milk options. Drop in anytime during the study break.",
      ...friday,
      building: "New College",
      room: "Wilson Hall lounge",
      foodType: "Bubble tea · Snacks",
      dietary: ["vegan"],
      source: "college",
      sourceUrl: "https://www.newcollege.utoronto.ca/events/",
      imageUrl: null,
      externalId: "seed:new-college-boba",
    }),
    event({
      id: "seed-innis",
      title: "Innis Town Hall Movie Night Snacks",
      hostClub: "Innis College Student Society",
      description:
        "Free popcorn, candy, and gluten-free snacks before the screening. Food provided while supplies last.",
      ...friday,
      building: "Innis College",
      room: "Innis Town Hall",
      foodType: "Snacks",
      dietary: ["gluten-free"],
      source: "college",
      sourceUrl: "https://innis.utoronto.ca/events/",
      imageUrl: null,
      externalId: "seed:innis-movie",
    }),
    event({
      id: "seed-smc",
      title: "SMC Brennan Hall Free Lunch",
      hostClub: "St. Michael's College Student Union",
      description:
        "Free lunch for commuter students in Brennan Hall. Halal, vegetarian, and vegan stations. Full lunch until 2pm.",
      ...at(30, 3),
      building: "St. Michael's College",
      room: "Brennan Hall",
      foodType: "Full lunch",
      dietary: ["halal", "vegetarian", "vegan"],
      source: "college",
      sourceUrl: "https://stmikes.utoronto.ca/events",
      imageUrl: null,
      externalId: "seed:smc-lunch",
    }),
    event({
      id: "seed-uc",
      title: "UC Lit Pub Night Pretzels",
      hostClub: "University College Literary & Athletic Society",
      description:
        "Complimentary pretzels, hummus, and vegetarian snacks in the UC Junior Common Room. Free food with your college card.",
      ...at(54, 2),
      building: "University College",
      room: "JCR",
      foodType: "Snacks",
      dietary: ["vegetarian"],
      source: "college",
      sourceUrl: "https://www.uc.utoronto.ca/events",
      imageUrl: null,
      externalId: "seed:uc-pub",
    }),
    event({
      id: "seed-instagram-cssu",
      title: "Pizza from @cssu_uoft",
      hostClub: "@cssu_uoft",
      description:
        "FREE PIZZA after the general meeting in Bahen. Vegetarian and halal slices. Bring your TCard.",
      ...at(8, 1.5),
      building: "Bahen Centre",
      room: "BA 1180",
      foodType: "Pizza",
      dietary: ["vegetarian", "halal"],
      source: "instagram",
      sourceUrl: "https://www.instagram.com/p/demo-cssu-meeting/",
      imageUrl: null,
      externalId: "seed:ig-cssu",
    }),
  ];
}
