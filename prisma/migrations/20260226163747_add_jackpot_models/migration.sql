-- CreateEnum
CREATE TYPE "JackpotType" AS ENUM ('MEGA', 'WEEKLY');

-- CreateEnum
CREATE TYPE "JackpotStatus" AS ENUM ('OPEN', 'FINISHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "BettingStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "PickChoice" AS ENUM ('HOME', 'DRAW', 'AWAY');

-- DropEnum
DROP TYPE "ProviderId";

-- CreateTable
CREATE TABLE "comment_votes" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "comment_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "jackpot_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "body" VARCHAR(10000) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "jackpot_id" TEXT NOT NULL,
    "event_order" SMALLINT NOT NULL,
    "kickoff_time" TIMESTAMP(3) NOT NULL,
    "home_team" VARCHAR(100) NOT NULL,
    "away_team" VARCHAR(100) NOT NULL,
    "tournament" VARCHAR(100),
    "country" VARCHAR(50),
    "country_code" VARCHAR(5),
    "home_odds" DECIMAL(5,2),
    "draw_odds" DECIMAL(5,2),
    "away_odds" DECIMAL(5,2),
    "result_pick" VARCHAR(10),
    "home_score" SMALLINT,
    "away_score" SMALLINT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jackpots" (
    "id" TEXT NOT NULL,
    "human_id" INTEGER NOT NULL,
    "type" "JackpotType" NOT NULL,
    "status" "JackpotStatus" NOT NULL DEFAULT 'OPEN',
    "betting_status" "BettingStatus",
    "opened_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jackpots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pick_sets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jackpot_id" TEXT NOT NULL,
    "name" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pick_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jackpot_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "pick_set_id" TEXT NOT NULL,
    "pick" "PickChoice" NOT NULL,
    "is_correct" BOOLEAN,

    CONSTRAINT "picks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_breakdowns" (
    "id" TEXT NOT NULL,
    "jackpot_id" TEXT NOT NULL,
    "games_played" SMALLINT NOT NULL,
    "missed_count" SMALLINT NOT NULL,
    "prize_pool" DECIMAL(15,2) NOT NULL,
    "winner_count" INTEGER NOT NULL,
    "prize_per_winner" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "payout_breakdowns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prizes" (
    "id" TEXT NOT NULL,
    "jackpot_id" TEXT NOT NULL,
    "games_played" SMALLINT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comment_votes_comment_id_user_id_key" ON "comment_votes"("comment_id", "user_id");

-- CreateIndex
CREATE INDEX "comments_jackpot_id_created_at_idx" ON "comments"("jackpot_id", "created_at");

-- CreateIndex
CREATE INDEX "comments_parent_id_idx" ON "comments"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_jackpot_id_event_order_key" ON "events"("jackpot_id", "event_order");

-- CreateIndex
CREATE UNIQUE INDEX "jackpots_human_id_key" ON "jackpots"("human_id");

-- CreateIndex
CREATE INDEX "picks_user_id_idx" ON "picks"("user_id");

-- CreateIndex
CREATE INDEX "picks_jackpot_id_idx" ON "picks"("jackpot_id");

-- CreateIndex
CREATE INDEX "picks_event_id_pick_idx" ON "picks"("event_id", "pick");

-- CreateIndex
CREATE UNIQUE INDEX "picks_pick_set_id_event_id_key" ON "picks"("pick_set_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "payout_breakdowns_jackpot_id_games_played_missed_count_key" ON "payout_breakdowns"("jackpot_id", "games_played", "missed_count");

-- CreateIndex
CREATE UNIQUE INDEX "prizes_jackpot_id_games_played_key" ON "prizes"("jackpot_id", "games_played");

-- AddForeignKey
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_jackpot_id_fkey" FOREIGN KEY ("jackpot_id") REFERENCES "jackpots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_jackpot_id_fkey" FOREIGN KEY ("jackpot_id") REFERENCES "jackpots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pick_sets" ADD CONSTRAINT "pick_sets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pick_sets" ADD CONSTRAINT "pick_sets_jackpot_id_fkey" FOREIGN KEY ("jackpot_id") REFERENCES "jackpots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picks" ADD CONSTRAINT "picks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picks" ADD CONSTRAINT "picks_jackpot_id_fkey" FOREIGN KEY ("jackpot_id") REFERENCES "jackpots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picks" ADD CONSTRAINT "picks_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picks" ADD CONSTRAINT "picks_pick_set_id_fkey" FOREIGN KEY ("pick_set_id") REFERENCES "pick_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_breakdowns" ADD CONSTRAINT "payout_breakdowns_jackpot_id_fkey" FOREIGN KEY ("jackpot_id") REFERENCES "jackpots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_jackpot_id_fkey" FOREIGN KEY ("jackpot_id") REFERENCES "jackpots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
