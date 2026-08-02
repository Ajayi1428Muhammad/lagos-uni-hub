-- CreateTable
CREATE TABLE "Listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "campusRunner" TEXT NOT NULL,
    "mediaUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Listings_university_idx" ON "Listings"("university");

-- CreateIndex
CREATE INDEX "Listings_title_idx" ON "Listings"("title");
