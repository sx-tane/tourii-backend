/*
  Warnings:

  - Added the required column `region` to the `model_route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region_latitude` to the `model_route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region_longitude` to the `model_route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "model_route" ADD COLUMN     "region" VARCHAR(255) NOT NULL,
ADD COLUMN     "region_background_media" VARCHAR(255),
ADD COLUMN     "region_latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "region_longitude" DOUBLE PRECISION NOT NULL;
