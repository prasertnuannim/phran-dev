import { z } from "zod";

export const createReadingDto = z.object({
  deviceId: z.string().min(1),
  type: z.string().default("XY-MD02"),
  co2: z.number(),
  temperature: z.number(),
  humidity: z.number(),
});

export type CreateReadingDto = z.infer<typeof createReadingDto>;
