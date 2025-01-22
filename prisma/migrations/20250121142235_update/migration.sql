-- DropIndex
DROP INDEX `Video_id_idx` ON `Video`;

-- CreateIndex
CREATE INDEX `Video_id_s3Key_s3UnprocessedKey_idx` ON `Video`(`id`, `s3Key`, `s3UnprocessedKey`);
