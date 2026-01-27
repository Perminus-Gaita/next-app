'use client';

import { use, useState } from 'react';
import { SignInForm, SignUpForm } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';
import { Mail } from 'lucide-react';

interface AuthPageProps {
  params: Promise<{ path: string }>;
}

export default function AuthPage({ params }: AuthPageProps) {
  const { path } = use(params);
  const [selectedMethod, setSelectedMethod] = useState<'email' | null>(null);
  const [isSignUp, setIsSignUp] = useState(path === 'sign-up');

  // Default localization object
  const localization = {
    SIGN_IN: 'Sign In',
    SIGN_UP: 'Sign Up',
    EMAIL_PLACEHOLDER: 'Email',
    PASSWORD_PLACEHOLDER: 'Password',
    FORGOT_PASSWORD: 'Forgot Password?',
    // Add more as needed
  };

  // If email is selected, show the email form
  if (selectedMethod === 'email') {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
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
          <div className="text-center text-sm">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show the three auth method options
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Choose how you'd like to sign in</p>
        </div>

        {/* Google Card */}
        <div
          onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/nyumbani' })}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Google</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sign in with your Google account</p>
            </div>
          </div>
        </div>

        {/* Telegram Card */}
        <div
          onClick={() => authClient.signIn.social({ provider: 'telegram', callbackURL: '/nyumbani' })}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Telegram</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sign in with your Telegram account</p>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div
          onClick={() => setSelectedMethod('email')}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Email</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sign in with email and password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}