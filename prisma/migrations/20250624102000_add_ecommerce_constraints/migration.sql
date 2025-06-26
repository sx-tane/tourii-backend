/*
  Add data integrity constraints for e-commerce system
  
  This migration adds check constraints to ensure data integrity:
  - Positive quantities and amounts
  - Valid currency codes
  - Email format validation
  - Phone number format validation
*/

-- Add check constraints for user_cart table
ALTER TABLE "user_cart" ADD CONSTRAINT "check_cart_quantity_positive" 
    CHECK ("quantity" > 0 AND "quantity" <= 999);

-- Add check constraints for user_order table
ALTER TABLE "user_order" ADD CONSTRAINT "check_order_amounts_positive" 
    CHECK ("subtotal_amount" > 0 AND "total_amount" > 0 AND "tax_amount" >= 0 AND "payment_fees" >= 0);

ALTER TABLE "user_order" ADD CONSTRAINT "check_order_total_calculation" 
    CHECK ("total_amount" = "subtotal_amount" + "tax_amount");

ALTER TABLE "user_order" ADD CONSTRAINT "check_currency_format" 
    CHECK ("currency" ~ '^[A-Z]{3}$');

ALTER TABLE "user_order" ADD CONSTRAINT "check_supported_currencies" 
    CHECK ("currency" IN ('USD', 'EUR', 'JPY', 'GBP'));

ALTER TABLE "user_order" ADD CONSTRAINT "check_customer_email_format" 
    CHECK ("customer_email" IS NULL OR "customer_email" ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$');

ALTER TABLE "user_order" ADD CONSTRAINT "check_customer_phone_format" 
    CHECK ("customer_phone" IS NULL OR "customer_phone" ~ '^\+?[1-9]\d{1,14}$');

-- Add check constraints for user_order_item table
ALTER TABLE "user_order_item" ADD CONSTRAINT "check_order_item_quantity_positive" 
    CHECK ("quantity" > 0);

ALTER TABLE "user_order_item" ADD CONSTRAINT "check_order_item_prices_positive" 
    CHECK ("unit_price" > 0 AND "total_price" > 0);

ALTER TABLE "user_order_item" ADD CONSTRAINT "check_order_item_total_calculation" 
    CHECK ("total_price" = "unit_price" * "quantity");

-- Add indexes for performance optimization
CREATE INDEX "idx_user_order_currency" ON "user_order"("currency");
CREATE INDEX "idx_user_order_payment_method" ON "user_order"("payment_method");
CREATE INDEX "idx_user_order_customer_email" ON "user_order"("customer_email") WHERE "customer_email" IS NOT NULL;

-- Add partial indexes for better query performance
CREATE INDEX "idx_user_cart_active" ON "user_cart"("user_id", "added_at") WHERE "del_flag" = false;
CREATE INDEX "idx_user_order_active" ON "user_order"("user_id", "order_date") WHERE "del_flag" = false;
CREATE INDEX "idx_user_order_item_active" ON "user_order_item"("order_id") WHERE "del_flag" = false;