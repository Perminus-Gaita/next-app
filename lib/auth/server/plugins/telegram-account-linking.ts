import { createAuthEndpoint, getSessionFromCtx, APIError } from "better-auth/api";

interface TelegramLinkData {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number | string;
  hash: string;
}

export const telegramAccountLinkingPlugin = {
  id: "telegram-account-linking",
  endpoints: {
    linkTelegram: createAuthEndpoint(
      "/link-telegram",
      { method: "POST" },
      async (ctx: any) => {
        const session = await getSessionFromCtx(ctx);
        if (!session) {
          throw new APIError("UNAUTHORIZED", {
            message: "Not authenticated",
          });
        }

        const body = ctx.body || {};
        const telegramData = body.telegramData as TelegramLinkData;
        if (!telegramData || !telegramData.id) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid Telegram data",
          });
        }

        try {
          // Check if Telegram account is already linked to someone
          const existingAccount = await ctx.context.adapter.findOne({
            model: "account",
            where: [
              { field: "accountId", value: String(telegramData.id) },
              { field: "providerId", value: "telegram" },
            ],
          });

          if (existingAccount) {
            throw new APIError("CONFLICT", {
              message: "This Telegram account is already linked to another user",
            });
          }

          // Create the account record
          await ctx.context.adapter.create({
            model: "account",
            data: {
              userId: session.user.id,
              providerId: "telegram",
              accountId: String(telegramData.id),
            },
          });

          // Update user with Telegram info
          await ctx.context.adapter.update({
            model: "user",
            where: [{ field: "id", value: session.user.id }],
            data: {
              telegramId: String(telegramData.id),
              telegramUsername: telegramData.username || null,
            },
          });

          return ctx.json({
            success: true,
            message: "Telegram account linked successfully",
          });
        } catch (error) {
          if (error instanceof APIError) throw error;
          console.error("Telegram linking error:", error);
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to link Telegram account",
          });
        }
      }
    ),
  },
};
