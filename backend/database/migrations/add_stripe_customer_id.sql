-- Migration: Add stripe_customer_id to users table
-- Run this to add Stripe customer ID tracking

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

-- Add comment for documentation
COMMENT ON COLUMN users.stripe_customer_id IS 'Stripe customer ID for payment management';
