-- CreateTable
CREATE TABLE "company_settings" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "legal_id" TEXT,
    "logo_url" TEXT,
    "signature_url" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone_numbers" JSONB NOT NULL DEFAULT '[]',
    "social_media" JSONB NOT NULL DEFAULT '{}',
    "business_address" TEXT,
    "legal_rep_name" TEXT,
    "legal_rep_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);
