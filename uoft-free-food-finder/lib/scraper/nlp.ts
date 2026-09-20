import type { DietaryTag } from "@/models/Event";

const FREE_FOOD_PATTERNS = [
  /\bfree food\b/i,
  /\bfree pizza\b/i,
  /\bfree lunch\b/i,
  /\bfree dinner\b/i,
  /\bfree breakfast\b/i,
  /\bfree snacks?\b/i,
  /\bfree refreshments?\b/i,
  /\bcomplimentary\b/i,
  /\bcatered\b/i,
  /\bpizza provided\b/i,
  /\bfood provided\b/i,
  /\bsnacks provided\b/i,
  /\bfree (bubble )?tea\b/i,
  /\bfree donuts?\b/i,
  /\bfree coffee\b/i,
  /\brefreshments will be served\b/i,
  /\bfood will be served\b/i,
  /\bfree meals?\b/i,
];

const FOOD_TYPES: { pattern: RegExp; label: string }[] = [
  { pattern: /\bpizza\b/i, label: "Pizza" },
  { pattern: /\bdonuts?\b/i, label: "Donuts" },
  { pattern: /\bbubble tea\b|\bboba\b/i, label: "Bubble tea" },
  { pattern: /\bsushi\b/i, label: "Sushi" },
  { pattern: /\btacos?\b/i, label: "Tacos" },
  { pattern: /\bburgers?\b/i, label: "Burgers" },
  { pattern: /\bsandwiches?\b/i, label: "Sandwiches" },
  { pattern: /\bsalad\b/i, label: "Salad" },
  { pattern: /\bcookies?\b/i, label: "Cookies" },
  { pattern: /\bcake\b|\bcupcakes?\b/i, label: "Cake" },
  { pattern: /\bice cream\b/i, label: "Ice cream" },
  { pattern: /\bcoffee\b|\btims\b|\btim hortons\b/i, label: "Coffee" },
  { pattern: /\bbagels?\b/i, label: "Bagels" },
  { pattern: /\bhot chocolate\b/i, label: "Hot chocolate" },
  { pattern: /\bfruit\b/i, label: "Fruit" },
  { pattern: /\bfull lunch\b|\blunch\b/i, label: "Full lunch" },
  { pattern: /\bdinner\b/i, label: "Dinner" },
  { pattern: /\bbreakfast\b/i, label: "Breakfast" },
  { pattern: /\bsnacks?\b/i, label: "Snacks" },
  { pattern: /\brefreshments?\b/i, label: "Refreshments" },
];

export function mentionsFreeFood(text: string): boolean {
  return FREE_FOOD_PATTERNS.some((p) => p.test(text));
}

export function extractFoodType(text: string): string {
  const found = FOOD_TYPES.filter((f) => f.pattern.test(text)).map((f) => f.label);
  if (found.length === 0) return "Snacks";
  const unique = [...new Set(found)];
  return unique.slice(0, 3).join(" · ");
}

export function extractDietary(text: string): DietaryTag[] {
  const tags = new Set<DietaryTag>();
  if (/\bvegan\b/i.test(text)) tags.add("vegan");
  if (/\bvegetarian\b|\bveggie\b/i.test(text)) tags.add("vegetarian");
  if (/\bhalal\b/i.test(text)) tags.add("halal");
  if (/\bgluten[-\s]?free\b|\bgf\b/i.test(text)) tags.add("gluten-free");
  return [...tags];
}

export function classifyEventText(text: string) {
  const hay = text.replace(/\s+/g, " ").trim();
  return {
    isFreeFood: mentionsFreeFood(hay),
    foodType: extractFoodType(hay),
    dietary: extractDietary(hay),
  };
}
