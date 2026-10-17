-- AlterTable Course
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "livePrice" INTEGER;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "liveOriginalPrice" INTEGER;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "nextBatch" TEXT;

-- AlterTable OrderItem
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "purchase_mode" TEXT;

-- AlterTable Payment
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "purchase_mode" TEXT;
