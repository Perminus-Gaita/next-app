import { prisma } from "@/lib/prisma";
import { getAuthUser } from "../../_lib/auth";

// ─── Build threaded comment tree ───
function buildCommentTree(flatComments: any[]): any[] {
  const map = new Map<string, any>();
  const roots: any[] = [];

  for (const c of flatComments) {
    map.set(c.id, {
      _id: c.id,
      jackpotId: c.jackpotId,
      userId: c.userId,
      username: c.user?.username || c.user?.name || "Anonymous",
      image: c.user?.image || null,
      text: c.body,
      votes: c.score,
      parentId: c.parentId,
      depth: c.depth,
      deleted: c.deleted,
      replies: [],
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      // Include current user's vote if present
      userVote: c.votes?.[0]?.value ?? 0,
    });
  }

  for (const c of flatComments) {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

// ─── GET: Fetch threaded comments for a jackpot ───
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jackpotId } = await params;
    const user = await getAuthUser();

    const comments = await prisma.comment.findMany({
      where: { jackpotId },
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
        // If user is logged in, include their vote on each comment
        ...(user ? {
          votes: {
            where: { userId: user.id },
            select: { value: true },
          },
        } : {}),
      },
      orderBy: { createdAt: "asc" },
    });

    const tree = buildCommentTree(comments);

    return Response.json(tree);
  } catch (error) {
    console.error("Comments GET error:", error);
    return Response.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// ─── POST: Create a comment ───
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id: jackpotId } = await params;
    const body = await request.json();
    const { text, parentId } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return Response.json({ error: "Comment text is required" }, { status: 400 });
    }

    if (text.length > 10000) {
      return Response.json({ error: "Comment too long" }, { status: 400 });
    }

    // Verify jackpot exists
    const jackpot = await prisma.jackpot.findUnique({ where: { id: jackpotId } });
    if (!jackpot) {
      return Response.json({ error: "Jackpot not found" }, { status: 404 });
    }

    // If replying, verify parent exists and compute depth
    let depth = 0;
    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (!parent || parent.jackpotId !== jackpotId) {
        return Response.json({ error: "Parent comment not found" }, { status: 404 });
      }
      depth = parent.depth + 1;
    }

    const comment = await prisma.comment.create({
      data: {
        jackpotId,
        userId: user.id,
        parentId: parentId || null,
        body: text.trim(),
        depth,
      },
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
      },
    });

    return Response.json({
      _id: comment.id,
      jackpotId: comment.jackpotId,
      userId: comment.userId,
      username: comment.user?.username || comment.user?.name || "Anonymous",
      image: comment.user?.image || null,
      text: comment.body,
      votes: comment.score,
      parentId: comment.parentId,
      depth: comment.depth,
      deleted: comment.deleted,
      replies: [],
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      userVote: 0,
    }, { status: 201 });
  } catch (error) {
    console.error("Comments POST error:", error);
    return Response.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

// ─── DELETE: Soft-delete a comment ───
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { commentId } = body;

    if (!commentId) {
      return Response.json({ error: "commentId is required" }, { status: 400 });
    }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== user.id) {
      return Response.json({ error: "Not authorized" }, { status: 403 });
    }

    // Soft delete — keep for thread integrity
    await prisma.comment.update({
      where: { id: commentId },
      data: { deleted: true, body: "[deleted]" },
    });

    return Response.json({ deleted: true });
  } catch (error) {
    console.error("Comments DELETE error:", error);
    return Response.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
