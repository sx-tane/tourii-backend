-- DropForeignKey
ALTER TABLE "tourist_spot" DROP CONSTRAINT "tourist_spot_model_route_id_fkey";

-- AlterTable
ALTER TABLE "tourist_spot" ALTER COLUMN "model_route_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "route_tourist_spot" (
    "model_route_id" TEXT NOT NULL,
    "tourist_spot_id" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 1,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'system',

    CONSTRAINT "route_tourist_spot_pkey" PRIMARY KEY ("model_route_id","tourist_spot_id")
);

-- CreateIndex
CREATE INDEX "route_tourist_spot_tourist_spot_id_idx" ON "route_tourist_spot"("tourist_spot_id");

-- CreateIndex
CREATE INDEX "route_tourist_spot_display_order_idx" ON "route_tourist_spot"("display_order");

-- AddForeignKey
ALTER TABLE "tourist_spot" ADD CONSTRAINT "tourist_spot_model_route_id_fkey" FOREIGN KEY ("model_route_id") REFERENCES "model_route"("model_route_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_tourist_spot" ADD CONSTRAINT "route_tourist_spot_model_route_id_fkey" FOREIGN KEY ("model_route_id") REFERENCES "model_route"("model_route_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_tourist_spot" ADD CONSTRAINT "route_tourist_spot_tourist_spot_id_fkey" FOREIGN KEY ("tourist_spot_id") REFERENCES "tourist_spot"("tourist_spot_id") ON DELETE CASCADE ON UPDATE CASCADE;
