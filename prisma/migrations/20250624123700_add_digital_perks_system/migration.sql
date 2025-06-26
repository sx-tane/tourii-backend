-- Add digital perks and QR redemption system
-- This migration transforms the e-commerce system from physical goods to digital perks

-- First, add new enums for digital perks system
CREATE TYPE "AcquisitionType" AS ENUM ('QUEST', 'PURCHASE', 'GIFT');
CREATE TYPE "PerkStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'CANCELLED');
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "PerkDeliveryMethod" AS ENUM ('INSTANT', 'SCHEDULED', 'MANUAL');

-- Add crypto payment methods to existing enum
ALTER TYPE "PaymentMethod" ADD VALUE 'CRYPTO_ETH';
ALTER TYPE "PaymentMethod" ADD VALUE 'CRYPTO_BTC';

-- Add new ID generation sequences for perk system
INSERT INTO id_sequence (key, ts_prefix, counter) VALUES ('UPI', '2025', 1);  -- User Perk Inventory
INSERT INTO id_sequence (key, ts_prefix, counter) VALUES ('UPR', '2025', 1);  -- User Perk Reservation

-- Create custom ID generation functions for new entities
CREATE OR REPLACE FUNCTION generate_upi_id() RETURNS VARCHAR(50) AS $$
DECLARE
    seq_record RECORD;
    new_id VARCHAR(50);
    current_month VARCHAR(2);
    current_day VARCHAR(2);
    current_hour VARCHAR(2);
    current_minute VARCHAR(2);
    rand_part1 VARCHAR(3);
    rand_part2 VARCHAR(3);
    obf_counter VARCHAR(5);
BEGIN
    -- Get and update sequence
    SELECT * INTO seq_record FROM id_sequence WHERE key = 'UPI' FOR UPDATE;
    UPDATE id_sequence SET counter = counter + 1 WHERE key = 'UPI';
    
    -- Generate components
    current_month := LPAD(EXTRACT(month FROM NOW())::text, 2, '0');
    current_day := LPAD(EXTRACT(day FROM NOW())::text, 2, '0');
    current_hour := LPAD(EXTRACT(hour FROM NOW())::text, 2, '0');
    current_minute := LPAD(EXTRACT(minute FROM NOW())::text, 2, '0');
    rand_part1 := LPAD((RANDOM() * 999)::int::text, 3, '0');
    rand_part2 := LPAD((RANDOM() * 999)::int::text, 3, '0');
    obf_counter := LPAD(((seq_record.counter * 7 + 13) % 99999)::text, 5, '0');
    
    -- Construct ID: UPI + YYYY + MM + '-' + rand1 + '-' + DDHHMI + '-' + rand2 + '-' + obfCounter
    new_id := 'UPI' || seq_record.ts_prefix || current_month || '-' || rand_part1 || '-' || 
              current_day || current_hour || current_minute || '-' || rand_part2 || '-' || obf_counter;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_upr_id() RETURNS VARCHAR(50) AS $$
DECLARE
    seq_record RECORD;
    new_id VARCHAR(50);
    current_month VARCHAR(2);
    current_day VARCHAR(2);
    current_hour VARCHAR(2);
    current_minute VARCHAR(2);
    rand_part1 VARCHAR(3);
    rand_part2 VARCHAR(3);
    obf_counter VARCHAR(5);
BEGIN
    -- Get and update sequence
    SELECT * INTO seq_record FROM id_sequence WHERE key = 'UPR' FOR UPDATE;
    UPDATE id_sequence SET counter = counter + 1 WHERE key = 'UPR';
    
    -- Generate components
    current_month := LPAD(EXTRACT(month FROM NOW())::text, 2, '0');
    current_day := LPAD(EXTRACT(day FROM NOW())::text, 2, '0');
    current_hour := LPAD(EXTRACT(hour FROM NOW())::text, 2, '0');
    current_minute := LPAD(EXTRACT(minute FROM NOW())::text, 2, '0');
    rand_part1 := LPAD((RANDOM() * 999)::int::text, 3, '0');
    rand_part2 := LPAD((RANDOM() * 999)::int::text, 3, '0');
    obf_counter := LPAD(((seq_record.counter * 7 + 13) % 99999)::text, 5, '0');
    
    -- Construct ID: UPR + YYYY + MM + '-' + rand1 + '-' + DDHHMI + '-' + rand2 + '-' + obfCounter
    new_id := 'UPR' || seq_record.ts_prefix || current_month || '-' || rand_part1 || '-' || 
              current_day || current_hour || current_minute || '-' || rand_part2 || '-' || obf_counter;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create user_perk_inventory table
CREATE TABLE "user_perk_inventory" (
    "perk_id" VARCHAR(50) NOT NULL DEFAULT generate_upi_id(),
    "user_id" VARCHAR(50) NOT NULL,
    "onchain_item_id" VARCHAR(50) NOT NULL,
    "acquisition_type" "AcquisitionType" NOT NULL DEFAULT 'PURCHASE',
    "source_id" VARCHAR(50),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "expiry_date" TIMESTAMP,
    "status" "PerkStatus" NOT NULL DEFAULT 'ACTIVE',
    "acquired_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Standard audit fields
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" VARCHAR(50) NOT NULL,
    "ins_date_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" VARCHAR(50) NOT NULL,
    "upd_date_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" VARCHAR(50),

    CONSTRAINT "user_perk_inventory_pkey" PRIMARY KEY ("perk_id")
);

-- Create perk_reservation table
CREATE TABLE "perk_reservation" (
    "reservation_id" VARCHAR(50) NOT NULL DEFAULT generate_upr_id(),
    "perk_id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "reservation_date" TIMESTAMP NOT NULL,
    "party_size" INTEGER NOT NULL DEFAULT 1,
    "special_requests" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "qr_code_data" TEXT,
    "qr_generated_at" TIMESTAMP,
    "qr_expires_at" TIMESTAMP,
    "redemption_location" VARCHAR(255),
    "redeemed_at" TIMESTAMP,
    "redeemed_by" VARCHAR(50),
    
    -- Standard audit fields
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" VARCHAR(50) NOT NULL,
    "ins_date_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" VARCHAR(50) NOT NULL,
    "upd_date_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" VARCHAR(50),

    CONSTRAINT "perk_reservation_pkey" PRIMARY KEY ("reservation_id")
);

-- Modify user_order table to remove shipping fields and add perk-specific fields
ALTER TABLE "user_order" 
    DROP COLUMN IF EXISTS "shipping_amount",
    DROP COLUMN IF EXISTS "shipping_address",
    DROP COLUMN IF EXISTS "estimated_delivery_date",
    ADD COLUMN "auto_add_to_inventory" BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN "perk_delivery_method" "PerkDeliveryMethod" NOT NULL DEFAULT 'INSTANT';

-- Add foreign key constraints
ALTER TABLE "user_perk_inventory" ADD CONSTRAINT "user_perk_inventory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_perk_inventory" ADD CONSTRAINT "user_perk_inventory_onchain_item_id_fkey" FOREIGN KEY ("onchain_item_id") REFERENCES "onchain_item_catalog"("onchain_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "perk_reservation" ADD CONSTRAINT "perk_reservation_perk_id_fkey" FOREIGN KEY ("perk_id") REFERENCES "user_perk_inventory"("perk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "perk_reservation" ADD CONSTRAINT "perk_reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create indexes for performance
CREATE INDEX "idx_user_perk_inventory_user_id" ON "user_perk_inventory"("user_id");
CREATE INDEX "idx_user_perk_inventory_status" ON "user_perk_inventory"("status") WHERE "del_flag" = false;
CREATE INDEX "idx_user_perk_inventory_acquisition" ON "user_perk_inventory"("acquisition_type", "source_id");
CREATE INDEX "idx_user_perk_inventory_expiry" ON "user_perk_inventory"("expiry_date") WHERE "expiry_date" IS NOT NULL;

CREATE INDEX "idx_perk_reservation_user_id" ON "perk_reservation"("user_id");
CREATE INDEX "idx_perk_reservation_perk_id" ON "perk_reservation"("perk_id");
CREATE INDEX "idx_perk_reservation_status" ON "perk_reservation"("status") WHERE "del_flag" = false;
CREATE INDEX "idx_perk_reservation_date" ON "perk_reservation"("reservation_date");
CREATE INDEX "idx_perk_reservation_qr_expires" ON "perk_reservation"("qr_expires_at") WHERE "qr_expires_at" IS NOT NULL;

-- Add constraints for data integrity
ALTER TABLE "user_perk_inventory" ADD CONSTRAINT "check_positive_quantity" CHECK ("quantity" > 0);
ALTER TABLE "perk_reservation" ADD CONSTRAINT "check_positive_party_size" CHECK ("party_size" > 0);
ALTER TABLE "perk_reservation" ADD CONSTRAINT "check_future_reservation" CHECK ("reservation_date" > CURRENT_TIMESTAMP);

-- Add comments for documentation
COMMENT ON TABLE "user_perk_inventory" IS 'Tracks digital perks owned by users from quests or purchases';
COMMENT ON TABLE "perk_reservation" IS 'Manages perk booking/scheduling and QR code generation for redemption';

COMMENT ON COLUMN "user_perk_inventory"."acquisition_type" IS 'How the user acquired this perk: QUEST reward, PURCHASE, or GIFT';
COMMENT ON COLUMN "user_perk_inventory"."source_id" IS 'Reference to quest_id or order_id that generated this perk';
COMMENT ON COLUMN "user_perk_inventory"."expiry_date" IS 'When this perk expires and becomes unusable';

COMMENT ON COLUMN "perk_reservation"."qr_code_data" IS 'Generated QR code data for redemption at location';
COMMENT ON COLUMN "perk_reservation"."qr_expires_at" IS 'When the QR code expires for security';
COMMENT ON COLUMN "perk_reservation"."redemption_location" IS 'Location code where perk can be redeemed';
COMMENT ON COLUMN "perk_reservation"."redeemed_by" IS 'Staff or partner who validated the QR code';

COMMENT ON COLUMN "user_order"."auto_add_to_inventory" IS 'Whether purchased perks are automatically added to user inventory';
COMMENT ON COLUMN "user_order"."perk_delivery_method" IS 'How perks are delivered: INSTANT, SCHEDULED, or MANUAL';