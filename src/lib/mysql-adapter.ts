import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import {
  UserService,
  AccountService,
  SessionService,
  VerificationTokenService,
} from "./database";

export function CustomMySQLAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const newUser = await UserService.create({
        name: user.name || "",
        email: user.email || "",
        avatar: user.image || undefined,
        isVerified: user.emailVerified ? true : false,
      });

      return {
        id: newUser.id.toString(),
        email: newUser.email,
        name: newUser.name,
        image: newUser.avatar,
        emailVerified: newUser.isVerified ? new Date() : null,
      };
    },

    async getUser(id: string) {
      const user = await UserService.findById(parseInt(id));
      if (!user) return null;

      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        image: user.avatar,
        emailVerified: user.is_verified ? new Date() : null,
      };
    },

    async getUserByEmail(email: string) {
      const user = await UserService.findByEmail(email);
      if (!user) return null;

      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        image: user.avatar,
        emailVerified: user.is_verified ? new Date() : null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await AccountService.findByProvider(
        provider,
        providerAccountId,
      );
      if (!account) return null;

      const user = await UserService.findById(account.user_id);
      if (!user) return null;

      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        image: user.avatar,
        emailVerified: user.is_verified ? new Date() : null,
      };
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const updatedUser = await UserService.update(parseInt(user.id), {
        name: user.name,
        email: user.email,
        avatar: user.image,
        isVerified: user.emailVerified ? true : undefined,
      });

      if (!updatedUser) throw new Error("User not found");

      return {
        id: updatedUser.id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.avatar,
        emailVerified: updatedUser.is_verified ? new Date() : null,
      };
    },

    async deleteUser(userId: string) {
      // Implement if needed
      throw new Error("Delete user not implemented");
    },

    async linkAccount(account: AdapterAccount) {
      await AccountService.create({
        userId: parseInt(account.userId),
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refreshToken: account.refresh_token || undefined,
        accessToken: account.access_token || undefined,
        expiresAt: account.expires_at || undefined,
        tokenType: account.token_type || undefined,
        scope: account.scope || undefined,
        idToken: account.id_token || undefined,
        sessionState: account.session_state?.toString() || undefined,
      });
    },

    async unlinkAccount({ providerAccountId, provider }) {
      // Implement if needed
      throw new Error("Unlink account not implemented");
    },

    async createSession(session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) {
      const newSession = await SessionService.create({
        sessionToken: session.sessionToken,
        userId: parseInt(session.userId),
        expires: session.expires,
      });

      return {
        sessionToken: newSession.sessionToken,
        userId: newSession.userId.toString(),
        expires: newSession.expires,
      };
    },

    async getSessionAndUser(sessionToken: string) {
      const session = await SessionService.findByToken(sessionToken);
      if (!session) return null;

      const user = await UserService.findById(session.user_id);
      if (!user) return null;

      return {
        session: {
          sessionToken: session.session_token,
          userId: session.user_id.toString(),
          expires: new Date(session.expires),
        },
        user: {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar,
          emailVerified: user.is_verified ? new Date() : null,
        },
      };
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
    ) {
      await SessionService.update(session.sessionToken, {
        expires: session.expires,
      });

      const updatedSession = await SessionService.findByToken(
        session.sessionToken,
      );
      if (!updatedSession) throw new Error("Session not found");

      return {
        sessionToken: updatedSession.session_token,
        userId: updatedSession.user_id.toString(),
        expires: new Date(updatedSession.expires),
      };
    },

    async deleteSession(sessionToken: string) {
      await SessionService.delete(sessionToken);
    },

    async createVerificationToken(token: VerificationToken) {
      const newToken = await VerificationTokenService.create({
        identifier: token.identifier,
        token: token.token,
        expires: token.expires,
      });

      return {
        identifier: newToken.identifier,
        token: newToken.token,
        expires: newToken.expires,
      };
    },

    async useVerificationToken({ identifier, token }) {
      const verificationToken =
        await VerificationTokenService.findByToken(token);
      if (!verificationToken) return null;

      await VerificationTokenService.delete(identifier, token);

      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: new Date(verificationToken.expires),
      };
    },
  };
}
