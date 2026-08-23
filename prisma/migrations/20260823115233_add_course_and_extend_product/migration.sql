-- AlterTable
ALTER TABLE "Product" ADD COLUMN "benefits" TEXT;
ALTER TABLE "Product" ADD COLUMN "href" TEXT;
ALTER TABLE "Product" ADD COLUMN "subtitle" TEXT;
ALTER TABLE "Product" ADD COLUMN "variantsNote" TEXT;

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "image" TEXT NOT NULL,
    "price" INTEGER,
    "originalPrice" INTEGER,
    "shortDescription" TEXT NOT NULL,
    "enrollHref" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
