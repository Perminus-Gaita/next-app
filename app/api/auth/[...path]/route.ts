import { authApiHandler } from '@neondatabase/auth/next/server';
import { NextRequest, NextResponse } from 'next/server';
import { nonceManager } from '@/lib/auth/nonce-store';
import crypto from 'crypto';

// Get the original handlers
const { GET: originalGET, POST: originalPOST } = authApiHandler();

// Wrap POST to handle nonce-based Telegram authentication
async function wrappedPOST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const endpoint = path.join('/');

  // Only intercept email sign-in endpoint
  if (endpoint === 'sign-in/email') {
    try {
      // Clone request to read body
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();

      // Check if this is a Telegram nonce-based login
      if (body.email && body.email.match(/^telegram_\d+@telegram\.local$/)) {
        const telegramId = parseInt(body.email.match(/^telegram_(\d+)@/)?.[1] || '0');
        
        // Validate the nonce
        const validTelegramId = await nonceManager.consume(body.password);
        
        if (validTelegramId !== telegramId) {
          return NextResponse.json(
            { 
              error: 'FORBIDDEN',
              message: 'Invalid or expired authentication token. Please try signing in again.'
            },
            { status: 403 }
          );
        }

        console.log('✅ Valid nonce for Telegram ID:', telegramId);

        // Swap nonce with real password
        const realPassword = crypto
          .createHmac('sha256', process.env.TELEGRAM_BOT_TOKEN!)
          .update(telegramId.toString())
          .digest('hex');

        // Create new request with real password
        const modifiedBody = {
          ...body,
          password: realPassword,
        };

        const modifiedRequest = new NextRequest(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify(modifiedBody),
        });

        // Pass to Neon Auth with real password
        return originalPOST(modifiedRequest, context);
      }

      // Block direct Telegram email sign-ins (without nonce)
      if (body.email && body.email.match(/^telegram_\d+@telegram\.local$/)) {
        return NextResponse.json(
          { 
            error: 'FORBIDDEN',
            message: 'Telegram accounts cannot sign in with email and password. Please use the Telegram login button.'
          },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Error in auth wrapper:', error);
    }
  }

  // Block Telegram sign-ups through email form
  if (endpoint === 'sign-up/email') {
    try {
      const clonedRequest = request.clone();
      const body = await clonedRequest.json();

      if (body.email && body.email.match(/^telegram_\d+@telegram\.local$/)) {
        return NextResponse.json(
          { 
            error: 'FORBIDDEN',
            message: 'Telegram accounts cannot be created manually. Please use the Telegram login button.'
          },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  }

  // Pass through to original handler
  return originalPOST(request, context);
}

// Export wrapped handlers
export const GET = originalGET;
export const POST = wrappedPOST;