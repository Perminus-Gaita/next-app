// lib/auth/nonce-store.ts
import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Function to generate CUID (same as Prisma's default)
function generateCuid(): string {
  return crypto.randomBytes(12).toString('base64url');
}

export const nonceManager = {
  /**
   * Create a one-time nonce for Telegram authentication
   */
  async create(telegramId: number): Promise<string> {
    const id = generateCuid(); // Generate ID manually
    const nonce = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30000); // 30 seconds

    await sql`
      INSERT INTO telegram_nonce (id, nonce, "telegramId", "expiresAt", "createdAt")
      VALUES (${id}, ${nonce}, ${telegramId}, ${expiresAt.toISOString()}, ${new Date().toISOString()})
    `;

    // Clean up expired nonces
    await sql`
      DELETE FROM telegram_nonce 
      WHERE "expiresAt" < NOW()
    `;

    return nonce;
  },

  /**
   * Validate and consume a nonce (one-time use)
   * Returns the Telegram ID if valid, null if invalid/expired
   */
  async consume(nonce: string): Promise<number | null> {
    const result = await sql`
      DELETE FROM telegram_nonce
      WHERE nonce = ${nonce}
        AND "expiresAt" > NOW()
      RETURNING "telegramId"
    `;

    if (result.length === 0) {
      return null;
    }

    return Number(result[0].telegramId);
  },
};