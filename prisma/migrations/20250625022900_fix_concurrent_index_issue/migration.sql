/*
  Fix migration issue: Remove CONCURRENTLY from index creation
  
  This migration fixes the error "CREATE INDEX CONCURRENTLY cannot run inside a transaction block"
  by dropping the failed concurrent indexes and recreating them without CONCURRENTLY.
*/

-- Drop the failed concurrent indexes if they exist (they might be partially created)
DROP INDEX IF EXISTS "idx_user_order_currency";
DROP INDEX IF EXISTS "idx_user_order_payment_method";
DROP INDEX IF EXISTS "idx_user_order_customer_email";
DROP INDEX IF EXISTS "idx_user_cart_active";
DROP INDEX IF EXISTS "idx_user_order_active";
DROP INDEX IF EXISTS "idx_user_order_item_active";

-- Recreate indexes without CONCURRENTLY (can run inside transaction)
CREATE INDEX "idx_user_order_currency" ON "user_order"("currency");
CREATE INDEX "idx_user_order_payment_method" ON "user_order"("payment_method");
CREATE INDEX "idx_user_order_customer_email" ON "user_order"("customer_email") WHERE "customer_email" IS NOT NULL;

-- Add partial indexes for better query performance
CREATE INDEX "idx_user_cart_active" ON "user_cart"("user_id", "added_at") WHERE "del_flag" = false;
CREATE INDEX "idx_user_order_active" ON "user_order"("user_id", "order_date") WHERE "del_flag" = false;
CREATE INDEX "idx_user_order_item_active" ON "user_order_item"("order_id") WHERE "del_flag" = false;