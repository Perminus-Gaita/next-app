import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            pickSets: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
      createdAt: user.createdAt.toISOString(),
      stats: {
        predictions: user._count.pickSets,
        comments: user._count.comments,
      },
    });
  } catch (error) {
    console.error("User GET error:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
