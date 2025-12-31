-- 修复空查询结果问题的完整脚本
-- 此脚本将确保数据库有必要的数据和正确的配置

-- ===============================
-- 1. 检查并插入基础数据
-- ===============================

-- 检查是否有产品数据
DO $$
DECLARE
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products WHERE is_active = true;
  
  IF product_count = 0 THEN
    RAISE NOTICE '⚠️ 产品表为空，需要插入测试数据';
    RAISE NOTICE '📝 请先执行 scripts/insert_mock_data.sql';
  ELSE
    RAISE NOTICE '✅ 找到 % 个活跃产品', product_count;
  END IF;
END $$;

-- 检查是否有分类数据
DO $$
DECLARE
  category_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO category_count FROM categories WHERE is_active = true;
  
  IF category_count = 0 THEN
    RAISE NOTICE '⚠️ 分类表为空，插入默认分类数据...';
    
    -- 插入默认分类
    INSERT INTO categories (id, name, slug, description, icon, sort_order, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Furniture', 'furniture', 'Modern furniture for your home', '🪑', 1, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'Decor', 'decor', 'Beautiful home decorations', '🏺', 2, true),
    ('550e8400-e29b-41d4-a716-446655440003', 'Lighting', 'lighting', 'Stylish lighting solutions', '💡', 3, true),
    ('550e8400-e29b-41d4-a716-446655440004', 'Textiles', 'textiles', 'Comfortable textiles and fabrics', '🛏️', 4, true)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      icon = EXCLUDED.icon,
      is_active = true;
    
    RAISE NOTICE '✅ 已插入默认分类数据';
  ELSE
    RAISE NOTICE '✅ 找到 % 个活跃分类', category_count;
  END IF;
END $$;

-- ===============================
-- 2. 确保必要的表都存在
-- ===============================

-- 检查关键表是否存在
DO $$
BEGIN
  -- 检查 site_settings 表
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN
    CREATE TABLE site_settings (
      key TEXT PRIMARY KEY,
      value JSONB,
      description TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- 插入默认设置
    INSERT INTO site_settings (key, value, description) VALUES
    ('site_name', '"Ulmo E-Commerce"', 'Website name'),
    ('site_description', '"Modern furniture and home decor"', 'Website description'),
    ('currency', '"USD"', 'Default currency'),
    ('tax_rate', '0.08', 'Default tax rate'),
    ('shipping_rate', '15.00', 'Default shipping rate'),
    ('free_shipping_threshold', '100.00', 'Free shipping minimum amount');
    
    RAISE NOTICE '✅ 已创建 site_settings 表';
  END IF;
  
  -- 检查 wishlists 表
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlists') THEN
    CREATE TABLE wishlists (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );
    
    -- Enable RLS
    ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
    
    -- RLS Policies
    CREATE POLICY "Users can manage own wishlist" 
      ON wishlists FOR ALL 
      USING (auth.uid() = user_id);
    
    RAISE NOTICE '✅ 已创建 wishlists 表';
  END IF;
END $$;

-- ===============================
-- 3. 验证数据完整性
-- ===============================

-- 显示数据库状态
SELECT 
  'products' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE is_active = true) as active_records
FROM products
UNION ALL
SELECT 
  'categories' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE is_active = true) as active_records
FROM categories
UNION ALL
SELECT 
  'orders' as table_name,
  COUNT(*) as total_records,
  COUNT(*) as active_records
FROM orders
UNION ALL
SELECT 
  'site_settings' as table_name,
  COUNT(*) as total_records,
  COUNT(*) as active_records
FROM site_settings;

-- ===============================
-- 4. 检查是否有评分数据
-- ===============================

-- 如果产品表没有评分字段，添加它们
DO $$
BEGIN
  -- 检查并添加 average_rating 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE products ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0;
    RAISE NOTICE '✅ 已添加 average_rating 字段';
  END IF;

  -- 检查并添加 review_count 字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
    RAISE NOTICE '✅ 已添加 review_count 字段';
  END IF;
END $$;

-- ===============================
-- 完成状态检查
-- ===============================

DO $$
DECLARE
  product_count INTEGER;
  category_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products WHERE is_active = true;
  SELECT COUNT(*) INTO category_count FROM categories WHERE is_active = true;
  
  RAISE NOTICE '';
  RAISE NOTICE '🎯 数据库状态检查完成：';
  RAISE NOTICE '   - 活跃产品数量: %', product_count;
  RAISE NOTICE '   - 活跃分类数量: %', category_count;
  
  IF product_count = 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ 警告: 产品表为空！';
    RAISE NOTICE '📋 下一步: 执行 scripts/insert_mock_data.sql 插入测试产品';
  ELSE
    RAISE NOTICE '✅ 数据库准备就绪！';
  END IF;
END $$;