export function hasPostgres() {
  return Boolean(process.env.DATABASE_URL?.startsWith("postgres"));
}

type PrismaModule = typeof import("@prisma/client");

let prismaPromise: Promise<InstanceType<PrismaModule["PrismaClient"]>> | null = null;

export async function getPrisma() {
  if (!hasPostgres()) return null;
  if (!prismaPromise) {
    prismaPromise = import("@prisma/client").then(({ PrismaClient }) => {
      const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
      g.prisma ??= new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
      return g.prisma;
    });
  }
  return prismaPromise;
}
