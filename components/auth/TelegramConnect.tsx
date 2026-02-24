"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Telegram?: {
      Login?: {
        auth: (
          options: { bot_id: string; request_access: string; lang: string },
          callback: (data: TelegramAuthData | null) => void
        ) => void;
      };
    };
  }
}

interface TelegramAuthData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramConnectProps {
  mode?: "sign-in" | "link";
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function TelegramConnect({
  mode = "sign-in",
  redirectTo = "/nyumbani",
  onSuccess,
  onError,
}: TelegramConnectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const botId = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;

  useEffect(() => {
    // Load Telegram widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleClick = () => {
    if (!window.Telegram?.Login?.auth) {
      const msg = "Telegram Login widget not loaded yet. Try again.";
      onError?.(msg);
      return;
    }

    if (!botId) {
      const msg = "Telegram Bot ID not configured.";
      onError?.(msg);
      return;
    }

    setIsLoading(true);

    window.Telegram.Login.auth(
      { bot_id: botId, request_access: "write", lang: "en" },
      async (data) => {
        if (!data) {
          setIsLoading(false);
          onError?.("Telegram authorization was cancelled.");
          return;
        }

        try {
          if (mode === "sign-in") {
            // Sign in via custom plugin endpoint
            const result = await authClient.$fetch("/sign-in/telegram", {
              method: "POST",
              body: data,
            });

            if ((result.data as any)?.status === true) {
              onSuccess?.();
              router.push(redirectTo);
              router.refresh();
            } else {
              onError?.("Telegram sign-in failed.");
            }
          } else {
            // Link to existing account
            const result = await authClient.$fetch("/link-telegram", {
              method: "POST",
              body: { telegramData: data },
            });

            if ((result.data as any)?.success) {
              onSuccess?.();
            } else {
              onError?.("Telegram linking failed.");
            }
          }
        } catch (error: any) {
          console.error("Telegram auth error:", error);
          onError?.(error?.message || "Telegram authentication failed.");
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white rounded-lg p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-center gap-3">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
        <span className="font-medium">
          {isLoading
            ? mode === "sign-in"
              ? "Signing in..."
              : "Linking..."
            : mode === "sign-in"
            ? "Continue with Telegram"
            : "Connect Telegram"}
        </span>
      </div>
    </button>
  );
}
