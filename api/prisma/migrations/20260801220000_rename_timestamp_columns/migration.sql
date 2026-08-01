-- Rename timestamp columns from camelCase to snake_case (preserves existing data)

ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "users" ADD COLUMN "last_login" TIMESTAMP(3);

ALTER TABLE "access" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "access" RENAME COLUMN "updatedAt" TO "updated_at";

DROP INDEX IF EXISTS "access_createdAt_idx";
DROP INDEX IF EXISTS "access_updatedAt_idx";
CREATE INDEX "access_created_at_idx" ON "access"("created_at");
CREATE INDEX "access_updated_at_idx" ON "access"("updated_at");

ALTER TABLE "books" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "books" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "chapters" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "chapters" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "verses" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "verses" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "commentaries" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "commentaries" RENAME COLUMN "updatedAt" TO "updated_at";

ALTER TABLE "references" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "references" RENAME COLUMN "updatedAt" TO "updated_at";
