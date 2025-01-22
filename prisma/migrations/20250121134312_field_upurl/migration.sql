/*
  Warnings:

  - Added the required column `unprocessedURLs` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Video` ADD COLUMN `unprocessedURLs` VARCHAR(191) NOT NULL;
