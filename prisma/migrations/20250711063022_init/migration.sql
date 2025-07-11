/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `videos` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `videos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `youtubeUrl` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" DROP COLUMN "imageUrl",
DROP COLUMN "publicId",
DROP COLUMN "videoUrl",
ADD COLUMN     "image" VARCHAR(500),
ADD COLUMN     "youtubeUrl" VARCHAR(500) NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);
