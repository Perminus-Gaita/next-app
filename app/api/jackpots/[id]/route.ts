import { prisma } from "@/lib/prisma";
import { mapJackpotToResponse } from "../_helpers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const jackpot = await prisma.jackpot.findUnique({
      where: { id },
      include: {
        events: { orderBy: { eventOrder: "asc" } },
        prizes: { orderBy: { gamesPlayed: "desc" } },
      },
    });

    if (!jackpot) {
      return Response.json({ error: "Jackpot not found" }, { status: 404 });
    }

    return Response.json(mapJackpotToResponse(jackpot));
  } catch (error) {
    console.error("Jackpot detail API error:", error);
    return Response.json(
      { error: "Failed to fetch jackpot" },
      { status: 500 }
    );
  }
}
