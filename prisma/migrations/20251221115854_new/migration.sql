/*
  Warnings:

  - You are about to drop the column `date` on the `pricingrule` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `pricingrule` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `PricingRule_date_idx` ON `pricingrule`;

-- AlterTable
ALTER TABLE `pricingrule` DROP COLUMN `date`,
    DROP COLUMN `isActive`,
    ADD COLUMN `dayType` ENUM('WORKDAY', 'WEEKEND') NULL;

-- CreateIndex
CREATE INDEX `PricingRule_dayType_idx` ON `PricingRule`(`dayType`);
