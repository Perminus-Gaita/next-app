'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginWidgetProps {
  botUsername: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  lang?: string;
  onAuth?: (user: TelegramUser) => void;
  redirectTo?: string;
}

declare global {
  interface Window {
    TelegramLoginWidget?: {
      dataOnauth?: (user: TelegramUser) => void;
    };
  }
}

export default function TelegramLoginWidget({
  botUsername,
  buttonSize = 'large',
  cornerRadius,
  requestAccess = true,
  usePic = true,
  lang = 'en',
  onAuth,
  redirectTo = '/nyumbani',
}: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTelegramAuth = async (user: TelegramUser) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Send Telegram data to backend for verification and get nonce
      const response = await fetch('/api/auth/telegram/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      console.log('✅ Received nonce from backend');

      // Step 2: Use the nonce to sign in via Neon Auth
      // This will set the proper session cookie
      const telegramEmail = `telegram_${user.id}@telegram.local`;
      const signInResult = await authClient.signIn.email({
        email: telegramEmail,
        password: data.nonce, // Use nonce as temporary password
      });

      if (signInResult.error) {
        throw new Error(signInResult.error.message || 'Sign in failed');
      }

      console.log('✅ Signed in successfully with Neon Auth');

      // Call custom callback if provided
      if (onAuth) {
        onAuth(user);
      }

      // Redirect to specified page
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error('Telegram authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set global callback function
    if (!window.TelegramLoginWidget) {
      window.TelegramLoginWidget = {};
    }
    window.TelegramLoginWidget.dataOnauth = handleTelegramAuth;

    // Load Telegram widget script
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', botUsername);
      script.setAttribute('data-size', buttonSize);
      script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
      script.setAttribute('data-request-access', requestAccess ? 'write' : '');
      script.setAttribute('data-userpic', usePic ? 'true' : 'false');
      script.setAttribute('data-lang', lang);
      
      if (cornerRadius !== undefined) {
        script.setAttribute('data-radius', cornerRadius.toString());
      }

      script.async = true;
      containerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup
      if (window.TelegramLoginWidget) {
        delete window.TelegramLoginWidget.dataOnauth;
      }
    };
  }, [botUsername, buttonSize, cornerRadius, requestAccess, usePic, lang]);

  return (
    <div className="telegram-login-widget">
      <div ref={containerRef} className="flex justify-center" />
      {isLoading && (
        <div className="flex items-center justify-center mt-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Authenticating...</span>
        </div>
      )}
      {error && (
        <div className="mt-2 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  );
}