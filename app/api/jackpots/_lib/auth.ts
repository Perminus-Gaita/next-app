import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

/**
 * Get the current authenticated user from the request.
 * Returns null if not authenticated.
 */
export async function getAuthUser() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user) return null;
    return session.user;
  } catch {
    return null;
  }
}
