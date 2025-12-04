import { z } from "zod";

export const OAuthLoginDto = z.object({
  provider: z.string(),
  providerId: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  avatar: z.string().nullable(),
});

export type OAuthLoginPayload = z.infer<typeof OAuthLoginDto>;
