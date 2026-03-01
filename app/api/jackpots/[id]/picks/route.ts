import { prisma } from "@/lib/prisma";
import { getAuthUser } from "../../_lib/auth";

// ─── GET: Fetch all pick sets for a jackpot ───
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jackpotId } = await params;

    const pickSets = await prisma.pickSet.findMany({
      where: { jackpotId },
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
        picks: {
          include: {
            event: { select: { eventOrder: true, resultPick: true } },
          },
          orderBy: { event: { eventOrder: "asc" } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map to frontend shape
    const mapped = pickSets.map((ps) => {
      const picks = ps.picks.map((p) => ({
        gameNumber: p.event.eventOrder,
        pick: mapPickChoiceToDisplay(p.pick),
        isCorrect: p.isCorrect,
      }));

      const score = ps.picks.filter((p) => p.isCorrect === true).length;

      return {
        _id: ps.id,
        jackpotId: ps.jackpotId,
        userId: ps.userId,
        username: ps.user?.username || ps.user?.name || "Anonymous",
        image: ps.user?.image || null,
        name: ps.name,
        picks,
        score,
        createdAt: ps.createdAt.toISOString(),
      };
    });

    return Response.json(mapped);
  } catch (error) {
    console.error("Picks GET error:", error);
    return Response.json({ error: "Failed to fetch picks" }, { status: 500 });
  }
}

// ─── POST: Save a pick set ───
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
    const { name, picks } = body;

    // picks should be: [{ gameNumber: 1, pick: "1" }, { gameNumber: 2, pick: "X" }, ...]
    if (!picks || !Array.isArray(picks) || picks.length === 0) {
      return Response.json({ error: "Picks array is required" }, { status: 400 });
    }

    // Verify jackpot exists
    const jackpot = await prisma.jackpot.findUnique({
      where: { id: jackpotId },
      include: { events: { orderBy: { eventOrder: "asc" } } },
    });

    if (!jackpot) {
      return Response.json({ error: "Jackpot not found" }, { status: 404 });
    }

    // Build eventOrder → eventId map
    const eventMap = new Map<number, string>();
    for (const ev of jackpot.events) {
      eventMap.set(ev.eventOrder, ev.id);
    }

    // Validate all picks have valid event numbers
    for (const p of picks) {
      if (!eventMap.has(p.gameNumber)) {
        return Response.json(
          { error: `Invalid game number: ${p.gameNumber}` },
          { status: 400 }
        );
      }
    }

    // Create PickSet + Picks in a transaction (using createMany for performance)
    const pickSet = await prisma.$transaction(async (tx) => {
      const ps = await tx.pickSet.create({
        data: {
          userId: user.id,
          jackpotId,
          name: name || null,
        },
      });

      await tx.pick.createMany({
        data: picks.map((p: { gameNumber: number; pick: string }) => ({
          userId: user.id,
          jackpotId,
          eventId: eventMap.get(p.gameNumber)!,
          pickSetId: ps.id,
          pick: mapDisplayToPickChoice(p.pick),
        })),
      });

      return ps;
    });

    return Response.json(
      { _id: pickSet.id, name: pickSet.name, createdAt: pickSet.createdAt.toISOString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Picks POST error:", error);
    return Response.json({ error: "Failed to save picks" }, { status: 500 });
  }
}

// ─── Helpers ───
function mapPickChoiceToDisplay(pick: string): "1" | "X" | "2" {
  const map: Record<string, "1" | "X" | "2"> = { HOME: "1", DRAW: "X", AWAY: "2" };
  return map[pick] || "1";
}

function mapDisplayToPickChoice(display: string): "HOME" | "DRAW" | "AWAY" {
  const map: Record<string, "HOME" | "DRAW" | "AWAY"> = {
    "1": "HOME",
    "X": "DRAW",
    "2": "AWAY",
    Home: "HOME",
    Draw: "DRAW",
    Away: "AWAY",
    HOME: "HOME",
    DRAW: "DRAW",
    AWAY: "AWAY",
  };
  return map[display] || "HOME";
}
