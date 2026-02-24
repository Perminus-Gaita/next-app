import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

const config = {
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "http://localhost:3000",
  ].filter(Boolean) as string[],

  // ─── GOOGLE OAUTH ───
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile: { name?: string }) => {
        const sanitizedName = (profile.name || "user").replace(/\s/g, "");
        const randomSuffix = Math.floor(Math.random() * 1000);
        return {
          username: `${sanitizedName}${randomSuffix}`,
        };
      },
    },
  },

  // ─── USER MODEL ───
  user: {
    modelName: "user",
    additionalFields: {
      username: {
        type: "string" as const,
        required: false,
        input: true,
      },
      telegramId: {
        type: "string" as const,
        required: false,
        input: false,
      },
      telegramUsername: {
        type: "string" as const,
        required: false,
        input: false,
      },
    },
  },

  // ─── ACCOUNT MODEL ───
  account: {
    modelName: "account",
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true, // Telegram emails are fake (@telegram.local)
    },
  },

  // ─── SESSION ───
  session: {
    modelName: "session",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
};

export default config;
