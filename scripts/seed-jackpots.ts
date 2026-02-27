import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ─── Finished Jackpot #169 (from history/details?pos=0) ───
const finishedJackpot = {
  jackpotId: "e879a842-6d27-4519-9ac6-209833c6b096",
  jackpotHumanId: 169,
  jackpotStatus: "Finished",
  finished: "2026-02-22T22:07:11.593Z",
  events: [
    { eventNumber: 1, kickoffTime: "2026-02-21T17:30:00Z", competitorHome: "West Ham United", competitorAway: "AFC Bournemouth", resultPick: "Draw", score: "0:0" },
    { eventNumber: 2, kickoffTime: "2026-02-21T17:30:00Z", competitorHome: "RB Leipzig", competitorAway: "Borussia Dortmund", resultPick: "Draw", score: "2:2" },
    { eventNumber: 3, kickoffTime: "2026-02-21T20:00:00Z", competitorHome: "UD Las Palmas", competitorAway: "CD Castellon", resultPick: "Draw", score: "1:1" },
    { eventNumber: 4, kickoffTime: "2026-02-22T13:00:00Z", competitorHome: "Getafe CF", competitorAway: "Sevilla FC", resultPick: "Away", score: "0:1" },
    { eventNumber: 5, kickoffTime: "2026-02-22T14:00:00Z", competitorHome: "Sunderland AFC", competitorAway: "Fulham FC", resultPick: "Away", score: "1:3" },
    { eventNumber: 6, kickoffTime: "2026-02-22T14:00:00Z", competitorHome: "Juve Stabia", competitorAway: "Modena FC", resultPick: "Away", score: "1:2" },
    { eventNumber: 7, kickoffTime: "2026-02-22T14:00:00Z", competitorHome: "AJ Auxerre", competitorAway: "Stade Rennais FC", resultPick: "Away", score: "0:3" },
    { eventNumber: 8, kickoffTime: "2026-02-22T14:00:00Z", competitorHome: "Atalanta BC", competitorAway: "SSC Napoli", resultPick: "Home", score: "2:1" },
    { eventNumber: 9, kickoffTime: "2026-02-22T14:30:00Z", competitorHome: "FK Teplice", competitorAway: "SK Sigma Olomouc", resultPick: "Away", score: "1:3" },
    { eventNumber: 10, kickoffTime: "2026-02-22T16:00:00Z", competitorHome: "LASK Linz", competitorAway: "FC Salzburg", resultPick: "Away", score: "1:5" },
    { eventNumber: 11, kickoffTime: "2026-02-22T16:15:00Z", competitorHome: "Reggiana 1919", competitorAway: "US Avellino", resultPick: "Draw", score: "1:1" },
    { eventNumber: 12, kickoffTime: "2026-02-22T16:15:00Z", competitorHome: "FC Nantes", competitorAway: "Le Havre AC", resultPick: "Home", score: "2:0" },
    { eventNumber: 13, kickoffTime: "2026-02-22T16:30:00Z", competitorHome: "FC St. Pauli", competitorAway: "Werder Bremen", resultPick: "Home", score: "2:1" },
    { eventNumber: 14, kickoffTime: "2026-02-22T16:30:00Z", competitorHome: "Korona Kielce", competitorAway: "KKS Lech Poznan", resultPick: "Away", score: "1:2" },
    { eventNumber: 15, kickoffTime: "2026-02-22T18:00:00Z", competitorHome: "Estoril Praia", competitorAway: "Gil Vicente Barcelos", resultPick: "Home", score: "3:1" },
    { eventNumber: 16, kickoffTime: "2026-02-22T18:15:00Z", competitorHome: "KVC Westerlo", competitorAway: "Royal Charleroi SC", resultPick: "Home", score: "2:1" },
    { eventNumber: 17, kickoffTime: "2026-02-22T19:45:00Z", competitorHome: "Strasbourg Alsace", competitorAway: "Olympique Lyon", resultPick: "Home", score: "3:1" },
  ],
  prizes: [
    { jackpotType: "17/17", prize: 117052299.19 },
    { jackpotType: "16/16", prize: 124964368.91 },
    { jackpotType: "15/15", prize: 93628773.68 },
    { jackpotType: "14/14", prize: 26909141.43 },
    { jackpotType: "13/13", prize: 13645235.36 },
  ],
  winningDistribution: [
    { jackpotType: "16/16", winningAmounts: [
      { category: "Jackpot", prize: 124964368.91, countWinnings: 0, winningAmount: 0 },
      { category: "Category1", prize: 207046.12, countWinnings: 0, winningAmount: 0 },
      { category: "Category2", prize: 269159.96, countWinnings: 0, winningAmount: 0 },
      { category: "Category3", prize: 351978.41, countWinnings: 7, winningAmount: 50282.60 },
      { category: "Category4", prize: 455501.47, countWinnings: 54, winningAmount: 8435.20 },
      { category: "Category5", prize: 621138.37, countWinnings: 230, winningAmount: 2700.60 },
    ]},
    { jackpotType: "14/14", winningAmounts: [
      { category: "Jackpot", prize: 26909141.43, countWinnings: 0, winningAmount: 0 },
      { category: "Category1", prize: 379052.78, countWinnings: 0, winningAmount: 0 },
      { category: "Category2", prize: 536991.44, countWinnings: 14, winningAmount: 38356.50 },
      { category: "Category3", prize: 758105.56, countWinnings: 95, winningAmount: 7980.00 },
      { category: "Category4", prize: 1168746.08, countWinnings: 537, winningAmount: 2176.40 },
      { category: "Category5", prize: 0, countWinnings: 1675, winningAmount: 0 },
    ]},
    { jackpotType: "15/15", winningAmounts: [
      { category: "Jackpot", prize: 93628773.68, countWinnings: 0, winningAmount: 0 },
      { category: "Category1", prize: 158192.59, countWinnings: 0, winningAmount: 0 },
      { category: "Category2", prize: 205650.37, countWinnings: 1, winningAmount: 205650.30 },
      { category: "Category3", prize: 268927.41, countWinnings: 17, winningAmount: 15819.20 },
      { category: "Category4", prize: 758023.70, countWinnings: 82, winningAmount: 9244.10 },
      { category: "Category5", prize: 802577.78, countWinnings: 328, winningAmount: 2446.80 },
    ]},
    { jackpotType: "17/17", winningAmounts: [
      { category: "Jackpot", prize: 117052299.19, countWinnings: 0, winningAmount: 0 },
      { category: "Category1", prize: 1294449.25, countWinnings: 0, winningAmount: 0 },
      { category: "Category2", prize: 1682784.03, countWinnings: 2, winningAmount: 841392.00 },
      { category: "Category3", prize: 2200563.73, countWinnings: 9, winningAmount: 244507.00 },
      { category: "Category4", prize: 2847788.36, countWinnings: 80, winningAmount: 35597.30 },
      { category: "Category5", prize: 3883347.76, countWinnings: 508, winningAmount: 7644.30 },
    ]},
    { jackpotType: "13/13", winningAmounts: [
      { category: "Jackpot", prize: 13645235.36, countWinnings: 0, winningAmount: 0 },
      { category: "Category1", prize: 202128.69, countWinnings: 1, winningAmount: 202128.60 },
      { category: "Category2", prize: 328459.13, countWinnings: 29, winningAmount: 11326.10 },
      { category: "Category3", prize: 543220.87, countWinnings: 115, winningAmount: 4723.60 },
      { category: "Category4", prize: 0, countWinnings: 478, winningAmount: 0 },
      { category: "Category5", prize: 0, countWinnings: 1273, winningAmount: 0 },
    ]},
  ],
};

// ─── Active Jackpot #170 (from /active endpoint) ───
const activeJackpot = {
  id: "e549c25e-980d-4414-b930-0e6f52cc9129",
  humanId: 170,
  bettingStatus: "Open",
  events: [
    { order: 1, kickoffTime: "2026-02-28T17:30:00Z", home: "RCD Mallorca", away: "Real Sociedad San Sebastian", tournament: "LaLiga", country: "Spain", countryCode: "ESP", homeOdds: 3.0, drawOdds: 3.3, awayOdds: 2.49 },
    { order: 2, kickoffTime: "2026-02-28T18:30:00Z", home: "US Avellino", away: "Juve Stabia", tournament: "Serie B", country: "Italy", countryCode: "ITA", homeOdds: 2.8, drawOdds: 2.75, awayOdds: 2.7 },
    { order: 3, kickoffTime: "2026-03-01T13:00:00Z", home: "Elche CF", away: "Espanyol Barcelona", tournament: "LaLiga", country: "Spain", countryCode: "ESP", homeOdds: 2.45, drawOdds: 3.25, awayOdds: 3.1 },
    { order: 4, kickoffTime: "2026-03-01T14:00:00Z", home: "Brighton & Hove Albion", away: "Nottingham Forest", tournament: "Premier League", country: "England", countryCode: "ENG", homeOdds: 2.09, drawOdds: 3.5, awayOdds: 3.35 },
    { order: 5, kickoffTime: "2026-03-01T14:00:00Z", home: "US Catanzaro", away: "Frosinone Calcio", tournament: "Serie B", country: "Italy", countryCode: "ITA", homeOdds: 2.7, drawOdds: 3.1, awayOdds: 2.5 },
    { order: 6, kickoffTime: "2026-03-01T14:00:00Z", home: "Paris FC", away: "OGC Nice", tournament: "Ligue 1", country: "France", countryCode: "FRA", homeOdds: 2.45, drawOdds: 3.4, awayOdds: 2.95 },
    { order: 7, kickoffTime: "2026-03-01T15:15:00Z", home: "CD Mirandes", away: "AD Ceuta", tournament: "LaLiga 2", country: "Spain", countryCode: "ESP", homeOdds: 2.4, drawOdds: 3.15, awayOdds: 2.9 },
    { order: 8, kickoffTime: "2026-03-01T15:15:00Z", home: "Valencia CF", away: "CA Osasuna", tournament: "LaLiga", country: "Spain", countryCode: "ESP", homeOdds: 2.38, drawOdds: 3.2, awayOdds: 3.25 },
    { order: 9, kickoffTime: "2026-03-01T15:45:00Z", home: "FC Utrecht", away: "AZ Alkmaar", tournament: "Eredivisie", country: "Netherlands", countryCode: "NLD", homeOdds: 2.28, drawOdds: 3.5, awayOdds: 2.9 },
    { order: 10, kickoffTime: "2026-03-01T16:00:00Z", home: "FC Fredericia", away: "Silkeborg IF", tournament: "Superliga", country: "Denmark", countryCode: "DNK", homeOdds: 2.55, drawOdds: 3.7, awayOdds: 2.5 },
    { order: 11, kickoffTime: "2026-03-01T16:00:00Z", home: "Wolfsberger AC", away: "SK Sturm Graz", tournament: "Bundesliga", country: "Austria", countryCode: "AUT", homeOdds: 2.37, drawOdds: 3.2, awayOdds: 2.6 },
    { order: 12, kickoffTime: "2026-03-01T16:30:00Z", home: "Eintracht Frankfurt", away: "SC Freiburg", tournament: "Bundesliga", country: "Germany", countryCode: "DEU", homeOdds: 2.25, drawOdds: 3.5, awayOdds: 3.2 },
    { order: 13, kickoffTime: "2026-03-01T17:00:00Z", home: "Torino FC", away: "Lazio Rome", tournament: "Serie A", country: "Italy", countryCode: "ITA", homeOdds: 2.9, drawOdds: 3.0, awayOdds: 2.75 },
    { order: 14, kickoffTime: "2026-03-01T18:00:00Z", home: "Casa Pia Lisbon", away: "Moreirense FC", tournament: "Liga Portugal", country: "Portugal", countryCode: "PRT", homeOdds: 2.7, drawOdds: 3.05, awayOdds: 2.8 },
    { order: 15, kickoffTime: "2026-03-01T19:00:00Z", home: "Excelsior Rotterdam", away: "Go Ahead Eagles", tournament: "Eredivisie", country: "Netherlands", countryCode: "NLD", homeOdds: 2.39, drawOdds: 3.45, awayOdds: 2.8 },
    { order: 16, kickoffTime: "2026-03-01T19:45:00Z", home: "AS Roma", away: "Juventus Turin", tournament: "Serie A", country: "Italy", countryCode: "ITA", homeOdds: 2.65, drawOdds: 3.1, awayOdds: 2.95 },
    { order: 17, kickoffTime: "2026-03-01T20:00:00Z", home: "Girona FC", away: "RC Celta de Vigo", tournament: "LaLiga", country: "Spain", countryCode: "ESP", homeOdds: 2.5, drawOdds: 3.35, awayOdds: 2.9 },
  ],
};

// ─── Helper: parse "17/17" → 17 ───
function parseGamesPlayed(jackpotType: string): number {
  return parseInt(jackpotType.split("/")[0], 10);
}

// ─── Helper: parse "Category3" → 3, "Jackpot" → 0 ───
function parseMissedCount(category: string): number {
  if (category === "Jackpot") return 0;
  return parseInt(category.replace("Category", ""), 10);
}

// ─── Helper: parse "0:1" → { home: 0, away: 1 } ───
function parseScore(score: string): { home: number; away: number } {
  const [h, a] = score.split(":").map(Number);
  return { home: h, away: a };
}

async function main() {
  console.log("🚀 Starting jackpot seed...\n");

  // ── 1. Seed finished jackpot #169 ──
  console.log("📦 Inserting Jackpot #169 (Finished)...");

  const jp169 = await prisma.jackpot.upsert({
    where: { humanId: 169 },
    update: {},
    create: {
      humanId: 169,
      type: "MEGA",
      status: "FINISHED",
      bettingStatus: "CLOSED",
      finishedAt: new Date(finishedJackpot.finished),
    },
  });
  console.log("  ✓ Jackpot #169 created:", jp169.id);

  // Events for #169
  for (const ev of finishedJackpot.events) {
    const { home, away } = parseScore(ev.score);
    await prisma.event.upsert({
      where: { jackpotId_eventOrder: { jackpotId: jp169.id, eventOrder: ev.eventNumber } },
      update: {},
      create: {
        jackpotId: jp169.id,
        eventOrder: ev.eventNumber,
        kickoffTime: new Date(ev.kickoffTime),
        homeTeam: ev.competitorHome,
        awayTeam: ev.competitorAway,
        resultPick: ev.resultPick,
        homeScore: home,
        awayScore: away,
      },
    });
  }
  console.log("  ✓ 17 events created for #169");

  // Prizes for #169
  for (const p of finishedJackpot.prizes) {
    const gamesPlayed = parseGamesPlayed(p.jackpotType);
    await prisma.prize.upsert({
      where: { jackpotId_gamesPlayed: { jackpotId: jp169.id, gamesPlayed } },
      update: {},
      create: {
        jackpotId: jp169.id,
        gamesPlayed,
        amount: p.prize,
      },
    });
  }
  console.log("  ✓ 5 prizes created for #169");

  // Payout breakdowns for #169
  for (const dist of finishedJackpot.winningDistribution) {
    const gamesPlayed = parseGamesPlayed(dist.jackpotType);
    for (const wa of dist.winningAmounts) {
      const missedCount = parseMissedCount(wa.category);
      await prisma.payoutBreakdown.upsert({
        where: {
          jackpotId_gamesPlayed_missedCount: {
            jackpotId: jp169.id,
            gamesPlayed,
            missedCount,
          },
        },
        update: {},
        create: {
          jackpotId: jp169.id,
          gamesPlayed,
          missedCount,
          prizePool: wa.prize,
          winnerCount: wa.countWinnings,
          prizePerWinner: wa.winningAmount,
        },
      });
    }
  }
  console.log("  ✓ 30 payout breakdowns created for #169");

  // ── 2. Seed active jackpot #170 ──
  console.log("\n📦 Inserting Jackpot #170 (Active)...");

  const jp170 = await prisma.jackpot.upsert({
    where: { humanId: 170 },
    update: {},
    create: {
      humanId: 170,
      type: "MEGA",
      status: "OPEN",
      bettingStatus: "OPEN",
    },
  });
  console.log("  ✓ Jackpot #170 created:", jp170.id);

  // Events for #170
  for (const ev of activeJackpot.events) {
    await prisma.event.upsert({
      where: { jackpotId_eventOrder: { jackpotId: jp170.id, eventOrder: ev.order } },
      update: {},
      create: {
        jackpotId: jp170.id,
        eventOrder: ev.order,
        kickoffTime: new Date(ev.kickoffTime),
        homeTeam: ev.home,
        awayTeam: ev.away,
        tournament: ev.tournament,
        country: ev.country,
        countryCode: ev.countryCode,
        homeOdds: ev.homeOdds,
        drawOdds: ev.drawOdds,
        awayOdds: ev.awayOdds,
      },
    });
  }
  console.log("  ✓ 17 events created for #170");

  console.log("\n✅ Seed complete! Inserted 2 jackpots with all related data.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
