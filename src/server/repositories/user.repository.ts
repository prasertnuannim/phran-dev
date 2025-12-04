import { prisma } from "@/server/db";
import { OAuthLoginPayload } from "../dto/auth.dto";

export const UserRepository = {
  async findByProvider(provider: string, providerId: string) {
    return prisma.user.findFirst({
      where: { provider, providerId },
    });
  },

  async createOAuthUser(data: OAuthLoginPayload) {
    return prisma.user.create({
      data: {
        provider: data.provider,
        providerId: data.providerId,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      },
    });
  },
};
