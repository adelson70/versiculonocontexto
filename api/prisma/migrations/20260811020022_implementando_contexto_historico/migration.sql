-- CreateTable
CREATE TABLE "backgrounds" (
    "id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "context" TEXT,
    "authors_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "backgrounds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "backgrounds_chapter_id_idx" ON "backgrounds"("chapter_id");

-- CreateIndex
CREATE INDEX "backgrounds_context_idx" ON "backgrounds"("context");

-- CreateIndex
CREATE INDEX "backgrounds_authors_id_idx" ON "backgrounds"("authors_id");

-- AddForeignKey
ALTER TABLE "backgrounds" ADD CONSTRAINT "backgrounds_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backgrounds" ADD CONSTRAINT "backgrounds_authors_id_fkey" FOREIGN KEY ("authors_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
