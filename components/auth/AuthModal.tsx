'use client';

import { useState } from 'react';
import { SignInForm, SignUpForm } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';
import { Mail, X, AlertCircle } from 'lucide-react';
import { useAuthModal } from '@/lib/stores/auth-modal-store';

export default function AuthModal() {
  const { isOpen, message, closeAuthModal } = useAuthModal();
  const [selectedMethod, setSelectedMethod] = useState<'email' | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const localization = {
    SIGN_IN: 'Sign In',
    SIGN_UP: 'Sign Up',
    EMAIL_PLACEHOLDER: 'Email',
    PASSWORD_PLACEHOLDER: 'Password',
    FORGOT_PASSWORD: 'Forgot Password?',
  };

  const resetAndClose = () => {
    setSelectedMethod(null);
    setIsSignUp(false);
    closeAuthModal();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={resetAndClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={resetAndClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            {/* Custom Message Alert */}
            {message && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900 dark:text-blue-100">{message}</p>
              </div>
            )}

            {selectedMethod === 'email' ? (
              <>
                <button
                  onClick={() => setSelectedMethod(null)}
                  className="mb-4 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  ← Back to options
                </button>
                {isSignUp ? (
                  <SignUpForm localization={localization} />
                ) : (
                  <SignInForm localization={localization} />
                )}
                <div className="text-center text-sm mt-4">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Choose how you'd like to sign in</p>
                </div>

                <div className="space-y-3">
                  {/* Google */}
                  <div
                    onClick={() => {
                      authClient.signIn.social({ 
                        provider: 'google',
                        callbackURL: window.location.pathname
                      });
                    }}
                    className="bg-white dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">Continue with Google</span>
                    </div>
                  </div>

                  {/* Telegram */}
                  <div
                    onClick={() => {
                      authClient.signIn.social({ 
                        provider: 'telegram',
                        callbackURL: window.location.pathname
                      });
                    }}
                    className="bg-blue-500 rounded-lg p-4 cursor-pointer hover:bg-blue-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                        </svg>
                      </div>
                      <span className="font-medium text-white">Continue with Telegram</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div
                    onClick={() => setSelectedMethod('email')}
                    className="bg-white dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">Continue with Email</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}