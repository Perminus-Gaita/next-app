'use client';

import { useEffect, useState } from 'react';
import { useAuthModal } from '@/lib/stores/auth-modal-store';
import { authClient } from '@/lib/auth/client';
import { X } from 'lucide-react';
import TelegramLoginWidget from '@/components/auth/TelegramLoginWidget';

export default function AuthModal() {
  const { isOpen, closeAuthModal } = useAuthModal();
  const [selectedMethod, setSelectedMethod] = useState<'google' | 'telegram' | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMethod(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/lobby",
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={closeAuthModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6">
            {selectedMethod === 'telegram' ? (
              <>
                <button
                  onClick={() => setSelectedMethod(null)}
                  className="mb-4 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  &#8592; Back to options
                </button>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Sign in with Telegram
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click the button below to authenticate with your Telegram account
                  </p>
                </div>
                <div className="flex justify-center">
                  <TelegramLoginWidget
                    botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''}
                    redirectTo="/lobby"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose how you want to sign in
                  </p>
                </div>

                {/* Sign-in Options */}
                <div className="space-y-3">
                  {/* Google */}
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      Continue with Google
                    </span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={() => setSelectedMethod('telegram')}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#229ED9">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      Continue with Telegram
                    </span>
                  </button>
                </div>

                {/* Footer */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
                  By signing in, you agree to our Terms of Service
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
