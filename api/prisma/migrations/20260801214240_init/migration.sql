-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODER', 'EDITOR');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access" (
    "id" UUID NOT NULL,
    "ip" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "chapters" INTEGER NOT NULL DEFAULT 0,
    "verses" INTEGER NOT NULL DEFAULT 0,
    "authors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "verses" INTEGER NOT NULL DEFAULT 0,
    "authors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verses" (
    "id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "authors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentaries" (
    "id" UUID NOT NULL,
    "verse_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "authors_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commentaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "references" (
    "id" UUID NOT NULL,
    "verse_id" UUID NOT NULL,
    "verse_reference_id" UUID NOT NULL,
    "authors_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "access_ip_browser_state_city_book_chapter_idx" ON "access"("ip", "browser", "state", "city", "book", "chapter");

-- CreateIndex
CREATE INDEX "access_createdAt_idx" ON "access"("createdAt");

-- CreateIndex
CREATE INDEX "access_updatedAt_idx" ON "access"("updatedAt");

-- CreateIndex
CREATE INDEX "access_state_idx" ON "access"("state");

-- CreateIndex
CREATE INDEX "access_city_idx" ON "access"("city");

-- CreateIndex
CREATE INDEX "access_book_idx" ON "access"("book");

-- CreateIndex
CREATE INDEX "access_chapter_idx" ON "access"("chapter");

-- CreateIndex
CREATE UNIQUE INDEX "books_name_key" ON "books"("name");

-- CreateIndex
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");

-- CreateIndex
CREATE INDEX "books_name_idx" ON "books"("name");

-- CreateIndex
CREATE INDEX "books_slug_idx" ON "books"("slug");

-- CreateIndex
CREATE INDEX "books_authors_idx" ON "books"("authors");

-- CreateIndex
CREATE INDEX "chapters_number_idx" ON "chapters"("number");

-- CreateIndex
CREATE INDEX "chapters_book_id_idx" ON "chapters"("book_id");

-- CreateIndex
CREATE INDEX "chapters_authors_idx" ON "chapters"("authors");

-- CreateIndex
CREATE INDEX "verses_number_idx" ON "verses"("number");

-- CreateIndex
CREATE INDEX "verses_chapter_id_idx" ON "verses"("chapter_id");

-- CreateIndex
CREATE INDEX "verses_text_idx" ON "verses"("text");

-- CreateIndex
CREATE INDEX "verses_authors_idx" ON "verses"("authors");

-- CreateIndex
CREATE INDEX "verses_version_idx" ON "verses"("version");

-- CreateIndex
CREATE INDEX "commentaries_verse_id_idx" ON "commentaries"("verse_id");

-- CreateIndex
CREATE INDEX "commentaries_text_idx" ON "commentaries"("text");

-- CreateIndex
CREATE INDEX "references_verse_id_idx" ON "references"("verse_id");

-- CreateIndex
CREATE INDEX "references_verse_reference_id_idx" ON "references"("verse_reference_id");

-- CreateIndex
CREATE INDEX "references_authors_id_idx" ON "references"("authors_id");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verses" ADD CONSTRAINT "verses_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaries" ADD CONSTRAINT "commentaries_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaries" ADD CONSTRAINT "commentaries_authors_id_fkey" FOREIGN KEY ("authors_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "references" ADD CONSTRAINT "references_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "references" ADD CONSTRAINT "references_verse_reference_id_fkey" FOREIGN KEY ("verse_reference_id") REFERENCES "verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "references" ADD CONSTRAINT "references_authors_id_fkey" FOREIGN KEY ("authors_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
