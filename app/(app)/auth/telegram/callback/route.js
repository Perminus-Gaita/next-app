import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAuthServer } from '@neondatabase/auth/next/server';

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
  
  // Create check string
  const checkString = Object.keys(data)
    .sort()
    .filter(key => data[key as keyof typeof data] !== undefined)
    .map(key => `${key}=${data[key as keyof typeof data]}`)
    .join('\n');
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('Bot token not configured');
  }

  // Create secret key
  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();
  
  // Calculate HMAC
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');
  
  // Verify hash matches
  if (hmac !== hash) {
    return false;
  }
  
  // Check auth date (should be within 24 hours)
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

    // Get Neon Auth server instance
    const authServer = createAuthServer();
    
    // Create a unique email for Telegram users (they don't have real emails)
    const telegramEmail = `telegram_${telegramData.id}@telegram.local`;
    
    // Try to find existing user or create new one
    let user;
    try {
      // Check if user already exists
      const existingUsers = await authServer.api.listUsers();
      user = existingUsers.find(u => 
        u.email === telegramEmail || 
        u.id === telegramData.id.toString()
      );

      if (!user) {
        // Create new user
        user = await authServer.api.createUser({
          email: telegramEmail,
          name: `${telegramData.first_name} ${telegramData.last_name || ''}`.trim(),
          image: telegramData.photo_url || null,
          emailVerified: true,
        });
      } else {
        // Update existing user with latest data
        user = await authServer.api.updateUser({
          userId: user.id,
          data: {
            name: `${telegramData.first_name} ${telegramData.last_name || ''}`.trim(),
            image: telegramData.photo_url || user.image,
          }
        });
      }
    } catch (error) {
      console.error('Error managing user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create/update user' },
        { status: 500 }
      );
    }

    // Create session - Neon Auth will handle the cookie automatically
    const session = await authServer.api.createSession({
      userId: user.id,
      userAgent: request.headers.get('user-agent') || 'telegram-widget',
    });

    // Return session info so the client can complete the authentication
    // Neon Auth manages the cookie internally through authApiHandler
    return NextResponse.json(
      { 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        session: {
          token: session.token,
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