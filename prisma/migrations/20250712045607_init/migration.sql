/*
  Warnings:

  - You are about to drop the `QuizResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quizzes` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "courseId" INTEGER,
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "image" SET DATA TYPE TEXT,
ALTER COLUMN "youtubeUrl" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "QuizResult";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "quizzes";

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
