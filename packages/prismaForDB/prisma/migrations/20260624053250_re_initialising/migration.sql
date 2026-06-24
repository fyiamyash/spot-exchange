/*
  Warnings:

  - Added the required column `side` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "side" TEXT NOT NULL;
