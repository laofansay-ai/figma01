-- Fix RLS policies for orders and order_items tables
-- This script adds the missing INSERT policies that allow users to create orders

-- ===============================
-- Fix Orders Table RLS Policies
-- ===============================

-- Add policy to allow users to create orders for themselves
CREATE POLICY "Users can create own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ===============================
-- Fix Order Items Table RLS Policies  
-- ===============================

-- Add policy to allow users to create order items for their own orders
CREATE POLICY "Users can create order items for own orders" 
  ON order_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- ===============================
-- Verification Queries
-- ===============================

-- Check all policies for orders table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'orders';

-- Check all policies for order_items table  
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'order_items';

-- Test message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies fixed successfully!';
  RAISE NOTICE '📝 Added INSERT policies for orders and order_items tables';
  RAISE NOTICE '🔒 Users can now create orders and order items for themselves';
END $$;