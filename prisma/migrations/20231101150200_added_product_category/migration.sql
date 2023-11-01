/*
  Warnings:

  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ANTIPASTO', 'PRIMO', 'SECONDO', 'DOLCE', 'BEVANDA');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category" NOT NULL;
