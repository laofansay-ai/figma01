#!/usr/bin/env python3
"""
Product Data Generator for Ulmo E-Commerce
Generates realistic product data with images from Pexels
"""

import json
import random
import requests
import time
from typing import List, Dict, Any
import os
from pathlib import Path

# Pexels API configuration
PEXELS_API_KEY = "YOUR_PEXELS_API_KEY"  # Replace with actual API key
PEXELS_BASE_URL = "https://api.pexels.com/v1"

# Product categories and their details
CATEGORIES = {
    "furniture": {
        "name": "Furniture",
        "icon": "🪑",
        "description": "Modern furniture for your home",
        "subcategories": ["chairs", "tables", "sofas", "storage", "desks"]
    },
    "decor": {
        "name": "Decor",
        "icon": "🏺",
        "description": "Beautiful home decorations",
        "subcategories": ["vases", "artwork", "mirrors", "plants", "candles"]
    },
    "lighting": {
        "name": "Lighting",
        "icon": "💡",
        "description": "Stylish lighting solutions",
        "subcategories": ["pendant", "floor", "table", "ceiling", "wall"]
    },
    "textiles": {
        "name": "Textiles",
        "icon": "🛏️",
        "description": "Comfortable textiles and fabrics",
        "subcategories": ["cushions", "throws", "rugs", "curtains", "bedding"]
    }
}

# Product templates for each category
PRODUCT_TEMPLATES = {
    "furniture": {
        "chairs": [
            {
                "name": "Modern Wooden Chair",
                "description": "A beautiful modern wooden chair with ergonomic design. Perfect for dining rooms, offices, or any space that needs a touch of contemporary style.",
                "price_range": (199, 399),
                "materials": ["oak", "walnut", "pine", "bamboo"],
                "colors": ["natural", "dark brown", "black", "white"],
                "search_terms": ["wooden chair", "dining chair", "office chair"]
            },
            {
                "name": "Ergonomic Office Chair",
                "description": "Professional office chair with lumbar support and adjustable height. Designed for long hours of comfortable work.",
                "price_range": (299, 599),
                "materials": ["mesh", "leather", "fabric"],
                "colors": ["black", "gray", "white", "blue"],
                "search_terms": ["office chair", "ergonomic chair", "desk chair"]
            },
            {
                "name": "Accent Armchair",
                "description": "Stylish accent chair that adds personality to any room. Perfect for reading corners or as statement furniture.",
                "price_range": (399, 799),
                "materials": ["velvet", "linen", "leather"],
                "colors": ["navy", "emerald", "mustard", "gray"],
                "search_terms": ["accent chair", "armchair", "lounge chair"]
            }
        ],
        "tables": [
            {
                "name": "Coffee Table",
                "description": "Modern coffee table with clean lines and functional design. Perfect centerpiece for your living room.",
                "price_range": (299, 699),
                "materials": ["wood", "glass", "metal", "marble"],
                "colors": ["natural", "black", "white", "gold"],
                "search_terms": ["coffee table", "living room table", "center table"]
            },
            {
                "name": "Dining Table",
                "description": "Elegant dining table that brings family and friends together. Seats 4-6 people comfortably.",
                "price_range": (599, 1299),
                "materials": ["oak", "walnut", "marble", "glass"],
                "colors": ["natural", "dark brown", "white", "black"],
                "search_terms": ["dining table", "kitchen table", "family table"]
            }
        ],
        "sofas": [
            {
                "name": "Modern Sectional Sofa",
                "description": "Spacious sectional sofa perfect for large living rooms. Comfortable seating for the whole family.",
                "price_range": (899, 1899),
                "materials": ["fabric", "leather", "microfiber"],
                "colors": ["gray", "beige", "navy", "charcoal"],
                "search_terms": ["sectional sofa", "corner sofa", "large sofa"]
            },
            {
                "name": "Two-Seater Loveseat",
                "description": "Cozy loveseat perfect for small spaces or as additional seating. Comfortable and stylish.",
                "price_range": (499, 999),
                "materials": ["fabric", "velvet", "leather"],
                "colors": ["gray", "blue", "green", "pink"],
                "search_terms": ["loveseat", "small sofa", "two seater"]
            }
        ]
    },
    "decor": {
        "vases": [
            {
                "name": "Ceramic Vase",
                "description": "Elegant ceramic vase perfect for fresh flowers or as a standalone decorative piece.",
                "price_range": (49, 149),
                "materials": ["ceramic", "porcelain", "stoneware"],
                "colors": ["white", "blue", "green", "terracotta"],
                "search_terms": ["ceramic vase", "flower vase", "decorative vase"]
            },
            {
                "name": "Glass Vase Set",
                "description": "Set of three glass vases in different sizes. Perfect for creating beautiful arrangements.",
                "price_range": (79, 199),
                "materials": ["glass", "crystal"],
                "colors": ["clear", "amber", "blue", "green"],
                "search_terms": ["glass vase", "vase set", "clear vase"]
            }
        ],
        "artwork": [
            {
                "name": "Abstract Wall Art",
                "description": "Modern abstract artwork that adds color and personality to any wall.",
                "price_range": (99, 299),
                "materials": ["canvas", "paper", "metal"],
                "colors": ["multicolor", "black white", "blue", "gold"],
                "search_terms": ["abstract art", "wall art", "modern art"]
            }
        ]
    },
    "lighting": {
        "pendant": [
            {
                "name": "Modern Pendant Light",
                "description": "Stylish pendant light that provides focused illumination and serves as a design statement.",
                "price_range": (149, 399),
                "materials": ["metal", "glass", "wood"],
                "colors": ["black", "brass", "white", "copper"],
                "search_terms": ["pendant light", "hanging light", "ceiling light"]
            }
        ],
        "floor": [
            {
                "name": "Arc Floor Lamp",
                "description": "Elegant arc floor lamp that provides ambient lighting and saves space.",
                "price_range": (199, 499),
                "materials": ["metal", "marble", "wood"],
                "colors": ["black", "brass", "chrome", "gold"],
                "search_terms": ["arc floor lamp", "standing lamp", "floor light"]
            }
        ],
        "table": [
            {
                "name": "Table Lamp",
                "description": "Classic table lamp perfect for bedside tables, desks, or accent lighting.",
                "price_range": (79, 249),
                "materials": ["ceramic", "metal", "wood", "glass"],
                "colors": ["white", "black", "brass", "blue"],
                "search_terms": ["table lamp", "bedside lamp", "desk lamp"]
            }
        ]
    },
    "textiles": {
        "cushions": [
            {
                "name": "Throw Pillow Set",
                "description": "Set of decorative throw pillows that add comfort and style to any seating area.",
                "price_range": (39, 99),
                "materials": ["cotton", "linen", "velvet", "silk"],
                "colors": ["neutral", "colorful", "pattern", "solid"],
                "search_terms": ["throw pillows", "cushions", "decorative pillows"]
            }
        ],
        "throws": [
            {
                "name": "Knit Throw Blanket",
                "description": "Cozy knit throw blanket perfect for snuggling on the couch or adding texture to your decor.",
                "price_range": (59, 149),
                "materials": ["wool", "cotton", "acrylic", "cashmere"],
                "colors": ["cream", "gray", "navy", "burgundy"],
                "search_terms": ["throw blanket", "knit blanket", "cozy blanket"]
            }
        ],
        "rugs": [
            {
                "name": "Area Rug",
                "description": "Beautiful area rug that defines spaces and adds warmth to any room.",
                "price_range": (149, 599),
                "materials": ["wool", "cotton", "jute", "synthetic"],
                "colors": ["neutral", "pattern", "colorful", "vintage"],
                "search_terms": ["area rug", "living room rug", "bedroom rug"]
            }
        ]
    }
}

class ProductGenerator:
    def __init__(self, api_key: str = None):
        self.api_key = api_key
        self.session = requests.Session()
        if api_key:
            self.session.headers.update({"Authorization": api_key})
    
    def search_pexels_images(self, query: str, per_page: int = 5) -> List[Dict]:
        """Search for images on Pexels"""
        if not self.api_key:
            # Return placeholder images if no API key
            return [
                {
                    "id": f"placeholder_{i}",
                    "url": f"https://images.pexels.com/photos/{1000000 + i}/pexels-photo-{1000000 + i}.jpeg",
                    "photographer": "Pexels",
                    "src": {
                        "medium": f"https://images.pexels.com/photos/{1000000 + i}/pexels-photo-{1000000 + i}.jpeg?auto=compress&cs=tinysrgb&h=350",
                        "large": f"https://images.pexels.com/photos/{1000000 + i}/pexels-photo-{1000000 + i}.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    }
                }
                for i in range(per_page)
            ]
        
        try:
            url = f"{PEXELS_BASE_URL}/search"
            params = {
                "query": query,
                "per_page": per_page,
                "orientation": "landscape"
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            return data.get("photos", [])
            
        except Exception as e:
            print(f"Error searching Pexels for '{query}': {e}")
            return []
    
    def generate_product_data(self, category: str, subcategory: str, template: Dict) -> Dict[str, Any]:
        """Generate a single product based on template"""
        
        # Generate basic product info
        material = random.choice(template["materials"])
        color = random.choice(template["colors"])
        price = random.randint(template["price_range"][0], template["price_range"][1])
        compare_price = int(price * random.uniform(1.2, 1.5))
        
        # Create product name with variations
        base_name = template["name"]
        if material and material not in base_name.lower():
            name = f"{material.title()} {base_name}"
        else:
            name = base_name
        
        if color and color not in name.lower():
            name = f"{name} - {color.title()}"
        
        # Generate slug
        slug = name.lower().replace(" ", "-").replace("--", "-")
        slug = "".join(c for c in slug if c.isalnum() or c == "-")
        
        # Search for images
        search_term = random.choice(template["search_terms"])
        if material:
            search_term = f"{material} {search_term}"
        
        images = self.search_pexels_images(search_term, 3)
        image_urls = [img["src"]["large"] for img in images if "src" in img]
        
        if not image_urls:
            # Fallback to generic furniture images
            image_urls = [
                "https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg",
                "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg"
            ]
        
        # Generate variants
        variants = {
            "colors": template["colors"][:3],  # Limit to 3 colors
            "materials": template["materials"][:2] if len(template["materials"]) > 1 else []
        }
        
        # Generate dimensions based on category
        dimensions = self.generate_dimensions(category, subcategory)
        
        # Generate tags
        tags = [category, subcategory, material, color]
        tags = [tag for tag in tags if tag and tag.strip()]
        
        return {
            "name": name,
            "slug": slug,
            "description": template["description"],
            "short_description": f"{material.title()} {base_name.lower()} in {color}",
            "price": price,
            "compare_price": compare_price,
            "category": category,
            "subcategory": subcategory,
            "brand": "Ulmo",
            "images": image_urls,
            "variants": variants,
            "dimensions": dimensions,
            "inventory_quantity": random.randint(5, 50),
            "is_featured": random.choice([True, False, False, False]),  # 25% chance
            "tags": tags,
            "weight": round(random.uniform(1.0, 25.0), 1),
            "sku": f"ULM-{category.upper()[:3]}-{random.randint(1000, 9999)}"
        }
    
    def generate_dimensions(self, category: str, subcategory: str) -> Dict[str, float]:
        """Generate realistic dimensions based on product type"""
        
        dimension_ranges = {
            "chairs": {"length": (45, 65), "width": (45, 65), "height": (75, 95)},
            "tables": {"length": (80, 200), "width": (80, 120), "height": (70, 80)},
            "sofas": {"length": (150, 250), "width": (80, 100), "height": (75, 90)},
            "vases": {"length": (15, 30), "width": (15, 30), "height": (20, 50)},
            "pendant": {"length": (20, 40), "width": (20, 40), "height": (30, 60)},
            "floor": {"length": (30, 50), "width": (30, 50), "height": (120, 180)},
            "table": {"length": (20, 35), "width": (20, 35), "height": (35, 60)},
            "cushions": {"length": (40, 60), "width": (40, 60), "height": (10, 20)},
            "rugs": {"length": (120, 300), "width": (80, 200), "height": (1, 3)}
        }
        
        ranges = dimension_ranges.get(subcategory, {"length": (20, 100), "width": (20, 100), "height": (20, 100)})
        
        return {
            "length": round(random.uniform(*ranges["length"]), 1),
            "width": round(random.uniform(*ranges["width"]), 1),
            "height": round(random.uniform(*ranges["height"]), 1)
        }
    
    def generate_all_products(self, products_per_category: int = 10) -> List[Dict[str, Any]]:
        """Generate products for all categories"""
        all_products = []
        
        for category_slug, category_info in CATEGORIES.items():
            print(f"Generating products for {category_info['name']}...")
            
            if category_slug not in PRODUCT_TEMPLATES:
                continue
            
            category_templates = PRODUCT_TEMPLATES[category_slug]
            products_generated = 0
            
            while products_generated < products_per_category:
                for subcategory, templates in category_templates.items():
                    if products_generated >= products_per_category:
                        break
                    
                    for template in templates:
                        if products_generated >= products_per_category:
                            break
                        
                        # Generate 2-3 variations of each template
                        variations = random.randint(1, 3)
                        for _ in range(variations):
                            if products_generated >= products_per_category:
                                break
                            
                            product = self.generate_product_data(category_slug, subcategory, template)
                            all_products.append(product)
                            products_generated += 1
                            
                            # Rate limiting for API calls
                            time.sleep(0.1)
            
            print(f"Generated {products_generated} products for {category_info['name']}")
        
        return all_products
    
    def save_products_json(self, products: List[Dict], filename: str = "products.json"):
        """Save products to JSON file"""
        output_path = Path(__file__).parent / filename
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                "categories": CATEGORIES,
                "products": products,
                "total_products": len(products),
                "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }, f, indent=2, ensure_ascii=False)
        
        print(f"Saved {len(products)} products to {output_path}")
        return output_path
    
    def generate_sql_insert(self, products: List[Dict], filename: str = "insert_products.sql"):
        """Generate SQL INSERT statements"""
        output_path = Path(__file__).parent / filename
        
        with open(output_path, 'w', encoding='utf-8') as f:
            # Insert categories first
            f.write("-- Insert categories\n")
            for slug, info in CATEGORIES.items():
                f.write(f"""INSERT INTO categories (name, slug, description, icon, sort_order, is_active) 
VALUES ('{info['name']}', '{slug}', '{info['description']}', '{info['icon']}', 1, true)
ON CONFLICT (slug) DO NOTHING;\n\n""")
            
            f.write("\n-- Insert products\n")
            for product in products:
                # Escape single quotes in strings
                def escape_sql(value):
                    if isinstance(value, str):
                        return value.replace("'", "''")
                    return value
                
                images_json = json.dumps(product['images']).replace("'", "''")
                variants_json = json.dumps(product['variants']).replace("'", "''")
                dimensions_json = json.dumps(product['dimensions']).replace("'", "''")
                tags_array = "{" + ",".join([f'"{tag}"' for tag in product['tags']]) + "}"
                
                f.write(f"""INSERT INTO products (
    name, slug, description, short_description, price, compare_price, 
    category_id, brand, images, variants, dimensions, inventory_quantity, 
    is_featured, tags, weight, sku, is_active
) 
SELECT 
    '{escape_sql(product['name'])}',
    '{escape_sql(product['slug'])}',
    '{escape_sql(product['description'])}',
    '{escape_sql(product['short_description'])}',
    {product['price']},
    {product['compare_price']},
    c.id,
    '{product['brand']}',
    '{images_json}',
    '{variants_json}',
    '{dimensions_json}',
    {product['inventory_quantity']},
    {str(product['is_featured']).lower()},
    '{tags_array}',
    {product['weight']},
    '{product['sku']}',
    true
FROM categories c WHERE c.slug = '{product['category']}'
ON CONFLICT (slug) DO NOTHING;

""")
        
        print(f"Generated SQL insert statements in {output_path}")
        return output_path

def main():
    """Main function to generate product data"""
    print("🛍️ Ulmo E-Commerce Product Generator")
    print("=" * 50)
    
    # Initialize generator
    generator = ProductGenerator(PEXELS_API_KEY if PEXELS_API_KEY != "YOUR_PEXELS_API_KEY" else None)
    
    # Generate products
    print("Generating product data...")
    products = generator.generate_all_products(products_per_category=8)
    
    # Save to files
    json_path = generator.save_products_json(products)
    sql_path = generator.generate_sql_insert(products)
    
    print("\n✅ Product generation completed!")
    print(f"📄 JSON file: {json_path}")
    print(f"🗄️ SQL file: {sql_path}")
    print(f"📊 Total products generated: {len(products)}")
    
    # Print summary by category
    print("\n📈 Products by category:")
    category_counts = {}
    for product in products:
        category = product['category']
        category_counts[category] = category_counts.get(category, 0) + 1
    
    for category, count in category_counts.items():
        category_name = CATEGORIES[category]['name']
        print(f"  {category_name}: {count} products")

if __name__ == "__main__":
    main()

