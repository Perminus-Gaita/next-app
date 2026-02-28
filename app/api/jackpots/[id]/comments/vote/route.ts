import { prisma } from "@/lib/prisma";
import { getAuthUser } from "../../../_lib/auth";

// ─── POST: Upvote or downvote a comment ───
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { commentId, value } = body;

    if (!commentId || (value !== 1 && value !== -1 && value !== 0)) {
      return Response.json(
        { error: "commentId and value (1, -1, or 0) are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    // Don't allow voting on own comments
    if (comment.userId === user.id) {
      return Response.json({ error: "Cannot vote on your own comment" }, { status: 400 });
    }

    const existingVote = await prisma.commentVote.findUnique({
      where: { commentId_userId: { commentId, userId: user.id } },
    });

    let scoreDelta = 0;

    if (value === 0) {
      // Remove vote
      if (existingVote) {
        scoreDelta = -existingVote.value;
        await prisma.commentVote.delete({
          where: { commentId_userId: { commentId, userId: user.id } },
        });
      }
    } else if (existingVote) {
      // Update existing vote
      if (existingVote.value !== value) {
        scoreDelta = value - existingVote.value; // e.g. switching from -1 to 1 = +2
        await prisma.commentVote.update({
          where: { commentId_userId: { commentId, userId: user.id } },
          data: { value },
        });
      }
    } else {
      // New vote
      scoreDelta = value;
      await prisma.commentVote.create({
        data: { commentId, userId: user.id, value },
      });
    }

    // Update comment score
    if (scoreDelta !== 0) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { score: { increment: scoreDelta } },
      });
    }

    const updated = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { score: true },
    });

    return Response.json({
      commentId,
      score: updated?.score ?? 0,
      userVote: value,
    });
  } catch (error) {
    console.error("Vote POST error:", error);
    return Response.json({ error: "Failed to vote" }, { status: 500 });
  }
}
