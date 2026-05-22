-- AlterTable
ALTER TABLE "company_settings"
ADD COLUMN IF NOT EXISTS "page_heroes" JSONB NOT NULL DEFAULT '{}';
