-- CreateEnum
CREATE TYPE "CompanySource" AS ENUM ('EDR', 'OSM', 'WEBSITE', 'OPENDATABOT', 'PROZORRO', 'MANUAL');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LIQUIDATED', 'UNKNOWN');

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "edrpou" VARCHAR(10),
    "name" VARCHAR(500) NOT NULL,
    "normalizedName" VARCHAR(500) NOT NULL,
    "status" "CompanyStatus" NOT NULL DEFAULT 'UNKNOWN',
    "region" VARCHAR(120),
    "city" VARCHAR(120),
    "address" VARCHAR(500),
    "kvedCode" VARCHAR(10),
    "kvedName" VARCHAR(500),
    "website" VARCHAR(255),
    "phone" VARCHAR(32),
    "email" VARCHAR(255),
    "source" "CompanySource" NOT NULL,
    "sourceId" VARCHAR(120),
    "sourceUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_edrpou_key" ON "companies"("edrpou");

-- CreateIndex
CREATE INDEX "companies_normalizedName_idx" ON "companies"("normalizedName");

-- CreateIndex
CREATE INDEX "companies_city_idx" ON "companies"("city");

-- CreateIndex
CREATE INDEX "companies_region_idx" ON "companies"("region");

-- CreateIndex
CREATE INDEX "companies_kvedCode_idx" ON "companies"("kvedCode");

-- CreateIndex
CREATE INDEX "companies_source_idx" ON "companies"("source");

-- CreateIndex
CREATE INDEX "companies_createdAt_idx" ON "companies"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "companies_source_sourceId_key" ON "companies"("source", "sourceId");
