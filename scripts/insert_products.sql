-- Insert categories
INSERT INTO categories (name, slug, description, icon, sort_order, is_active) 
VALUES ('Furniture', 'furniture', 'Modern furniture for your home', '🪑', 1, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, icon, sort_order, is_active) 
VALUES ('Decor', 'decor', 'Beautiful home decorations', '🏺', 1, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, icon, sort_order, is_active) 
VALUES ('Lighting', 'lighting', 'Stylish lighting solutions', '💡', 1, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, icon, sort_order, is_active) 
VALUES ('Textiles', 'textiles', 'Comfortable textiles and fabrics', '🛏️', 1, true)
ON CONFLICT (slug) DO NOTHING;


-- Insert products
INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Pine Modern Wooden Chair - Natural',
    'pine-modern-wooden-chair--natural',
    'A beautiful modern wooden chair with ergonomic design. Perfect for dining rooms, offices, or any space that needs a touch of contemporary style.',
    'Pine modern wooden chair in natural',
    379,
    474,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["natural", "dark brown", "black"], "materials": ["oak", "walnut"]}',
    '{"length": 56.8, "width": 64.9, "height": 89.6}',
    6,
    true,
    '{"furniture","chairs","pine","natural"}',
    6.5,
    'ULM-FUR-2979',
    true
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Pine Modern Wooden Chair - Natural',
    'pine-modern-wooden-chair--natural',
    'A beautiful modern wooden chair with ergonomic design. Perfect for dining rooms, offices, or any space that needs a touch of contemporary style.',
    'Pine modern wooden chair in natural',
    312,
    430,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["natural", "dark brown", "black"], "materials": ["oak", "walnut"]}',
    '{"length": 62.7, "width": 48.1, "height": 82.5}',
    15,
    true,
    '{"furniture","chairs","pine","natural"}',
    23.1,
    'ULM-FUR-1066',
    true
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Mesh Ergonomic Office Chair - White',
    'mesh-ergonomic-office-chair--white',
    'Professional office chair with lumbar support and adjustable height. Designed for long hours of comfortable work.',
    'Mesh ergonomic office chair in white',
    434,
    529,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["black", "gray", "white"], "materials": ["mesh", "leather"]}',
    '{"length": 64.2, "width": 58.5, "height": 80.5}',
    24,
    true,
    '{"furniture","chairs","mesh","white"}',
    16.3,
    'ULM-FUR-4110',
    true
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Mesh Ergonomic Office Chair - Blue',
    'mesh-ergonomic-office-chair--blue',
    'Professional office chair with lumbar support and adjustable height. Designed for long hours of comfortable work.',
    'Mesh ergonomic office chair in blue',
    479,
    697,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["black", "gray", "white"], "materials": ["mesh", "leather"]}',
    '{"length": 53.5, "width": 45.7, "height": 87.4}',
    12,
    false,
    '{"furniture","chairs","mesh","blue"}',
    9.0,
    'ULM-FUR-8055',
    true
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Mesh Ergonomic Office Chair - Gray',
    'mesh-ergonomic-office-chair--gray',
    'Professional office chair with lumbar support and adjustable height. Designed for long hours of comfortable work.',
    'Mesh ergonomic office chair in gray',
    516,
    659,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["black", "gray", "white"], "materials": ["mesh", "leather"]}',
    '{"length": 59.6, "width": 59.3, "height": 76.5}',
    46,
    false,
    '{"furniture","chairs","mesh","gray"}',
    23.3,
    'ULM-FUR-8562',
    true
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Linen Accent Armchair - Gray',
    'linen-accent-armchair--gray',
    'Stylish accent chair that adds personality to any room. Perfect for reading corners or as statement furniture.',
    'Linen accent armchair in gray',
    787,
    1137,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["navy", "emerald", "mustard"], "materials": ["velvet", "linen"]}',
    '{"length": 46.6, "width": 63.5, "height": 77.7}',
    46,
    false,
    '{"furniture","chairs","linen","gray"}',
    4.2,
    'ULM-FUR-7407',
    true
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Velvet Accent Armchair - Navy',
    'velvet-accent-armchair--navy',
    'Stylish accent chair that adds personality to any room. Perfect for reading corners or as statement furniture.',
    'Velvet accent armchair in navy',
    521,
    748,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["navy", "emerald", "mustard"], "materials": ["velvet", "linen"]}',
    '{"length": 47.8, "width": 58.0, "height": 84.7}',
    35,
    false,
    '{"furniture","chairs","velvet","navy"}',
    16.4,
    'ULM-FUR-9672',
    true
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Marble Coffee Table - Black',
    'marble-coffee-table--black',
    'Modern coffee table with clean lines and functional design. Perfect centerpiece for your living room.',
    'Marble coffee table in black',
    657,
    880,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["natural", "black", "white"], "materials": ["wood", "glass"]}',
    '{"length": 149.3, "width": 94.1, "height": 76.5}',
    20,
    true,
    '{"furniture","tables","marble","black"}',
    21.4,
    'ULM-FUR-4929',
    true
FROM categories c WHERE c.slug = 'furniture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Porcelain Ceramic Vase - White',
    'porcelain-ceramic-vase--white',
    'Elegant ceramic vase perfect for fresh flowers or as a standalone decorative piece.',
    'Porcelain ceramic vase in white',
    113,
    144,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["white", "blue", "green"], "materials": ["ceramic", "porcelain"]}',
    '{"length": 17.0, "width": 16.0, "height": 49.0}',
    26,
    false,
    '{"decor","vases","porcelain","white"}',
    13.9,
    'ULM-DEC-1296',
    true
FROM categories c WHERE c.slug = 'decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Porcelain Ceramic Vase - Blue',
    'porcelain-ceramic-vase--blue',
    'Elegant ceramic vase perfect for fresh flowers or as a standalone decorative piece.',
    'Porcelain ceramic vase in blue',
    109,
    146,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["white", "blue", "green"], "materials": ["ceramic", "porcelain"]}',
    '{"length": 21.6, "width": 25.0, "height": 30.5}',
    27,
    false,
    '{"decor","vases","porcelain","blue"}',
    21.1,
    'ULM-DEC-7027',
    true
FROM categories c WHERE c.slug = 'decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Stoneware Ceramic Vase - Blue',
    'stoneware-ceramic-vase--blue',
    'Elegant ceramic vase perfect for fresh flowers or as a standalone decorative piece.',
    'Stoneware ceramic vase in blue',
    136,
    191,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["white", "blue", "green"], "materials": ["ceramic", "porcelain"]}',
    '{"length": 29.8, "width": 15.2, "height": 36.0}',
    17,
    true,
    '{"decor","vases","stoneware","blue"}',
    16.7,
    'ULM-DEC-8081',
    true
FROM categories c WHERE c.slug = 'decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Crystal Glass Vase Set - Green',
    'crystal-glass-vase-set--green',
    'Set of three glass vases in different sizes. Perfect for creating beautiful arrangements.',
    'Crystal glass vase set in green',
    169,
    219,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["clear", "amber", "blue"], "materials": ["glass", "crystal"]}',
    '{"length": 28.1, "width": 23.2, "height": 38.0}',
    17,
    true,
    '{"decor","vases","crystal","green"}',
    21.0,
    'ULM-DEC-3116',
    true
FROM categories c WHERE c.slug = 'decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Crystal Glass Vase Set - Green',
    'crystal-glass-vase-set--green',
    'Set of three glass vases in different sizes. Perfect for creating beautiful arrangements.',
    'Crystal glass vase set in green',
    102,
    124,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["clear", "amber", "blue"], "materials": ["glass", "crystal"]}',
    '{"length": 26.9, "width": 28.9, "height": 48.6}',
    46,
    false,
    '{"decor","vases","crystal","green"}',
    19.0,
    'ULM-DEC-3965',
    true
FROM categories c WHERE c.slug = 'decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Crystal Glass Vase Set - Blue',
    'crystal-glass-vase-set--blue',
    'Set of three glass vases in different sizes. Perfect for creating beautiful arrangements.',
    'Crystal glass vase set in blue',
    127,
    169,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["clear", "amber", "blue"], "materials": ["glass", "crystal"]}',
    '{"length": 20.2, "width": 15.2, "height": 35.0}',
    16,
    false,
    '{"decor","vases","crystal","blue"}',
    8.0,
    'ULM-DEC-3538',
    true
FROM categories c WHERE c.slug = 'decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Canvas Abstract Wall Art - Gold',
    'canvas-abstract-wall-art--gold',
    'Modern abstract artwork that adds color and personality to any wall.',
    'Canvas abstract wall art in gold',
    194,
    269,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["multicolor", "black white", "blue"], "materials": ["canvas", "paper"]}',
    '{"length": 97.3, "width": 65.5, "height": 33.4}',
    9,
    false,
    '{"decor","artwork","canvas","gold"}',
    21.7,
    'ULM-DEC-9568',
    true
FROM categories c WHERE c.slug = 'decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Canvas Abstract Wall Art - Gold',
    'canvas-abstract-wall-art--gold',
    'Modern abstract artwork that adds color and personality to any wall.',
    'Canvas abstract wall art in gold',
    216,
    271,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["multicolor", "black white", "blue"], "materials": ["canvas", "paper"]}',
    '{"length": 42.4, "width": 35.1, "height": 86.0}',
    17,
    true,
    '{"decor","artwork","canvas","gold"}',
    5.4,
    'ULM-DEC-7497',
    true
FROM categories c WHERE c.slug = 'decor'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Glass Modern Pendant Light - Brass',
    'glass-modern-pendant-light--brass',
    'Stylish pendant light that provides focused illumination and serves as a design statement.',
    'Glass modern pendant light in brass',
    370,
    451,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["black", "brass", "white"], "materials": ["metal", "glass"]}',
    '{"length": 31.3, "width": 28.3, "height": 38.8}',
    11,
    false,
    '{"lighting","pendant","glass","brass"}',
    7.4,
    'ULM-LIG-7876',
    true
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Marble Arc Floor Lamp - Gold',
    'marble-arc-floor-lamp--gold',
    'Elegant arc floor lamp that provides ambient lighting and saves space.',
    'Marble arc floor lamp in gold',
    281,
    417,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["black", "brass", "chrome"], "materials": ["metal", "marble"]}',
    '{"length": 46.3, "width": 49.3, "height": 136.9}',
    44,
    false,
    '{"lighting","floor","marble","gold"}',
    15.1,
    'ULM-LIG-9756',
    true
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Metal Table Lamp - Blue',
    'metal-table-lamp--blue',
    'Classic table lamp perfect for bedside tables, desks, or accent lighting.',
    'Metal table lamp in blue',
    220,
    327,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["white", "black", "brass"], "materials": ["ceramic", "metal"]}',
    '{"length": 29.4, "width": 34.8, "height": 56.5}',
    8,
    false,
    '{"lighting","table","metal","blue"}',
    10.1,
    'ULM-LIG-5036',
    true
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Metal Table Lamp - White',
    'metal-table-lamp--white',
    'Classic table lamp perfect for bedside tables, desks, or accent lighting.',
    'Metal table lamp in white',
    115,
    152,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["white", "black", "brass"], "materials": ["ceramic", "metal"]}',
    '{"length": 33.8, "width": 20.6, "height": 55.0}',
    43,
    false,
    '{"lighting","table","metal","white"}',
    6.0,
    'ULM-LIG-4490',
    true
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Metal Table Lamp - White',
    'metal-table-lamp--white',
    'Classic table lamp perfect for bedside tables, desks, or accent lighting.',
    'Metal table lamp in white',
    166,
    247,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["white", "black", "brass"], "materials": ["ceramic", "metal"]}',
    '{"length": 25.1, "width": 21.9, "height": 56.3}',
    31,
    true,
    '{"lighting","table","metal","white"}',
    14.8,
    'ULM-LIG-9822',
    true
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Wood Modern Pendant Light - White',
    'wood-modern-pendant-light--white',
    'Stylish pendant light that provides focused illumination and serves as a design statement.',
    'Wood modern pendant light in white',
    386,
    501,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["black", "brass", "white"], "materials": ["metal", "glass"]}',
    '{"length": 29.6, "width": 26.1, "height": 49.5}',
    20,
    false,
    '{"lighting","pendant","wood","white"}',
    3.7,
    'ULM-LIG-3666',
    true
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Glass Modern Pendant Light - Black',
    'glass-modern-pendant-light--black',
    'Stylish pendant light that provides focused illumination and serves as a design statement.',
    'Glass modern pendant light in black',
    388,
    563,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["black", "brass", "white"], "materials": ["metal", "glass"]}',
    '{"length": 29.2, "width": 37.6, "height": 55.8}',
    20,
    false,
    '{"lighting","pendant","glass","black"}',
    17.4,
    'ULM-LIG-7217',
    true
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Wood Modern Pendant Light - Black',
    'wood-modern-pendant-light--black',
    'Stylish pendant light that provides focused illumination and serves as a design statement.',
    'Wood modern pendant light in black',
    339,
    445,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["black", "brass", "white"], "materials": ["metal", "glass"]}',
    '{"length": 29.9, "width": 21.5, "height": 45.3}',
    27,
    true,
    '{"lighting","pendant","wood","black"}',
    23.7,
    'ULM-LIG-5235',
    true
FROM categories c WHERE c.slug = 'lighting'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Silk Throw Pillow Set - Pattern',
    'silk-throw-pillow-set--pattern',
    'Set of decorative throw pillows that add comfort and style to any seating area.',
    'Silk throw pillow set in pattern',
    67,
    82,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["neutral", "colorful", "pattern"], "materials": ["cotton", "linen"]}',
    '{"length": 57.2, "width": 50.3, "height": 16.9}',
    17,
    true,
    '{"textiles","cushions","silk","pattern"}',
    24.1,
    'ULM-TEX-1124',
    true
FROM categories c WHERE c.slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Linen Throw Pillow Set - Neutral',
    'linen-throw-pillow-set--neutral',
    'Set of decorative throw pillows that add comfort and style to any seating area.',
    'Linen throw pillow set in neutral',
    50,
    70,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["neutral", "colorful", "pattern"], "materials": ["cotton", "linen"]}',
    '{"length": 50.1, "width": 57.1, "height": 10.9}',
    30,
    false,
    '{"textiles","cushions","linen","neutral"}',
    22.5,
    'ULM-TEX-3030',
    true
FROM categories c WHERE c.slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Acrylic Knit Throw Blanket - Gray',
    'acrylic-knit-throw-blanket--gray',
    'Cozy knit throw blanket perfect for snuggling on the couch or adding texture to your decor.',
    'Acrylic knit throw blanket in gray',
    147,
    205,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["cream", "gray", "navy"], "materials": ["wool", "cotton"]}',
    '{"length": 91.7, "width": 46.5, "height": 57.1}',
    6,
    false,
    '{"textiles","throws","acrylic","gray"}',
    20.2,
    'ULM-TEX-2851',
    true
FROM categories c WHERE c.slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Cashmere Knit Throw Blanket - Burgundy',
    'cashmere-knit-throw-blanket--burgundy',
    'Cozy knit throw blanket perfect for snuggling on the couch or adding texture to your decor.',
    'Cashmere knit throw blanket in burgundy',
    119,
    156,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["cream", "gray", "navy"], "materials": ["wool", "cotton"]}',
    '{"length": 33.0, "width": 23.6, "height": 88.6}',
    50,
    false,
    '{"textiles","throws","cashmere","burgundy"}',
    20.5,
    'ULM-TEX-3977',
    true
FROM categories c WHERE c.slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Cotton Knit Throw Blanket - Burgundy',
    'cotton-knit-throw-blanket--burgundy',
    'Cozy knit throw blanket perfect for snuggling on the couch or adding texture to your decor.',
    'Cotton knit throw blanket in burgundy',
    130,
    180,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["cream", "gray", "navy"], "materials": ["wool", "cotton"]}',
    '{"length": 95.2, "width": 45.7, "height": 41.9}',
    14,
    false,
    '{"textiles","throws","cotton","burgundy"}',
    16.7,
    'ULM-TEX-7300',
    true
FROM categories c WHERE c.slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Jute Area Rug - Neutral',
    'jute-area-rug--neutral',
    'Beautiful area rug that defines spaces and adds warmth to any room.',
    'Jute area rug in neutral',
    230,
    340,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["neutral", "pattern", "colorful"], "materials": ["wool", "cotton"]}',
    '{"length": 226.3, "width": 109.6, "height": 2.2}',
    26,
    true,
    '{"textiles","rugs","jute","neutral"}',
    3.0,
    'ULM-TEX-4620',
    true
FROM categories c WHERE c.slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Linen Throw Pillow Set - Solid',
    'linen-throw-pillow-set--solid',
    'Set of decorative throw pillows that add comfort and style to any seating area.',
    'Linen throw pillow set in solid',
    58,
    72,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["neutral", "colorful", "pattern"], "materials": ["cotton", "linen"]}',
    '{"length": 43.4, "width": 54.0, "height": 13.6}',
    40,
    false,
    '{"textiles","cushions","linen","solid"}',
    5.9,
    'ULM-TEX-2819',
    true
FROM categories c WHERE c.slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    'Cotton Throw Pillow Set - Neutral',
    'cotton-throw-pillow-set--neutral',
    'Set of decorative throw pillows that add comfort and style to any seating area.',
    'Cotton throw pillow set in neutral',
    94,
    124,
    c.id,
    'Ulmo',
    '["https://images.pexels.com/photos/1000000/pexels-photo-1000000.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000001/pexels-photo-1000001.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "https://images.pexels.com/photos/1000002/pexels-photo-1000002.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"]',
    '{"colors": ["neutral", "colorful", "pattern"], "materials": ["cotton", "linen"]}',
    '{"length": 49.8, "width": 46.1, "height": 15.0}',
    34,
    false,
    '{"textiles","cushions","cotton","neutral"}',
    3.1,
    'ULM-TEX-8545',
    true
FROM categories c WHERE c.slug = 'textiles'
ON CONFLICT (slug) DO NOTHING;

