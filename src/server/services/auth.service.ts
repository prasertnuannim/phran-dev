import { OAuthLoginPayload } from "../dto/auth.dto";
import { UserRepository } from "../repositories/user.repository";

export const AuthService = {
  async handleOAuthLogin(payload: OAuthLoginPayload) {
    // upsert user
    let user = await UserRepository.findByProvider(
      payload.provider,
      payload.providerId
    );

    if (!user) {
      user = await UserRepository.createOAuthUser(payload);
    }

    return user;
  },
};
