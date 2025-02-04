/*
  Warnings:

  - You are about to drop the column `processedURLs` on the `Video` table. All the data in the column will be lost.
  - Made the column `resolutions` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Video` DROP COLUMN `processedURLs`,
    MODIFY `resolutions` VARCHAR(191) NOT NULL;
