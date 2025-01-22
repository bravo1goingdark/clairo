/*
  Warnings:

  - You are about to drop the column `unprocessedURLs` on the `Video` table. All the data in the column will be lost.
  - Added the required column `s3UnprocessedKey` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Video` DROP COLUMN `unprocessedURLs`,
    ADD COLUMN `s3UnprocessedKey` VARCHAR(191) NOT NULL,
    MODIFY `s3Key` VARCHAR(191) NULL,
    MODIFY `resolutions` VARCHAR(191) NULL,
    MODIFY `processedURLs` JSON NULL;
