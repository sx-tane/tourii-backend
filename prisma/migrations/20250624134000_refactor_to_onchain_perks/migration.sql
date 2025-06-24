-- Refactor digital perks system to use existing user_onchain_item table
-- This migration removes the redundant user_perk_inventory table and enhances user_onchain_item for perk management

-- First, add new fields to user_onchain_item table for perk management
ALTER TABLE "user_onchain_item" 
    ADD COLUMN "acquisition_type" "AcquisitionType" DEFAULT 'PURCHASE',
    ADD COLUMN "source_id" VARCHAR(50),
    ADD COLUMN "quantity" INTEGER DEFAULT 1,
    ADD COLUMN "expiry_date" TIMESTAMP,
    ADD COLUMN "acquired_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update perk_reservation to reference user_onchain_item_id instead of perk_id
ALTER TABLE "perk_reservation" 
    DROP CONSTRAINT IF EXISTS "perk_reservation_perk_id_fkey",
    DROP COLUMN IF EXISTS "perk_id",
    ADD COLUMN "user_onchain_item_id" VARCHAR(255) NOT NULL DEFAULT '';

-- Add foreign key constraint for perk_reservation to user_onchain_item
ALTER TABLE "perk_reservation" ADD CONSTRAINT "perk_reservation_user_onchain_item_id_fkey" 
    FOREIGN KEY ("user_onchain_item_id") REFERENCES "user_onchain_item"("user_onchain_item_id") 
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop indexes from user_perk_inventory before dropping the table
DROP INDEX IF EXISTS "idx_user_perk_inventory_user_id";
DROP INDEX IF EXISTS "idx_user_perk_inventory_status";
DROP INDEX IF EXISTS "idx_user_perk_inventory_acquisition";
DROP INDEX IF EXISTS "idx_user_perk_inventory_expiry";

-- Drop the redundant user_perk_inventory table
DROP TABLE IF EXISTS "user_perk_inventory" CASCADE;

-- Drop the unused ID generation functions and sequences
DROP FUNCTION IF EXISTS generate_upi_id();
DELETE FROM id_sequence WHERE key = 'UPI';

-- Create new indexes for performance on the enhanced user_onchain_item table
CREATE INDEX "idx_user_onchain_item_perk_management" ON "user_onchain_item"("user_id", "item_type") 
    WHERE "item_type" = 'PERK' AND "del_flag" = false;
CREATE INDEX "idx_user_onchain_item_perk_status" ON "user_onchain_item"("status", "item_type") 
    WHERE "item_type" = 'PERK' AND "del_flag" = false;
CREATE INDEX "idx_user_onchain_item_perk_acquisition" ON "user_onchain_item"("acquisition_type", "source_id") 
    WHERE "item_type" = 'PERK';
CREATE INDEX "idx_user_onchain_item_perk_expiry" ON "user_onchain_item"("expiry_date") 
    WHERE "item_type" = 'PERK' AND "expiry_date" IS NOT NULL;

-- Update perk_reservation indexes
CREATE INDEX "idx_perk_reservation_user_onchain_item" ON "perk_reservation"("user_onchain_item_id");

-- Add constraints for data integrity
ALTER TABLE "user_onchain_item" ADD CONSTRAINT "check_perk_positive_quantity" 
    CHECK ("item_type" != 'PERK' OR "quantity" > 0);

-- Add comments for documentation
COMMENT ON COLUMN "user_onchain_item"."acquisition_type" IS 'How the perk was acquired: QUEST reward, PURCHASE, or GIFT (only for PERK items)';
COMMENT ON COLUMN "user_onchain_item"."source_id" IS 'Reference to quest_id or order_id that generated this perk (only for PERK items)';
COMMENT ON COLUMN "user_onchain_item"."quantity" IS 'Number of perk uses available (only for PERK items, default 1)';
COMMENT ON COLUMN "user_onchain_item"."expiry_date" IS 'When this perk expires and becomes unusable (only for PERK items)';
COMMENT ON COLUMN "user_onchain_item"."acquired_at" IS 'When this perk was acquired (only for PERK items)';

COMMENT ON COLUMN "perk_reservation"."user_onchain_item_id" IS 'Reference to the onchain perk item being reserved';