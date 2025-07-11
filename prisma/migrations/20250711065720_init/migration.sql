-- CreateTable
CREATE TABLE "quizzes" (
    "id" SERIAL NOT NULL,
    "questionType" VARCHAR(10) NOT NULL,
    "question" TEXT NOT NULL,
    "choices" TEXT[],
    "correct" VARCHAR(1) NOT NULL,
    "score" VARCHAR(10) NOT NULL,
    "phase" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);
