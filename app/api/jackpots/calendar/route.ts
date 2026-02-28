import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");
    const fetchAll = searchParams.get("all") === "true";

    if (!fetchAll && (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam))) {
      return Response.json(
        { error: "Provide ?month=YYYY-MM or ?all=true" },
        { status: 400 }
      );
    }

    let monthStart: Date | null = null;
    let monthEnd: Date | null = null;

    if (!fetchAll && monthParam) {
      const [yearStr, monthStr] = monthParam.split("-");
      const year = parseInt(yearStr, 10);
      const mo = parseInt(monthStr, 10);
      monthStart = new Date(year, mo - 1, 1);
      monthEnd = new Date(year, mo, 0, 23, 59, 59, 999);
    }

    const jackpots = await prisma.jackpot.findMany({
      where: { status: { not: "CANCELED" } },
      include: {
        events: {
          select: { kickoffTime: true },
          orderBy: { kickoffTime: "asc" },
        },
      },
      orderBy: { humanId: "asc" },
    });

    const calendarJackpots = jackpots
      .map((jp) => {
        const finishedAt = jp.finishedAt;
        const firstKickoff =
          jp.events.length > 0 ? jp.events[0].kickoffTime : null;
        const lastKickoff =
          jp.events.length > 0
            ? jp.events[jp.events.length - 1].kickoffTime
            : null;

        // Derive openedAt: DB value → finishedAt - 6 days → firstKickoff - 5 days
        let openedAt = jp.openedAt;
        if (!openedAt && finishedAt) {
          const fb = new Date(finishedAt);
          fb.setDate(fb.getDate() - 6);
          openedAt = fb;
        }
        if (!openedAt && firstKickoff) {
          const fb = new Date(firstKickoff);
          fb.setDate(fb.getDate() - 5);
          openedAt = fb;
        }

        // Range end
        let endDate: Date | null = null;
        if (jp.status === "FINISHED" && finishedAt) {
          endDate = finishedAt;
        } else if (lastKickoff) {
          endDate = lastKickoff;
        }

        return {
          id: jp.id,
          humanId: jp.humanId,
          status: jp.status,
          bettingStatus: jp.bettingStatus,
          openedAt: openedAt?.toISOString() ?? null,
          finishedAt: finishedAt?.toISOString() ?? null,
          firstKickoff: firstKickoff?.toISOString() ?? null,
          endDate: endDate?.toISOString() ?? null,
        };
      })
      .filter((jp) => {
        if (!jp.openedAt) return false;
        if (fetchAll) return true;

        const rangeStart = new Date(jp.openedAt);
        const rangeEnd = jp.endDate
          ? new Date(jp.endDate)
          : jp.finishedAt
            ? new Date(jp.finishedAt)
            : rangeStart;

        return rangeStart <= monthEnd! && rangeEnd >= monthStart!;
      });

    return Response.json(calendarJackpots);
  } catch (error) {
    console.error("Calendar API error:", error);
    return Response.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 }
    );
  }
}
