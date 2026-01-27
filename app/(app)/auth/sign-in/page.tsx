'use client';

import { useState } from 'react';
import { SignInForm } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';
import { Mail } from 'lucide-react';
import TelegramLoginWidget from '@/components/auth/TelegramLoginWidget';

export default function CustomAuthPage() {
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'telegram' | null>(null);

  // Show email form
  if (selectedMethod === 'email') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={() => setSelectedMethod(null)}
            className="mb-6 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <SignInForm 
            localization={{
              SIGN_IN: 'Sign In',
              EMAIL_PLACEHOLDER: 'Email',
              PASSWORD_PLACEHOLDER: 'Password',
            }}
          />
        </div>
      </div>
    );
  }

  // Show Telegram widget
  if (selectedMethod === 'telegram') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={() => setSelectedMethod(null)}
            className="mb-6 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in with Telegram</h2>
            <p className="text-sm text-gray-600">
              Click the button below to authenticate with your Telegram account
            </p>
          </div>
          <TelegramLoginWidget
            botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''}
            buttonSize="large"
            redirectTo="/nyumbani"
          />
        </div>
      </div>
    );
  }

  // Show auth method selection
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Choose how you'd like to sign in</p>
        </div>

        {/* Google Card */}
        <div
          onClick={() => authClient.signIn.social({ provider: 'google' })}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
              <span className="text-2xl">G</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Google</h3>
              <p className="text-sm text-gray-500">Sign in with your Google account</p>
            </div>
          </div>
        </div>

        {/* Telegram Card */}
        <div
          onClick={() => setSelectedMethod('telegram')}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Telegram</h3>
              <p className="text-sm text-gray-500">Sign in with your Telegram account</p>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div
          onClick={() => setSelectedMethod('email')}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-sm text-gray-500">Sign in with email and password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
