import { z } from "zod";

export const createPm25ReadingDto = z.object({
  deviceId: z.string().min(1),
  pm25: z.number().min(0),
});

export type CreatePm25ReadingDto =
  z.infer<typeof createPm25ReadingDto>;
