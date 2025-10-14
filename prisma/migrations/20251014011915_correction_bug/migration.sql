/*
  Warnings:

  - You are about to drop the column `ingrediants` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "ingrediants",
ADD COLUMN     "ingredients" TEXT[];
