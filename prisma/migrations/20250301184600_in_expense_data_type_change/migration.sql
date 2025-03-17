/*
  Warnings:

  - You are about to drop the column `title` on the `payment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "bank_transaction_type" AS ENUM ('opening balanace', 'cash withdraw', 'cash deposite', 'bank adjustment increase', 'bank adjustment reduce', 'bank to bank', 'opening balance');

-- AlterTable
ALTER TABLE "invoice" ALTER COLUMN "discount_on_amount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "title",
ADD COLUMN     "IFSC_code" TEXT,
ADD COLUMN     "account_holder_name" TEXT,
ADD COLUMN     "account_name" TEXT,
ADD COLUMN     "account_number" INTEGER,
ADD COLUMN     "balance" INTEGER,
ADD COLUMN     "update_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "upi_number" TEXT;

-- DropEnum
DROP TYPE "party_type";

-- CreateTable
CREATE TABLE "bank_transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bank_id" UUID NOT NULL,
    "transaction_type" "bank_transaction_type",
    "description" TEXT,
    "date" DATE,
    "amount" DECIMAL,

    CONSTRAINT "bank_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,

    CONSTRAINT "expense_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "expense_category" UUID,
    "bill_amount" DECIMAL,
    "item" TEXT,
    "expense_date" TIMESTAMP(6),
    "payment_type" UUID,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bank_transaction" ADD CONSTRAINT "bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expense_category_fkey" FOREIGN KEY ("expense_category") REFERENCES "expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
