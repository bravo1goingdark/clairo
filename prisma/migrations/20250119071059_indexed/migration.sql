-- CreateIndex
CREATE INDEX `User_id_username_email_idx` ON `User`(`id`, `username`, `email`);

-- CreateIndex
CREATE INDEX `Video_id_idx` ON `Video`(`id`);
