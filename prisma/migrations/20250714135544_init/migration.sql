/*
  Warnings:

  - You are about to drop the `QuizResult` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lesson` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseType` to the `videos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lesson` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "lesson" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "courseType" TEXT NOT NULL,
ADD COLUMN     "lesson" INTEGER NOT NULL;

-- DropTable
DROP TABLE "QuizResult";

-- CreateTable
CREATE TABLE "quiz_results" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizType" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "lesson" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseType" TEXT NOT NULL,
    "lesson" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_results_userId_quizType_phase_lesson_key" ON "quiz_results"("userId", "quizType", "phase", "lesson");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_userId_courseType_lesson_key" ON "user_progress"("userId", "courseType", "lesson");

-- AddForeignKey
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
