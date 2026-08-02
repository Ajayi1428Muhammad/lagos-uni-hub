import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as PrismaClientConstructor } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prismaGlobal ??
  new PrismaClientConstructor({
    adapter: new PrismaPg({ connectionString }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;
