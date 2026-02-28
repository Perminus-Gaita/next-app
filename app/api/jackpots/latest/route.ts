import { prisma } from "@/lib/prisma";
import { mapJackpotToResponse } from "../_helpers";

export async function GET() {
  try {
    // Find the latest OPEN jackpot, or most recent by humanId
    let jackpot = await prisma.jackpot.findFirst({
      where: { status: "OPEN" },
      include: {
        events: { orderBy: { eventOrder: "asc" } },
        prizes: { orderBy: { gamesPlayed: "desc" } },
      },
      orderBy: { humanId: "desc" },
    });

    if (!jackpot) {
      jackpot = await prisma.jackpot.findFirst({
        include: {
          events: { orderBy: { eventOrder: "asc" } },
          prizes: { orderBy: { gamesPlayed: "desc" } },
        },
        orderBy: { humanId: "desc" },
      });
    }

    if (!jackpot) {
      return Response.json({ error: "No jackpots found" }, { status: 404 });
    }

    return Response.json(mapJackpotToResponse(jackpot));
  } catch (error) {
    console.error("Latest jackpot API error:", error);
    return Response.json(
      { error: "Failed to fetch latest jackpot" },
      { status: 500 }
    );
  }
}
