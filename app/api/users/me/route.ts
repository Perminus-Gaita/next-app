import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, username } = body;

    // Build update data — only include fields that were sent
    const updateData: { name?: string; username?: string } = {};

    if (typeof name === "string") {
      const trimmed = name.trim();
      if (trimmed.length < 1 || trimmed.length > 50) {
        return NextResponse.json(
          { error: "Name must be 1-50 characters" },
          { status: 400 }
        );
      }
      updateData.name = trimmed;
    }

    if (typeof username === "string") {
      const trimmed = username.trim().toLowerCase();

      if (trimmed.length < 3 || trimmed.length > 20) {
        return NextResponse.json(
          { error: "Username must be 3-20 characters" },
          { status: 400 }
        );
      }

      if (!/^[a-z0-9_]+$/.test(trimmed)) {
        return NextResponse.json(
          { error: "Username can only contain lowercase letters, numbers, and underscores" },
          { status: 400 }
        );
      }

      // Check uniqueness (skip if same as current)
      if (trimmed !== session.user.username) {
        const existing = await prisma.user.findUnique({
          where: { username: trimmed },
          select: { id: true },
        });
        if (existing) {
          return NextResponse.json(
            { error: "Username is already taken" },
            { status: 409 }
          );
        }
      }

      updateData.username = trimmed;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, username: true, image: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
