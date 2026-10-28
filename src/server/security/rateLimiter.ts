import { createHash } from "node:crypto";
import { prisma } from "@/server/db/auth/client";
import { createAppError } from "./appError";

export type RateLimiter = { check: (key: string) => Promise<void> };
let nextCleanup = 0;

// A single atomic PostgreSQL operation keeps limits consistent across instances.
export const RateLimiter = (limit: number, windowSec: number, namespace = "default"): RateLimiter => {
  if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(windowSec) || windowSec < 1) {
    throw new Error("Invalid rate limit configuration");
  }

  return {
    async check(identity: string) {
      const key = createHash("sha256").update(`${namespace}:${identity}`).digest("hex");
      const accepted = await prisma.$queryRaw<{ count: number }[]>`
        INSERT INTO "RateLimitBucket" ("key", "count", "expiresAt")
        VALUES (${key}, 1, CURRENT_TIMESTAMP + ${windowSec} * INTERVAL '1 second')
        ON CONFLICT ("key") DO UPDATE SET
          "count" = CASE WHEN "RateLimitBucket"."expiresAt" <= CURRENT_TIMESTAMP
            THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
          "expiresAt" = CASE WHEN "RateLimitBucket"."expiresAt" <= CURRENT_TIMESTAMP
            THEN CURRENT_TIMESTAMP + ${windowSec} * INTERVAL '1 second'
            ELSE "RateLimitBucket"."expiresAt" END
        WHERE "RateLimitBucket"."expiresAt" <= CURRENT_TIMESTAMP
          OR "RateLimitBucket"."count" < ${limit}
        RETURNING "count"
      `;
      if (!accepted.length) {
        throw createAppError("RATE_LIMITED", "Too many requests", 429);
      }

      if (Date.now() >= nextCleanup) {
        nextCleanup = Date.now() + 60_000;
        // Bounded cleanup of expired identities; a cleanup failure must not undo admission.
        await prisma.$executeRaw`
          DELETE FROM "RateLimitBucket" WHERE "expiresAt" < CURRENT_TIMESTAMP AND "key" IN (
            SELECT "key" FROM "RateLimitBucket"
            WHERE "expiresAt" < CURRENT_TIMESTAMP ORDER BY "expiresAt" LIMIT 100
          )
        `.catch(() => { nextCleanup = 0; });
      }
    },
  };
};
