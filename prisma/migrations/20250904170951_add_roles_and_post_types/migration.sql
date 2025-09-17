-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('UPLOADER', 'REVIEWER');

-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('BLOG', 'INSTAGRAM', 'VLOG');

-- DropIndex
DROP INDEX "public"."Post_createdAt_published_idx";

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "embedCode" TEXT,
ADD COLUMN     "instagramPostId" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "postType" "public"."PostType" NOT NULL DEFAULT 'BLOG',
ADD COLUMN     "reviewComments" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "status" "public"."PostStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "published" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'UPLOADER';

-- CreateIndex
CREATE INDEX "Post_createdAt_published_status_idx" ON "public"."Post"("createdAt", "published", "status");

-- CreateIndex
CREATE INDEX "Post_status_postType_idx" ON "public"."Post"("status", "postType");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
