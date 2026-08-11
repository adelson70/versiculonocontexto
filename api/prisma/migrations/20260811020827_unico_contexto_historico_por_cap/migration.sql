/*
  Warnings:

  - A unique constraint covering the columns `[chapter_id]` on the table `backgrounds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "backgrounds_chapter_id_key" ON "backgrounds"("chapter_id");
