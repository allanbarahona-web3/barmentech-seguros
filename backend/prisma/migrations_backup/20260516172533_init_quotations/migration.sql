-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "quotations" (
    "id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT,
    "client_phone" TEXT,
    "destination" TEXT,
    "travel_date_from" TIMESTAMP(3),
    "travel_date_to" TIMESTAMP(3),
    "global_max_amount" TEXT NOT NULL,
    "validity_territory" TEXT,
    "consecutive_days" TEXT,
    "coverages" JSONB NOT NULL,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "pdf_url" TEXT,
    "original_pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);
