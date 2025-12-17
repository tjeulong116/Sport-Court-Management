/*
  Warnings:

  - You are about to drop the column `factory` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `sold` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - Added the required column `brand` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `factory`,
    DROP COLUMN `target`,
    ADD COLUMN `brand` VARCHAR(255) NOT NULL,
    ADD COLUMN `level` VARCHAR(255) NOT NULL,
    MODIFY `image` VARCHAR(255) NULL,
    MODIFY `sold` INTEGER NULL DEFAULT 0;
