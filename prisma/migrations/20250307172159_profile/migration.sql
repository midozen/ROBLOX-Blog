-- AlterTable
ALTER TABLE `user` ADD COLUMN `bio` VARCHAR(191) NULL DEFAULT 'Blog Poster',
    ADD COLUMN `pfp` VARCHAR(191) NOT NULL DEFAULT 'default.png';
