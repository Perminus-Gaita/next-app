/*
  Warnings:

  - Changed the type of `provider_id` on the `accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "provider_id",
ADD COLUMN     "provider_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "accounts_provider_id_idx" ON "accounts"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_id_provider_id_key" ON "accounts"("account_id", "provider_id");
