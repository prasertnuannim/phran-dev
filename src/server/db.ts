import { PrismaClient } from "@prisma/client";

// Keep a single PrismaClient instance during dev hot reloads.
const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

const client = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client;
}

export const prisma = client;
