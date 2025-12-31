-- 插入模拟产品数据到 Supabase 数据库
-- 基于 mockProducts.js 文件生成

-- ===============================
-- 1. 插入分类数据
-- ===============================

-- 清理现有数据（可选，谨慎使用）
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM cart_items;
-- DELETE FROM product_reviews;
-- DELETE FROM products;
-- DELETE FROM categories WHERE id NOT IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004');

-- 更新现有分类数据
UPDATE categories SET 
  name = 'Furniture',
  description = 'Modern furniture for your home',
  icon = '🪑'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE categories SET 
  name = 'Decor',
  description = 'Beautiful home decorations',
  icon = '🏺'
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE categories SET 
  name = 'Lighting',
  description = 'Stylish lighting solutions',
  icon = '💡'
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE categories SET 
  name = 'Textiles',
  description = 'Comfortable textiles and fabrics',
  icon = '🛏️'
WHERE id = '550e8400-e29b-41d4-a716-446655440004';

-- ===============================
-- 2. 插入产品数据
-- ===============================

-- 产品 1: Oak Modern Wooden Chair - Natural
INSERT INTO products (
  id, name, slug, description, short_description, sku, price, compare_price, 
  category_id, brand, weight, dimensions, images, variants, inventory_quantity, 
  track_inventory, allow_backorder, requires_shipping, is_active, is_featured, 
  meta_title, meta_description, tags
) VALUES (
  gen_random_uuid(),
  'Oak Modern Wooden Chair - Natural',
  'oak-modern-wooden-chair-natural',
  'A beautiful modern wooden chair with ergonomic design. Perfect for dining rooms, offices, or any space that needs a touch of contemporary style.',
  'Oak modern wooden chair in natural',
  'ULM-FUR-1234',
  299.00,
  399.00,
  '550e8400-e29b-41d4-a716-446655440001', -- Furniture category
  'Ulmo',
  8.5,
  '{"length": 55.2, "width": 52.8, "height": 82.1}',
  '["https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg", "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg", "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg"]',
  '{"colors": ["natural", "dark brown", "black"], "materials": ["oak", "walnut"]}',
  25,
  true,
  false,
  true,
  true,
  true,
  'Oak Modern Wooden Chair - Natural | Ulmo',
  'Beautiful modern wooden chair with ergonomic design',
  '{"furniture", "chairs", "oak", "natural"}'
);

-- 产品 2: Ceramic Vase - White
INSERT INTO products (
  id, name, slug, description, short_description, sku, price, compare_price, 
  category_id, brand, weight, dimensions, images, variants, inventory_quantity, 
  track_inventory, allow_backorder, requires_shipping, is_active, is_featured, 
  meta_title, meta_description, tags
) VALUES (
  gen_random_uuid(),
  'Ceramic Vase - White',
  'ceramic-vase-white',
  'Elegant ceramic vase perfect for fresh flowers or as a standalone decorative piece. Handcrafted with attention to detail.',
  'Ceramic vase in white',
  'ULM-DEC-5678',
  89.00,
  120.00,
  '550e8400-e29b-41d4-a716-446655440002', -- Decor category
  'Ulmo',
  2.3,
  '{"length": 22.5, "width": 22.5, "height": 35.0}',
  '["https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg", "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg"]',
  '{"colors": ["white", "blue", "green"], "materials": ["ceramic", "porcelain"]}',
  15,
  true,
  false,
  true,
  true,
  true,
  'Ceramic Vase - White | Ulmo',
  'Elegant ceramic vase perfect for fresh flowers',
  '{"decor", "vases", "ceramic", "white"}'
);

-- 产品 3: Metal Modern Pendant Light - Black
INSERT INTO products (
  id, name, slug, description, short_description, sku, price, compare_price, 
  category_id, brand, weight, dimensions, images, variants, inventory_quantity, 
  track_inventory, allow_backorder, requires_shipping, is_active, is_featured, 
  meta_title, meta_description, tags
) VALUES (
  gen_random_uuid(),
  'Metal Modern Pendant Light - Black',
  'metal-modern-pendant-light-black',
  'Stylish pendant light that provides focused illumination and serves as a design statement.',
  'Metal modern pendant light in black',
  'ULM-LIG-9012',
  249.00,
  329.00,
  '550e8400-e29b-41d4-a716-446655440003', -- Lighting category
  'Ulmo',
  3.2,
  '{"length": 30.0, "width": 30.0, "height": 45.5}',
  '["https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg", "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"]',
  '{"colors": ["black", "brass", "white"], "materials": ["metal", "glass"]}',
  12,
  true,
  false,
  true,
  true,
  false,
  'Metal Modern Pendant Light - Black | Ulmo',
  'Stylish pendant light for focused illumination',
  '{"lighting", "pendant", "metal", "black"}'
);

-- 产品 4: Cotton Throw Pillow Set - Neutral
INSERT INTO products (
  id, name, slug, description, short_description, sku, price, compare_price, 
  category_id, brand, weight, dimensions, images, variants, inventory_quantity, 
  track_inventory, allow_backorder, requires_shipping, is_active, is_featured, 
  meta_title, meta_description, tags
) VALUES (
  gen_random_uuid(),
  'Cotton Throw Pillow Set - Neutral',
  'cotton-throw-pillow-set-neutral',
  'Set of decorative throw pillows that add comfort and style to any seating area.',
  'Cotton throw pillow set in neutral',
  'ULM-TEX-3456',
  69.00,
  89.00,
  '550e8400-e29b-41d4-a716-446655440004', -- Textiles category
  'Ulmo',
  1.2,
  '{"length": 45.0, "width": 45.0, "height": 15.0}',
  '["https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg", "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg"]',
  '{"colors": ["neutral", "colorful", "pattern"], "materials": ["cotton", "linen"]}',
  30,
  true,
  false,
  true,
  true,
  false,
  'Cotton Throw Pillow Set - Neutral | Ulmo',
  'Decorative throw pillows for comfort and style',
  '{"textiles", "cushions", "cotton", "neutral"}'
);

-- 产品 5: Walnut Coffee Table - Dark Brown
INSERT INTO products (
  id, name, slug, description, short_description, sku, price, compare_price, 
  category_id, brand, weight, dimensions, images, variants, inventory_quantity, 
  track_inventory, allow_backorder, requires_shipping, is_active, is_featured, 
  meta_title, meta_description, tags
) VALUES (
  gen_random_uuid(),
  'Walnut Coffee Table - Dark Brown',
  'walnut-coffee-table-dark-brown',
  'Modern coffee table with clean lines and functional design. Perfect centerpiece for your living room.',
  'Walnut coffee table in dark brown',
  'ULM-FUR-7890',
  499.00,
  649.00,
  '550e8400-e29b-41d4-a716-446655440001', -- Furniture category
  'Ulmo',
  25.0,
  '{"length": 120.0, "width": 60.0, "height": 45.0}',
  '["https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg", "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg"]',
  '{"colors": ["natural", "dark brown", "white"], "materials": ["wood", "glass"]}',
  8,
  true,
  false,
  true,
  true,
  true,
  'Walnut Coffee Table - Dark Brown | Ulmo',
  'Modern coffee table with clean lines and functional design',
  '{"furniture", "tables", "walnut", "dark brown"}'
);

-- 产品 6: Fabric Modern Sectional Sofa - Gray
INSERT INTO products (
  id, name, slug, description, short_description, sku, price, compare_price, 
  category_id, brand, weight, dimensions, images, variants, inventory_quantity, 
  track_inventory, allow_backorder, requires_shipping, is_active, is_featured, 
  meta_title, meta_description, tags
) VALUES (
  gen_random_uuid(),
  'Fabric Modern Sectional Sofa - Gray',
  'fabric-modern-sectional-sofa-gray',
  'Spacious sectional sofa perfect for large living rooms. Comfortable seating for the whole family.',
  'Fabric modern sectional sofa in gray',
  'ULM-FUR-2468',
  1299.00,
  1699.00,
  '550e8400-e29b-41d4-a716-446655440001', -- Furniture category
  'Ulmo',
  45.0,
  '{"length": 220.0, "width": 90.0, "height": 85.0}',
  '["https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg", "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg"]',
  '{"colors": ["gray", "beige", "navy"], "materials": ["fabric", "leather"]}',
  5,
  true,
  false,
  true,
  true,
  true,
  'Fabric Modern Sectional Sofa - Gray | Ulmo',
  'Spacious sectional sofa for large living rooms',
  '{"furniture", "sofas", "fabric", "gray"}'
);

-- 产品 7: Brass Arc Floor Lamp - Gold
INSERT INTO products (
  id, name, slug, description, short_description, sku, price, compare_price, 
  category_id, brand, weight, dimensions, images, variants, inventory_quantity, 
  track_inventory, allow_backorder, requires_shipping, is_active, is_featured, 
  meta_title, meta_description, tags
) VALUES (
  gen_random_uuid(),
  'Brass Arc Floor Lamp - Gold',
  'brass-arc-floor-lamp-gold',
  'Elegant arc floor lamp that provides ambient lighting and saves space.',
  'Brass arc floor lamp in gold',
  'ULM-LIG-1357',
  349.00,
  449.00,
  '550e8400-e29b-41d4-a716-446655440003', -- Lighting category
  'Ulmo',
  12.5,
  '{"length": 40.0, "width": 40.0, "height": 165.0}',
  '["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg"]',
  '{"colors": ["black", "brass", "chrome"], "materials": ["metal", "marble"]}',
  10,
  true,
  false,
  true,
  true,
  false,
  'Brass Arc Floor Lamp - Gold | Ulmo',
  'Elegant arc floor lamp for ambient lighting',
  '{"lighting", "floor", "brass", "gold"}'
);

-- 产品 8: Wool Area Rug - Pattern
INSERT INTO products (
  id, name, slug, description, short_description, sku, price, compare_price, 
  category_id, brand, weight, dimensions, images, variants, inventory_quantity, 
  track_inventory, allow_backorder, requires_shipping, is_active, is_featured, 
  meta_title, meta_description, tags
) VALUES (
  gen_random_uuid(),
  'Wool Area Rug - Pattern',
  'wool-area-rug-pattern',
  'Beautiful area rug that defines spaces and adds warmth to any room.',
  'Wool area rug with pattern',
  'ULM-TEX-9753',
  299.00,
  399.00,
  '550e8400-e29b-41d4-a716-446655440004', -- Textiles category
  'Ulmo',
  8.0,
  '{"length": 200.0, "width": 140.0, "height": 2.0}',
  '["https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg", "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg"]',
  '{"colors": ["neutral", "pattern", "colorful"], "materials": ["wool", "cotton"]}',
  18,
  true,
  false,
  true,
  true,
  false,
  'Wool Area Rug - Pattern | Ulmo',
  'Beautiful area rug that defines spaces',
  '{"textiles", "rugs", "wool", "pattern"}'
);

-- ===============================
-- 3. 插入产品评价数据（可选）
-- ===============================

-- 为每个产品添加一些模拟评价
-- 注意：需要有真实的用户ID才能插入评价，这里只是示例结构

/*
INSERT INTO product_reviews (product_id, user_id, rating, title, content, is_verified_purchase, is_approved)
SELECT 
  p.id,
  '00000000-0000-0000-0000-000000000000'::uuid, -- 替换为真实用户ID
  FLOOR(4 + RANDOM() * 2)::integer, -- 4-5星评级
  'Great product!',
  'Really happy with this purchase. Quality is excellent.',
  true,
  true
FROM products p
WHERE p.sku LIKE 'ULM-%';
*/

-- ===============================
-- 4. 更新站点设置
-- ===============================

-- 更新产品数量统计
UPDATE site_settings 
SET value = (SELECT COUNT(*)::text FROM products WHERE is_active = true)::jsonb 
WHERE key = 'total_products';

-- 如果不存在则插入
INSERT INTO site_settings (key, value, description) 
SELECT 'total_products', (SELECT COUNT(*)::text FROM products WHERE is_active = true)::jsonb, 'Total number of active products'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'total_products');

-- ===============================
-- 完成消息
-- ===============================

DO $$
BEGIN
  RAISE NOTICE '✅ 模拟产品数据插入完成！';
  RAISE NOTICE '📦 已插入 8 个产品到数据库';
  RAISE NOTICE '📂 涵盖 4 个主要分类：家具、装饰、照明、纺织品';
  RAISE NOTICE '🏷️ 所有产品都包含完整的属性：价格、图片、变体、库存等';
  RAISE NOTICE '⭐ 其中 4 个产品标记为特色产品';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 下一步：';
  RAISE NOTICE '   1. 在应用中测试产品展示功能';
  RAISE NOTICE '   2. 验证购物车和订单功能';
  RAISE NOTICE '   3. 可选：添加真实用户评价数据';
END $$;