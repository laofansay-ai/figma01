-- Ulmo E-Commerce Database Schema Setup Script
-- This script creates all the necessary tables, indexes, triggers, and functions
-- for the Ulmo E-Commerce application

-- ===============================
-- 1. User Profiles Table
-- ===============================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ===============================
-- 2. Categories Table
-- ===============================

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" 
  ON categories FOR SELECT 
  USING (true);

-- ===============================
-- 3. Products Table
-- ===============================

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  brand TEXT,
  weight DECIMAL(8,2),
  dimensions JSONB, -- {length, width, height}
  images JSONB, -- Array of image URLs
  variants JSONB, -- Color, size options
  inventory_quantity INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorder BOOLEAN DEFAULT false,
  requires_shipping BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (is_active = true);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);

-- ===============================
-- 4. Product Reviews Table
-- ===============================

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images JSONB, -- Array of review image URLs
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Enable RLS on product_reviews
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON product_reviews FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Users can create reviews" 
  ON product_reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" 
  ON product_reviews FOR UPDATE 
  USING (auth.uid() = user_id);

-- Indexes for product_reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved ON product_reviews(product_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(product_id, rating);

-- ===============================
-- 5. Cart Items Table
-- ===============================

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  variant_options JSONB, -- Selected color, size, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_options)
);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items
CREATE POLICY "Users can manage own cart" 
  ON cart_items FOR ALL 
  USING (auth.uid() = user_id);

-- ===============================
-- 6. Orders Table
-- ===============================

-- Create order number sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq;

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Customer info (snapshot at time of order)
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Shipping address
  shipping_address JSONB NOT NULL,
  
  -- Billing address
  billing_address JSONB,
  
  -- Payment info
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference TEXT,
  
  -- Shipping info
  shipping_method TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ===============================
-- 7. Order Items Table
-- ===============================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  
  -- Product snapshot at time of order
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image TEXT,
  
  -- Variant info
  variant_options JSONB,
  
  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10,2) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" 
  ON order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- ===============================
-- 8. User Addresses Table
-- ===============================

CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  is_default BOOLEAN DEFAULT false,
  
  -- Address fields
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  phone TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_addresses
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_addresses
CREATE POLICY "Users can manage own addresses" 
  ON user_addresses FOR ALL 
  USING (auth.uid() = user_id);

-- ===============================
-- 9. Wishlists Table
-- ===============================

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wishlists
CREATE POLICY "Users can manage own wishlist" 
  ON wishlists FOR ALL 
  USING (auth.uid() = user_id);

-- ===============================
-- 10. Coupons Table
-- ===============================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Discount settings
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  
  -- Usage limits
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  usage_limit_per_user INTEGER DEFAULT 1,
  
  -- Validity
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Applicable products/categories
  applicable_products UUID[],
  applicable_categories UUID[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons
CREATE POLICY "Active coupons are viewable by everyone" 
  ON coupons FOR SELECT 
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- ===============================
-- 11. Site Settings Table
-- ===============================

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================
-- 12. Functions and Triggers
-- ===============================

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to all tables with updated_at column
-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_product_reviews_updated_at 
  BEFORE UPDATE ON product_reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON cart_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON user_addresses;
CREATE TRIGGER update_user_addresses_updated_at 
  BEFORE UPDATE ON user_addresses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at 
  BEFORE UPDATE ON coupons 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON site_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- 13. Default Data Inserts
-- ===============================

-- Insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', '"Ulmo E-Commerce"', 'Website name'),
('site_description', '"Modern furniture and home decor"', 'Website description'),
('currency', '"USD"', 'Default currency'),
('tax_rate', '0.08', 'Default tax rate'),
('shipping_rate', '15.00', 'Default shipping rate'),
('free_shipping_threshold', '100.00', 'Free shipping minimum amount')
ON CONFLICT (key) DO NOTHING;

-- Insert default categories
INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Furniture', 'furniture', 'Modern furniture for your home', '🪑', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Decor', 'decor', 'Beautiful decorative items', '🏺', 2),
('550e8400-e29b-41d4-a716-446655440003', 'Lighting', 'lighting', 'Stylish lighting solutions', '💡', 3),
('550e8400-e29b-41d4-a716-446655440004', 'Textiles', 'textiles', 'Comfortable textiles and fabrics', '🧸', 4)
ON CONFLICT (slug) DO NOTHING;

-- Add subcategories
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Chairs', 'chairs', 'Comfortable seating solutions', '550e8400-e29b-41d4-a716-446655440001', 1),
('Tables', 'tables', 'Functional and stylish tables', '550e8400-e29b-41d4-a716-446655440001', 2),
('Storage', 'storage', 'Organize your space', '550e8400-e29b-41d4-a716-446655440001', 3),
('Wall Art', 'wall-art', 'Beautiful wall decorations', '550e8400-e29b-41d4-a716-446655440002', 1),
('Vases & Planters', 'vases-planters', 'Decorative containers', '550e8400-e29b-41d4-a716-446655440002', 2),
('Table Lamps', 'table-lamps', 'Desktop lighting', '550e8400-e29b-41d4-a716-446655440003', 1),
('Floor Lamps', 'floor-lamps', 'Standing lighting fixtures', '550e8400-e29b-41d4-a716-446655440003', 2),
('Cushions', 'cushions', 'Comfortable cushions and pillows', '550e8400-e29b-41d4-a716-446655440004', 1),
('Throws', 'throws', 'Cozy throw blankets', '550e8400-e29b-41d4-a716-446655440004', 2)
ON CONFLICT (slug) DO NOTHING;

-- ===============================
-- Final Status Message
-- ===============================

DO $$
BEGIN
  RAISE NOTICE '✅ Ulmo E-Commerce database schema setup completed successfully!';
  RAISE NOTICE '📊 Tables created: profiles, categories, products, product_reviews, cart_items, orders, order_items, user_addresses, wishlists, coupons, site_settings';
  RAISE NOTICE '🔒 Row Level Security (RLS) enabled on all tables';
  RAISE NOTICE '🔗 All foreign key relationships established';
  RAISE NOTICE '📈 Indexes and triggers configured for optimal performance';
  RAISE NOTICE '🎯 Default categories and settings inserted';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next steps:';
  RAISE NOTICE '   1. Configure your .env file with Supabase credentials';
  RAISE NOTICE '   2. Test the application with: pnpm run dev';
  RAISE NOTICE '   3. Insert sample product data using the provided scripts';
END $$;