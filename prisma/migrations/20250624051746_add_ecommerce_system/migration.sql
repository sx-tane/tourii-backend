/*
  Add E-commerce and Shop System

  This migration adds comprehensive e-commerce functionality to the Tourii application:
  - Shopping cart system for persistent user carts
  - Order management system with full lifecycle tracking
  - Payment processing support with multiple gateways
  - Integration with existing onchain_item_catalog for perk sales
*/

-- Add new enums for e-commerce system
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'FULFILLED', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'FAILED');
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY', 'CREDIT_CARD', 'CRYPTO', 'MAGATAMA_POINTS');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'REQUIRES_ACTION');

-- Create ID generation function for cart
CREATE OR REPLACE FUNCTION generate_cart_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_cart';
    ts TEXT := to_char(NOW() AT TIME ZONE 'Asia/Tokyo', 'YYYYMMDDHH24MI');
    part1 TEXT := substr(ts, 1, 6);   -- YYYYMM
    part2 TEXT := substr(ts, 7);      -- DDHHMI
    rand1 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    rand2 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    composite_key TEXT := id_type || '_' || ts;
    next_val INT;
    obfuscated_counter TEXT;
    base32_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
BEGIN
    -- Atomic counter per timestamp
    INSERT INTO id_sequence (key, ts_prefix, counter)
    VALUES (composite_key, ts, 1)
    ON CONFLICT (key)
    DO UPDATE SET counter = id_sequence.counter + 1
    RETURNING counter INTO next_val;

    -- Obfuscate counter using base32 (4 chars)
    obfuscated_counter := 
        substr(base32_chars, (next_val % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 1024)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32768)::int % 32) + 1, 1);

    -- Final ID structure: UCT + YYYYMM + rand1 + DDHHMI + rand2 + obfCounter
    RETURN 'UCT' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- Create ID generation function for orders
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_order';
    ts TEXT := to_char(NOW() AT TIME ZONE 'Asia/Tokyo', 'YYYYMMDDHH24MI');
    part1 TEXT := substr(ts, 1, 6);   -- YYYYMM
    part2 TEXT := substr(ts, 7);      -- DDHHMI
    rand1 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    rand2 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    composite_key TEXT := id_type || '_' || ts;
    next_val INT;
    obfuscated_counter TEXT;
    base32_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
BEGIN
    -- Atomic counter per timestamp
    INSERT INTO id_sequence (key, ts_prefix, counter)
    VALUES (composite_key, ts, 1)
    ON CONFLICT (key)
    DO UPDATE SET counter = id_sequence.counter + 1
    RETURNING counter INTO next_val;

    -- Obfuscate counter using base32 (4 chars)
    obfuscated_counter := 
        substr(base32_chars, (next_val % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 1024)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32768)::int % 32) + 1, 1);

    -- Final ID structure: UOR + YYYYMM + rand1 + DDHHMI + rand2 + obfCounter
    RETURN 'UOR' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- Create ID generation function for order items
CREATE OR REPLACE FUNCTION generate_order_item_id()
RETURNS TEXT AS $$
DECLARE
    id_type TEXT := 'user_order_item';
    ts TEXT := to_char(NOW() AT TIME ZONE 'Asia/Tokyo', 'YYYYMMDDHH24MI');
    part1 TEXT := substr(ts, 1, 6);   -- YYYYMM
    part2 TEXT := substr(ts, 7);      -- DDHHMI
    rand1 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    rand2 TEXT := substr(md5(gen_random_uuid()::text), 0, 7);
    composite_key TEXT := id_type || '_' || ts;
    next_val INT;
    obfuscated_counter TEXT;
    base32_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
BEGIN
    -- Atomic counter per timestamp
    INSERT INTO id_sequence (key, ts_prefix, counter)
    VALUES (composite_key, ts, 1)
    ON CONFLICT (key)
    DO UPDATE SET counter = id_sequence.counter + 1
    RETURNING counter INTO next_val;

    -- Obfuscate counter using base32 (4 chars)
    obfuscated_counter := 
        substr(base32_chars, (next_val % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 1024)::int % 32) + 1, 1) ||
        substr(base32_chars, ((next_val / 32768)::int % 32) + 1, 1);

    -- Final ID structure: UOI + YYYYMM + rand1 + DDHHMI + rand2 + obfCounter
    RETURN 'UOI' || part1 || '-' || rand1 || '-' || part2 || '-' || rand2 || '-' || obfuscated_counter;
END;
$$ LANGUAGE plpgsql;

-- CreateTable user_cart
CREATE TABLE "user_cart" (
    "cart_id" VARCHAR(255) NOT NULL DEFAULT generate_cart_id(),
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable user_order
CREATE TABLE "user_order" (
    "order_id" VARCHAR(255) NOT NULL DEFAULT generate_order_id(),
    "user_id" TEXT NOT NULL,
    "order_status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal_amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "shipping_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'STRIPE',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_transaction_id" VARCHAR(255),
    "payment_fees" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_completed_at" TIMESTAMP(3),
    "processing_started_at" TIMESTAMP(3),
    "fulfilled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "fulfillment_notes" TEXT,
    "estimated_delivery_date" TIMESTAMP(3),
    "customer_email" VARCHAR(255),
    "customer_phone" VARCHAR(50),
    "billing_address" JSONB,
    "shipping_address" JSONB,
    "customer_notes" TEXT,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable user_order_item
CREATE TABLE "user_order_item" (
    "order_item_id" VARCHAR(255) NOT NULL DEFAULT generate_order_item_id(),
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_description" TEXT,
    "product_image_url" VARCHAR(255),
    "fulfilled_at" TIMESTAMP(3),
    "blockchain_txn_hash" VARCHAR(255),
    "item_status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "fulfillment_notes" TEXT,
    "del_flag" BOOLEAN NOT NULL DEFAULT false,
    "ins_user_id" TEXT NOT NULL DEFAULT 'user',
    "ins_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upd_user_id" TEXT NOT NULL DEFAULT 'user',
    "upd_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT,

    CONSTRAINT "user_order_item_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateIndex
CREATE INDEX "idx_user_cart_user_date" ON "user_cart"("user_id", "added_at");
CREATE INDEX "idx_user_cart_product" ON "user_cart"("product_id");
CREATE UNIQUE INDEX "unique_user_product_cart" ON "user_cart"("user_id", "product_id");

CREATE INDEX "idx_user_order_user_date" ON "user_order"("user_id", "order_date");
CREATE INDEX "idx_user_order_status" ON "user_order"("order_status", "payment_status");
CREATE INDEX "idx_user_order_payment_txn" ON "user_order"("payment_transaction_id");

CREATE INDEX "idx_user_order_item_order" ON "user_order_item"("order_id");
CREATE INDEX "idx_user_order_item_product" ON "user_order_item"("product_id");
CREATE INDEX "idx_user_order_item_fulfilled" ON "user_order_item"("fulfilled_at");

-- AddForeignKey
ALTER TABLE "user_cart" ADD CONSTRAINT "user_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_cart" ADD CONSTRAINT "user_cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "onchain_item_catalog"("onchain_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_order" ADD CONSTRAINT "user_order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_order_item" ADD CONSTRAINT "user_order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "user_order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_order_item" ADD CONSTRAINT "user_order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "onchain_item_catalog"("onchain_item_id") ON DELETE RESTRICT ON UPDATE CASCADE;