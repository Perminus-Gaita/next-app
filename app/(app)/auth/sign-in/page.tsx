'use client';

import { useState } from 'react';
import { SignInForm } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth/client';
import { Mail } from 'lucide-react';

export default function CustomAuthPage() {
  const [selectedMethod, setSelectedMethod] = useState<'email' | null>(null);

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
          onClick={() => authClient.signIn.social({ provider: 'telegram' })}
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">T</span>
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