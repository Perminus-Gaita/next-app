import { createAuthEndpoint, APIError } from "better-auth/api";
import crypto from "crypto";

interface TelegramAuthData {
  id: number | string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number | string;
  hash: string;
  [key: string]: unknown;
}

function verifyTelegramData(data: TelegramAuthData, botToken: string): boolean {
  const { hash, ...rest } = data;
  const checkString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  return hmac === hash;
}

export const telegramAuthPlugin = {
  id: "telegram-auth",
  endpoints: {
    signInTelegram: createAuthEndpoint(
      "/sign-in/telegram",
      { method: "POST" },
      async (ctx: any) => {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Telegram bot token not configured",
          });
        }

        const telegramData = ctx.body as TelegramAuthData;
        if (!telegramData || !telegramData.id) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid Telegram data",
          });
        }

        // 1. Verify the data came from Telegram
        if (!verifyTelegramData(telegramData, botToken)) {
          throw new APIError("UNAUTHORIZED", {
            message: "Invalid Telegram authentication",
          });
        }

        // 2. Check auth_date is not too old (5 minutes)
        const authDate = parseInt(String(telegramData.auth_date));
        const now = Math.floor(Date.now() / 1000);
        if (now - authDate > 300) {
          throw new APIError("UNAUTHORIZED", {
            message: "Telegram auth data expired",
          });
        }

        const telegramId = String(telegramData.id);
        const tempEmail = `telegram_${telegramId}@telegram.local`;

        try {
          // 3. Check if this Telegram account already exists
          const existingAccount = await ctx.context.adapter.findOne({
            model: "account",
            where: [
              { field: "accountId", value: telegramId },
              { field: "providerId", value: "telegram" },
            ],
          });

          let userId: string;

          if (existingAccount) {
            // Existing user — sign them in
            userId = existingAccount.userId;
          } else {
            // New user — build name and username
            let name: string | null = null;
            if (telegramData.first_name || telegramData.last_name) {
              name = `${telegramData.first_name || ""} ${telegramData.last_name || ""}`.trim();
            }

            let username = telegramData.username;
            if (!username) {
              if (name) {
                const namePart = name.toLowerCase().replace(/\s/g, "_");
                const randomChars = Math.random().toString(36).substring(2, 6);
                username = `${namePart}_${randomChars}`;
              } else {
                username = `user_${Math.random().toString(36).substring(2, 10)}`;
              }
            }

            // Create the user
            const newUser = await ctx.context.adapter.create({
              model: "user",
              data: {
                name: name || username,
                username: username,
                email: tempEmail,
                emailVerified: true,
                image: telegramData.photo_url || null,
                telegramId: telegramId,
                telegramUsername: telegramData.username || null,
              },
            });

            userId = newUser.id;

            // Create the account link
            await ctx.context.adapter.create({
              model: "account",
              data: {
                userId: userId,
                accountId: telegramId,
                providerId: "telegram",
              },
            });
          }

          // 4. Create a session
          const session = await ctx.context.internalAdapter.createSession(
            userId,
            ctx.request
          );

          // 5. Set session cookie
          await ctx.setSignedCookie(
            ctx.context.authCookies.sessionToken.name,
            session.token,
            ctx.context.secret,
            ctx.context.authCookies.sessionToken.options
          );

          return ctx.json({ status: true, user: { id: userId } });
        } catch (error) {
          if (error instanceof APIError) throw error;
          console.error("Telegram auth error:", error);
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Telegram authentication failed",
          });
        }
      }
    ),
  },
};
