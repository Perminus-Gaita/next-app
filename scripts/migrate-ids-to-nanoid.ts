/**
 * Data Migration: cuid(2) → nanoid IDs
 *
 * Usage:
 *   npx tsx scripts/migrate-ids-to-nanoid.ts          # Dry run
 *   npx tsx scripts/migrate-ids-to-nanoid.ts --execute # Apply changes
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { nanoid } from "nanoid";

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) { console.error("❌ DATABASE_URL not set"); process.exit(1); }
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const isDryRun = !process.argv.includes("--execute");

if (isDryRun) {
  console.log("══════════════════════════════════════════════");
  console.log("  🏃 DRY RUN MODE — No changes will be made");
  console.log("  Run with --execute to apply changes");
  console.log("══════════════════════════════════════════════");
  console.log("");
}

async function buildIdMapping(tableName: string, nanoidLength: number) {
  const rows: { id: string }[] = await prisma.$queryRawUnsafe(
    `SELECT id FROM "${tableName}" ORDER BY id`
  );
  const mapping = new Map<string, string>();
  for (const row of rows) {
    mapping.set(row.id, nanoid(nanoidLength));
  }
  return mapping;
}

async function updateColumn(tx: any, tableName: string, columnName: string, mapping: Map<string, string>) {
  if (mapping.size === 0) return 0;

  const entries = [...mapping.entries()];
  const chunkSize = 500;
  let totalUpdated = 0;

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    const oldIds = chunk.map(([oldId]) => oldId);

    let caseExpr = `CASE "${columnName}"`;
    const params: string[] = [];
    let paramIndex = 1;

    for (const [oldId, newId] of chunk) {
      caseExpr += ` WHEN $${paramIndex} THEN $${paramIndex + 1}`;
      params.push(oldId, newId);
      paramIndex += 2;
    }
    caseExpr += ` ELSE "${columnName}" END`;

    const inParams = oldIds.map((_, idx) => `$${paramIndex + idx}`);
    params.push(...oldIds);

    const query = `UPDATE "${tableName}" SET "${columnName}" = ${caseExpr} WHERE "${columnName}" IN (${inParams.join(", ")})`;
    await tx.$executeRawUnsafe(query, ...params);
    totalUpdated += chunk.length;
  }

  return totalUpdated;
}

async function main() {
  console.log("🔍 Counting existing records...");
  console.log("");

  const [jackpotCount] = await prisma.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*)::int as count FROM "jackpots"`
  );
  const [commentCount] = await prisma.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*)::int as count FROM "comments"`
  );
  const [pickSetCount] = await prisma.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*)::int as count FROM "pick_sets"`
  );
  const [pickCount] = await prisma.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*)::int as count FROM "picks"`
  );

  console.log(`  jackpots:   ${jackpotCount.count} rows → nanoid(8)`);
  console.log(`  comments:   ${commentCount.count} rows → nanoid(12)`);
  console.log(`  pick_sets:  ${pickSetCount.count} rows → nanoid(12)`);
  console.log(`  picks:      ${pickCount.count} rows → nanoid(12)`);
  console.log("");

  if (
    jackpotCount.count === 0 &&
    commentCount.count === 0 &&
    pickSetCount.count === 0 &&
    pickCount.count === 0
  ) {
    console.log("✅ No existing records to migrate. You're all set!");
    return;
  }

  console.log("🗺️  Building ID mappings...");
  const jackpotMapping = await buildIdMapping("jackpots", 8);
  const commentMapping = await buildIdMapping("comments", 12);
  const pickSetMapping = await buildIdMapping("pick_sets", 12);
  const pickMapping = await buildIdMapping("picks", 12);
  console.log("  ✓ Mappings built");
  console.log("");

  if (isDryRun) {
    console.log("📋 Sample ID mappings (first 3 per table):");
    console.log("");

    const showSample = (name: string, mapping: Map<string, string>) => {
      const entries = [...mapping.entries()].slice(0, 3);
      if (entries.length === 0) return;
      console.log(`  ${name}:`);
      for (const [oldId, newId] of entries) {
        console.log(`    ${oldId} → ${newId}`);
      }
    };

    showSample("jackpots", jackpotMapping);
    showSample("comments", commentMapping);
    showSample("pick_sets", pickSetMapping);
    showSample("picks", pickMapping);
    console.log("");
    console.log("──────────────────────────────────────────────");
    console.log("  To apply these changes, run:");
    console.log("  npx tsx scripts/migrate-ids-to-nanoid.ts --execute");
    console.log("──────────────────────────────────────────────");
    return;
  }

  console.log("🚀 Executing migration...");
  console.log("");

  await prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe(`SET session_replication_role = 'replica'`);

      if (jackpotMapping.size > 0) {
        console.log("  [1/4] Migrating jackpot IDs...");
        await updateColumn(tx, "events", "jackpot_id", jackpotMapping);
        console.log("    ✓ events.jackpot_id");
        await updateColumn(tx, "prizes", "jackpot_id", jackpotMapping);
        console.log("    ✓ prizes.jackpot_id");
        await updateColumn(tx, "payout_breakdowns", "jackpot_id", jackpotMapping);
        console.log("    ✓ payout_breakdowns.jackpot_id");
        await updateColumn(tx, "pick_sets", "jackpot_id", jackpotMapping);
        console.log("    ✓ pick_sets.jackpot_id");
        await updateColumn(tx, "picks", "jackpot_id", jackpotMapping);
        console.log("    ✓ picks.jackpot_id");
        await updateColumn(tx, "comments", "jackpot_id", jackpotMapping);
        console.log("    ✓ comments.jackpot_id");
        await updateColumn(tx, "jackpots", "id", jackpotMapping);
        console.log(`    ✓ jackpots.id — ${jackpotMapping.size} rows`);
      }

      if (commentMapping.size > 0) {
        console.log("  [2/4] Migrating comment IDs...");
        await updateColumn(tx, "comment_votes", "comment_id", commentMapping);
        console.log("    ✓ comment_votes.comment_id");
        await updateColumn(tx, "comments", "parent_id", commentMapping);
        console.log("    ✓ comments.parent_id (self-ref)");
        await updateColumn(tx, "comments", "id", commentMapping);
        console.log(`    ✓ comments.id — ${commentMapping.size} rows`);
      }

      if (pickSetMapping.size > 0) {
        console.log("  [3/4] Migrating pick set IDs...");
        await updateColumn(tx, "picks", "pick_set_id", pickSetMapping);
        console.log("    ✓ picks.pick_set_id");
        await updateColumn(tx, "pick_sets", "id", pickSetMapping);
        console.log(`    ✓ pick_sets.id — ${pickSetMapping.size} rows`);
      }

      if (pickMapping.size > 0) {
        console.log("  [4/4] Migrating pick IDs...");
        await updateColumn(tx, "picks", "id", pickMapping);
        console.log(`    ✓ picks.id — ${pickMapping.size} rows`);
      }

      await tx.$executeRawUnsafe(`SET session_replication_role = 'origin'`);
    },
    { timeout: 300000 }
  );

  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log("  ✅ Migration complete!");
  console.log("");
  console.log(`  Jackpots:   ${jackpotMapping.size} IDs → nanoid(8)`);
  console.log(`  Comments:   ${commentMapping.size} IDs → nanoid(12)`);
  console.log(`  Pick Sets:  ${pickSetMapping.size} IDs → nanoid(12)`);
  console.log(`  Picks:      ${pickMapping.size} IDs → nanoid(12)`);
  console.log("");
  console.log("  All foreign key references updated.");
  console.log("══════════════════════════════════════════════");
}

main()
  .catch((e) => {
    console.error("");
    console.error("❌ Migration failed (transaction rolled back, no changes made):");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
