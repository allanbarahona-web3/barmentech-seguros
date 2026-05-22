-- AlterTable
ALTER TABLE "company_settings"
ADD COLUMN IF NOT EXISTS "legal_docs" JSONB NOT NULL DEFAULT '[]';
