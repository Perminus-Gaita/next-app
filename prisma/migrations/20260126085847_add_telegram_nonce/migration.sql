-- CreateTable
CREATE TABLE "telegram_nonce" (
    "id" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "telegramId" BIGINT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_nonce_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telegram_nonce_nonce_key" ON "telegram_nonce"("nonce");
