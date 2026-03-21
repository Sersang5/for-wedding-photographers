ALTER TABLE "couples" RENAME TO "weddings";

DO $$
BEGIN
  IF to_regclass('public.couples_pack_id_idx') IS NOT NULL THEN
    ALTER INDEX "couples_pack_id_idx" RENAME TO "weddings_pack_id_idx";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'couples_pkey'
  ) THEN
    ALTER TABLE "weddings" RENAME CONSTRAINT "couples_pkey" TO "weddings_pkey";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'couples_pack_id_fkey'
  ) THEN
    ALTER TABLE "weddings" RENAME CONSTRAINT "couples_pack_id_fkey" TO "weddings_pack_id_fkey";
  END IF;
END $$;
