# Ulmo E-Commerce Setup Guide

This guide will walk you through setting up the Ulmo E-Commerce application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **pnpm** (pnpm recommended)
- **Git**
- A **Supabase** account (free tier available)

## Step 1: Clone and Install

1. Clone the repository:
```bash
git clone https://github.com/laofansay-ai/figma01.git
cd figma01
```

2. Install dependencies:
```bash
pnpm install
```

## Step 2: Supabase Project Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `ulmo-ecommerce`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### 2.2 Get Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **Project API keys** > **anon public** key

### 2.3 Configure Environment Variables

1. In your project root, copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Database Schema Setup

### 3.1 Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the following SQL schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  dimensions JSONB,
  images JSONB,
  variants JSONB,
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
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  variant_options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_options)
);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Create site_settings table
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', '"Ulmo E-Commerce"', 'Website name'),
('site_description', '"Modern furniture and home decor"', 'Website description'),
('currency', '"USD"', 'Default currency'),
('tax_rate', '0.08', 'Default tax rate'),
('shipping_rate', '15.00', 'Default shipping rate'),
('free_shipping_threshold', '100.00', 'Free shipping minimum amount');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
```

4. Click **Run** to execute the SQL
5. Verify that all tables were created successfully

### 3.2 Insert Sample Data

1. Create a new SQL query and run the following to insert sample categories:

```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Furniture', 'furniture', 'Modern furniture for your home', '🪑', 1),
('Decor', 'decor', 'Beautiful home decorations', '🏺', 2),
('Lighting', 'lighting', 'Stylish lighting solutions', '💡', 3),
('Textiles', 'textiles', 'Comfortable textiles and fabrics', '🛏️', 4);

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, price, compare_price, category_id, brand, images, is_featured, inventory_quantity) 
SELECT 
  'Modern Wooden Chair',
  'modern-wooden-chair',
  'A beautiful modern wooden chair with ergonomic design. Perfect for dining rooms, offices, or any space that needs a touch of contemporary style.',
  'Modern wooden chair with ergonomic design',
  299.00,
  399.00,
  c.id,
  'Ulmo',
  '["https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg"]',
  true,
  10
FROM categories c WHERE c.slug = 'furniture'
UNION ALL
SELECT 
  'Ceramic Vase',
  'ceramic-vase',
  'Elegant ceramic vase perfect for fresh flowers or as a standalone decorative piece. Handcrafted with attention to detail.',
  'Elegant handcrafted ceramic vase',
  89.00,
  120.00,
  c.id,
  'Ulmo',
  '["https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"]',
  true,
  25
FROM categories c WHERE c.slug = 'decor';
```

## Step 4: Authentication Setup

### 4.1 Configure Auth Settings

1. In Supabase dashboard, go to **Authentication** > **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:5173`
3. Under **Redirect URLs**, add: `http://localhost:5173/**`
4. Enable **Email confirmations** if desired
5. Configure **Email templates** if needed

### 4.2 Test Authentication

1. Start your development server:
```bash
pnpm dev
```

2. Open `http://localhost:5173` in your browser
3. Navigate to the Account page
4. Try creating a new account
5. Check your Supabase dashboard under **Authentication** > **Users** to see the new user

## Step 5: Verify Setup

### 5.1 Test Database Connection

1. Open your browser's developer console
2. Navigate to any page of your app
3. Check for any console errors related to Supabase connection

### 5.2 Test Core Features

1. **Authentication**: Try signing up and logging in
2. **Product Display**: Check that sample products appear on the home page
3. **Shopping Cart**: Try adding products to cart
4. **Navigation**: Test all page navigation

## Step 6: Production Deployment (Optional)

### 6.1 Build for Production

```bash
pnpm build
```

### 6.2 Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Add environment variables in your deployment platform
4. Update Supabase redirect URLs to include your production domain

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Double-check your `.env` file
   - Ensure you're using the `anon public` key, not the `service_role` key
   - Restart your development server after changing `.env`

2. **Database connection errors**
   - Verify your Supabase project URL is correct
   - Check that your database tables were created successfully
   - Ensure RLS policies are properly configured

3. **Authentication not working**
   - Check Site URL and Redirect URLs in Supabase Auth settings
   - Verify email confirmation settings
   - Check browser console for detailed error messages

4. **Products not displaying**
   - Ensure sample data was inserted correctly
   - Check that RLS policies allow public read access to products
   - Verify the products table has `is_active = true`

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Review the Supabase dashboard logs
3. Ensure all environment variables are set correctly
4. Verify database schema matches the provided SQL
5. Check that all dependencies are installed correctly

## Next Steps

Once your setup is complete:

1. Review the `task_roadmap.md` for development priorities
2. Check `api_design.md` for API documentation
3. Explore the codebase structure
4. Start customizing the design and adding features

Congratulations! Your Ulmo E-Commerce application should now be running successfully.

