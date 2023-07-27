-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `errorMessage` VARCHAR(191) NULL,
    `size` INTEGER NOT NULL,
    `urlId` INTEGER NOT NULL,
    `type` VARCHAR(191) NULL,
    `quality` VARCHAR(191) NULL,

    UNIQUE INDEX `File_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Url` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Url_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_urlId_fkey` FOREIGN KEY (`urlId`) REFERENCES `Url`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
