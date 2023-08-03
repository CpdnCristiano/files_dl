/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `TiktokId` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TiktokId_url_key` ON `TiktokId`(`url`);
