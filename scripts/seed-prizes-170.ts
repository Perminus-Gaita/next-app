import { prisma } from "../lib/prisma";

const JACKPOT_ID = "g9gmgzvk2l59cv3re2n92did";

const PRIZES = [
  { gamesPlayed: 17, amount: 117669774 },
  { gamesPlayed: 16, amount: 125255623 },
  { gamesPlayed: 15, amount: 93905371 },
  { gamesPlayed: 14, amount: 27256735 },
  { gamesPlayed: 13, amount: 13945436 },
];

async function main() {
  console.log("🏆 Seeding prizes for Jackpot #170...\n");

  for (const prize of PRIZES) {
    const result = await prisma.prize.upsert({
      where: {
        jackpotId_gamesPlayed: {
          jackpotId: JACKPOT_ID,
          gamesPlayed: prize.gamesPlayed,
        },
      },
      update: {
        amount: prize.amount,
      },
      create: {
        jackpotId: JACKPOT_ID,
        gamesPlayed: prize.gamesPlayed,
        amount: prize.amount,
      },
    });
    console.log(
      `  ✅ ${prize.gamesPlayed}/${prize.gamesPlayed}: KSH ${prize.amount.toLocaleString()} (id: ${result.id})`
    );
  }

  console.log("\n✅ All 5 prize tiers seeded for Jackpot #170!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
