import { PrismaClient } from "@prisma/client";
import { seedEvents } from "../lib/seed";

const prisma = new PrismaClient();

async function main() {
  const events = seedEvents();
  for (const event of events) {
    await prisma.event.upsert({
      where: { externalId: event.externalId ?? event.id },
      create: {
        title: event.title,
        hostClub: event.hostClub,
        description: event.description,
        startAt: new Date(event.startAt),
        endAt: event.endAt ? new Date(event.endAt) : null,
        building: event.building,
        room: event.room,
        lat: event.lat,
        lng: event.lng,
        foodType: event.foodType,
        dietary: event.dietary,
        source: event.source,
        sourceUrl: event.sourceUrl,
        imageUrl: event.imageUrl,
        approved: true,
        externalId: event.externalId ?? event.id,
      },
      update: {
        title: event.title,
        startAt: new Date(event.startAt),
        endAt: event.endAt ? new Date(event.endAt) : null,
      },
    });
  }
  console.log(`Seeded ${events.length} events`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
