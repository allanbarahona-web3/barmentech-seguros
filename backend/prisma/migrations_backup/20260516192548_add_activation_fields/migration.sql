/*
  Warnings:

  - A unique constraint covering the columns `[activation_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activation_token" TEXT,
ADD COLUMN     "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_activated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locked_until" TIMESTAMP(3),
ADD COLUMN     "token_expiry" TIMESTAMP(3),
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_activation_token_key" ON "users"("activation_token");
