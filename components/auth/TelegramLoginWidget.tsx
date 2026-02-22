'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

interface TelegramLoginWidgetProps {
  botUsername: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  lang?: string;
  redirectTo?: string;
}

export default function TelegramLoginWidget({
  botUsername,
  buttonSize = 'large',
  cornerRadius,
  requestAccess = true,
  usePic = true,
  lang = 'en',
  redirectTo = '/lobby',
}: TelegramLoginWidgetProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const containerId = 'telegram-login-container';

    authClient.initTelegramWidget(
      containerId,
      {
        size: buttonSize,
        showUserPhoto: usePic,
        cornerRadius: cornerRadius,
        lang: lang,
        requestAccess: requestAccess ? 'write' : undefined,
      },
      async (authData) => {
        setIsLoading(true);
        setError(null);

        try {
          const result = await authClient.signInWithTelegram(authData);

          if (result.error) {
            throw new Error(result.error.message || 'Telegram sign-in failed');
          }

          router.push(redirectTo);
          router.refresh();
        } catch (err) {
          console.error('Telegram auth error:', err);
          setError(err instanceof Error ? err.message : 'Authentication failed');
          setIsLoading(false);
        }
      }
    );
  }, [botUsername, buttonSize, cornerRadius, requestAccess, usePic, lang, redirectTo, router]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div id="telegram-login-container" />

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          Signing in...
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
