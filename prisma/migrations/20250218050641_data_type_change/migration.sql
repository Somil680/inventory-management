/*
  Warnings:

  - You are about to drop the column `taxes` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `transaction` on the `product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "gst_category" AS ENUM ('reg_composite', 'unregistered', 'reg_regular');

-- CreateEnum
CREATE TYPE "invoice_type" AS ENUM ('cash', 'purchase', 'sale_return', 'purchase_return', 'add_stock', 'reduce_stock', 'payment_in', 'payment_out', 'credit');

-- CreateEnum
CREATE TYPE "party_type" AS ENUM ('to_pay', 'to_receive ');

-- AlterTable
ALTER TABLE "product" DROP COLUMN "taxes",
DROP COLUMN "transaction",
ADD COLUMN     "taxs" INTEGER;

-- CreateTable
CREATE TABLE "invoice" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invoice_no" TEXT,
    "invoice_date" TIMESTAMP(6),
    "invoice_type" "invoice_type",
    "billing_name" TEXT,
    "party_id" UUID,
    "discount_on_amount" INTEGER NOT NULL DEFAULT 0,
    "bill_amount" INTEGER,
    "payment_type" UUID,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invoice_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "price_per_unit" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "invoice_product_pkey" PRIMARY KEY ("id","invoice_id")
);

-- CreateTable
CREATE TABLE "party" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "contact" BIGINT,
    "gstIn" TEXT,
    "gst_type" "gst_category",
    "address" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "pay_amount" INTEGER,
    "receive_amount" INTEGER,

    CONSTRAINT "party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,

    CONSTRAINT "payment_key" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_product_unique_combination" ON "invoice_product"("invoice_id", "product_id");

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoices_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "party"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoices_payment_id_fkey" FOREIGN KEY ("payment_type") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_product" ADD CONSTRAINT "invoice_product_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoice_product" ADD CONSTRAINT "invoice_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
