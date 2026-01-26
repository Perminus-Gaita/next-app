import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { nonceManager } from '@/lib/auth/nonce-store';

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

function verifyTelegramAuth(authData: TelegramAuthData): boolean {
  const { hash, ...data } = authData;
  
  const checkString = Object.keys(data)
    .sort()
    .filter(key => data[key as keyof typeof data] !== undefined)
    .map(key => `${key}=${data[key as keyof typeof data]}`)
    .join('\n');
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('Bot token not configured');
  }

  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();
  
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');
  
  if (hmac !== hash) {
    return false;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - data.auth_date > 86400) {
    return false;
  }
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const telegramData: TelegramAuthData = await request.json();
    
    // Verify Telegram authentication
    if (!verifyTelegramAuth(telegramData)) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication data' },
        { status: 401 }
      );
    }

    // Generate one-time nonce for client-side authentication
    const nonce = await nonceManager.create(telegramData.id);
    
    console.log('✅ Telegram verified, created nonce for ID:', telegramData.id);

    // Return nonce and user info to client
    return NextResponse.json(
      { 
        success: true,
        nonce,
        telegram: {
          id: telegramData.id,
          name: `${telegramData.first_name} ${telegramData.last_name || ''}`.trim(),
          photo_url: telegramData.photo_url,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}