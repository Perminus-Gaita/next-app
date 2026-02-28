// Maps DB jackpot (with events + prizes) to the shape the frontend expects.
// This avoids changing every child component right now.
// We use loose typing for Prisma Decimal fields — they convert fine via Number().

/* eslint-disable @typescript-eslint/no-explicit-any */

interface DbEvent {
  id: string;
  eventOrder: number;
  kickoffTime: Date;
  homeTeam: string;
  awayTeam: string;
  tournament: string | null;
  country: string | null;
  countryCode: string | null;
  homeOdds: any;
  drawOdds: any;
  awayOdds: any;
  resultPick: string | null;
  homeScore: number | null;
  awayScore: number | null;
}

interface DbPrize {
  id: string;
  gamesPlayed: number;
  amount: any;
}

interface DbJackpot {
  id: string;
  humanId: number;
  type: string;
  status: string;
  bettingStatus: string | null;
  openedAt: Date | null;
  finishedAt: Date | null;
  events: DbEvent[];
  prizes: DbPrize[];
}

function mapResultPick(
  resultPick: string | null
): "1" | "X" | "2" | undefined {
  if (!resultPick) return undefined;
  const map: Record<string, "1" | "X" | "2"> = {
    Home: "1",
    Draw: "X",
    Away: "2",
    HOME: "1",
    DRAW: "X",
    AWAY: "2",
    "1": "1",
    X: "X",
    "2": "2",
  };
  return map[resultPick] ?? undefined;
}

function mapStatus(
  status: string
): "Open" | "Closed" | "Finished" {
  switch (status) {
    case "OPEN":
      return "Open";
    case "FINISHED":
      return "Finished";
    case "CANCELED":
      return "Closed";
    default:
      return "Open";
  }
}

function decimalToNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  return Number(val);
}

export function mapJackpotToResponse(jp: DbJackpot) {
  const totalPrizePool = jp.prizes.reduce(
    (sum, p) => sum + decimalToNumber(p.amount),
    0
  );

  const firstKickoff =
    jp.events.length > 0 ? jp.events[0].kickoffTime.toISOString() : null;
  const lastKickoff =
    jp.events.length > 0
      ? jp.events[jp.events.length - 1].kickoffTime.toISOString()
      : null;

  // Determine if this is the latest (we'll mark OPEN as latest)
  const isLatest = jp.status === "OPEN";

  const events = jp.events.map((ev) => ({
    eventNumber: ev.eventOrder,
    competitorHome: ev.homeTeam,
    competitorAway: ev.awayTeam,
    odds: {
      home: decimalToNumber(ev.homeOdds),
      draw: decimalToNumber(ev.drawOdds),
      away: decimalToNumber(ev.awayOdds),
    },
    result: mapResultPick(ev.resultPick),
    score:
      ev.homeScore !== null && ev.awayScore !== null
        ? { home: ev.homeScore, away: ev.awayScore }
        : undefined,
    kickoffTime: ev.kickoffTime.toISOString(),
    competition: ev.tournament ?? "",
  }));

  const prizes = jp.prizes.map((p) => ({
    jackpotType: `${p.gamesPlayed}/${p.gamesPlayed}`,
    prize: decimalToNumber(p.amount),
    winners: 0,
  }));

  return {
    _id: jp.id,
    jackpotHumanId: String(jp.humanId),
    site: "SportPesa",
    totalPrizePool,
    currencySign: "KSH",
    jackpotStatus: mapStatus(jp.status),
    isLatest,
    finished: jp.finishedAt?.toISOString() ?? lastKickoff ?? "",
    openedAt: jp.openedAt?.toISOString() ?? null,
    bettingClosesAt: firstKickoff ?? "",
    events,
    prizes,
    finishedGames: jp.status === "FINISHED" ? jp.events.length : 0,
  };
}
