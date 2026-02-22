'use client';

import { createAuthClient } from "better-auth/react";
import { telegramClient } from "better-auth-telegram/client";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : process.env.BETTER_AUTH_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [telegramClient()],
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;
