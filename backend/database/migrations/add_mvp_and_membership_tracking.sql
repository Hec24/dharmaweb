-- Migration: Add MVP and membership payment tracking
-- Created: 2025-01-07
-- Purpose: Support MVP purchases with automatic membership activation

-- Add MVP and membership fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS has_mvp_access BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS mvp_discount_applied BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_interval VARCHAR(20), -- 'quarterly', 'biannual'
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_mvp_access ON users(has_mvp_access);
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription ON users(stripe_subscription_id);

-- Create table for MVP purchases (before account creation)
CREATE TABLE IF NOT EXISTS mvp_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  amount_paid INTEGER NOT NULL, -- in cents
  purchased_at TIMESTAMP DEFAULT NOW(),
  account_created BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  membership_activated BOOLEAN DEFAULT FALSE,
  membership_activation_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mvp_email ON mvp_purchases(email);
CREATE INDEX IF NOT EXISTS idx_mvp_stripe_customer ON mvp_purchases(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_mvp_user ON mvp_purchases(user_id);

-- Create table for payment history
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) NOT NULL,
  stripe_invoice_id VARCHAR(255),
  amount INTEGER NOT NULL, -- in cents
  currency VARCHAR(3) DEFAULT 'EUR',
  payment_type VARCHAR(50) NOT NULL, -- 'mvp', 'membership_initial', 'membership_renewal'
  status VARCHAR(50) NOT NULL, -- 'succeeded', 'failed', 'pending'
  payment_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_user ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intent ON payment_history(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_date ON payment_history(payment_date);

-- Add comments for documentation
COMMENT ON COLUMN users.has_mvp_access IS 'User has purchased MVP and has early access';
COMMENT ON COLUMN users.mvp_discount_applied IS 'MVP discount has been applied to membership';
COMMENT ON COLUMN users.subscription_interval IS 'Membership billing interval: quarterly or biannual';
COMMENT ON COLUMN users.stripe_subscription_id IS 'Stripe subscription ID for recurring payments';

COMMENT ON TABLE mvp_purchases IS 'Tracks MVP purchases before user account creation';
COMMENT ON TABLE payment_history IS 'Complete history of all payments for auditing';
