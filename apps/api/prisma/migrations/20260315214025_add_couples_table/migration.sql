-- CreateTable
CREATE TABLE "couples" (
    "id" TEXT NOT NULL,
    "name_1" TEXT NOT NULL,
    "last_name_1" TEXT NOT NULL,
    "name_2" TEXT NOT NULL,
    "last_name2" TEXT NOT NULL,
    "email_1" TEXT NOT NULL,
    "email_2" TEXT,
    "phone_1" TEXT,
    "phone_2" TEXT,
    "language" TEXT,
    "wedding_date" TIMESTAMP(3),
    "location" TEXT,
    "state" TEXT,
    "pack" TEXT,

    CONSTRAINT "couples_pkey" PRIMARY KEY ("id")
);
