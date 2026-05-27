-- CreateTable
CREATE TABLE "additional_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "full_description" TEXT,
    "base_price" DOUBLE PRECISION NOT NULL,
    "pricing_type" TEXT NOT NULL DEFAULT 'per_trip',
    "coverage_levels" JSONB NOT NULL DEFAULT '[]',
    "icon_url" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "features" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "additional_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "additional_services_slug_key" ON "additional_services"("slug");

-- CreateIndex
CREATE INDEX "additional_services_category_idx" ON "additional_services"("category");

-- CreateIndex
CREATE INDEX "additional_services_is_active_idx" ON "additional_services"("is_active");

-- CreateIndex
CREATE INDEX "additional_services_display_order_idx" ON "additional_services"("display_order");
