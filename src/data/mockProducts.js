// Mock product data for development
export const mockCategories = [
  {
    id: 1,
    name: "Furniture",
    slug: "furniture",
    icon: "🪑",
    description: "Modern furniture for your home",
    productCount: 120
  },
  {
    id: 2,
    name: "Decor",
    slug: "decor",
    icon: "🏺",
    description: "Beautiful home decorations",
    productCount: 85
  },
  {
    id: 3,
    name: "Lighting",
    slug: "lighting",
    icon: "💡",
    description: "Stylish lighting solutions",
    productCount: 45
  },
  {
    id: 4,
    name: "Textiles",
    slug: "textiles",
    icon: "🛏️",
    description: "Comfortable textiles and fabrics",
    productCount: 67
  }
]

export const mockProducts = [
  {
    id: 1,
    name: "Oak Modern Wooden Chair - Natural",
    slug: "oak-modern-wooden-chair-natural",
    description: "A beautiful modern wooden chair with ergonomic design. Perfect for dining rooms, offices, or any space that needs a touch of contemporary style.",
    shortDescription: "Oak modern wooden chair in natural",
    price: 299,
    comparePrice: 399,
    category: "furniture",
    subcategory: "chairs",
    brand: "Ulmo",
    images: [
      "https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg",
      "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg",
      "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg"
    ],
    variants: {
      colors: ["natural", "dark brown", "black"],
      materials: ["oak", "walnut"]
    },
    dimensions: {
      length: 55.2,
      width: 52.8,
      height: 82.1
    },
    inventoryQuantity: 25,
    isFeatured: true,
    tags: ["furniture", "chairs", "oak", "natural"],
    weight: 8.5,
    sku: "ULM-FUR-1234",
    rating: 4.5,
    reviewCount: 24
  },
  {
    id: 2,
    name: "Ceramic Vase - White",
    slug: "ceramic-vase-white",
    description: "Elegant ceramic vase perfect for fresh flowers or as a standalone decorative piece. Handcrafted with attention to detail.",
    shortDescription: "Ceramic vase in white",
    price: 89,
    comparePrice: 120,
    category: "decor",
    subcategory: "vases",
    brand: "Ulmo",
    images: [
      "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg",
      "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg"
    ],
    variants: {
      colors: ["white", "blue", "green"],
      materials: ["ceramic", "porcelain"]
    },
    dimensions: {
      length: 22.5,
      width: 22.5,
      height: 35.0
    },
    inventoryQuantity: 15,
    isFeatured: true,
    tags: ["decor", "vases", "ceramic", "white"],
    weight: 2.3,
    sku: "ULM-DEC-5678",
    rating: 4.2,
    reviewCount: 18
  },
  {
    id: 3,
    name: "Metal Modern Pendant Light - Black",
    slug: "metal-modern-pendant-light-black",
    description: "Stylish pendant light that provides focused illumination and serves as a design statement.",
    shortDescription: "Metal modern pendant light in black",
    price: 249,
    comparePrice: 329,
    category: "lighting",
    subcategory: "pendant",
    brand: "Ulmo",
    images: [
      "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    variants: {
      colors: ["black", "brass", "white"],
      materials: ["metal", "glass"]
    },
    dimensions: {
      length: 30.0,
      width: 30.0,
      height: 45.5
    },
    inventoryQuantity: 12,
    isFeatured: false,
    tags: ["lighting", "pendant", "metal", "black"],
    weight: 3.2,
    sku: "ULM-LIG-9012",
    rating: 4.7,
    reviewCount: 31
  },
  {
    id: 4,
    name: "Cotton Throw Pillow Set - Neutral",
    slug: "cotton-throw-pillow-set-neutral",
    description: "Set of decorative throw pillows that add comfort and style to any seating area.",
    shortDescription: "Cotton throw pillow set in neutral",
    price: 69,
    comparePrice: 89,
    category: "textiles",
    subcategory: "cushions",
    brand: "Ulmo",
    images: [
      "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg",
      "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg"
    ],
    variants: {
      colors: ["neutral", "colorful", "pattern"],
      materials: ["cotton", "linen"]
    },
    dimensions: {
      length: 45.0,
      width: 45.0,
      height: 15.0
    },
    inventoryQuantity: 30,
    isFeatured: false,
    tags: ["textiles", "cushions", "cotton", "neutral"],
    weight: 1.2,
    sku: "ULM-TEX-3456",
    rating: 4.3,
    reviewCount: 12
  },
  {
    id: 5,
    name: "Walnut Coffee Table - Dark Brown",
    slug: "walnut-coffee-table-dark-brown",
    description: "Modern coffee table with clean lines and functional design. Perfect centerpiece for your living room.",
    shortDescription: "Walnut coffee table in dark brown",
    price: 499,
    comparePrice: 649,
    category: "furniture",
    subcategory: "tables",
    brand: "Ulmo",
    images: [
      "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
      "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg"
    ],
    variants: {
      colors: ["natural", "dark brown", "white"],
      materials: ["wood", "glass"]
    },
    dimensions: {
      length: 120.0,
      width: 60.0,
      height: 45.0
    },
    inventoryQuantity: 8,
    isFeatured: true,
    tags: ["furniture", "tables", "walnut", "dark brown"],
    weight: 25.0,
    sku: "ULM-FUR-7890",
    rating: 4.6,
    reviewCount: 19
  },
  {
    id: 6,
    name: "Fabric Modern Sectional Sofa - Gray",
    slug: "fabric-modern-sectional-sofa-gray",
    description: "Spacious sectional sofa perfect for large living rooms. Comfortable seating for the whole family.",
    shortDescription: "Fabric modern sectional sofa in gray",
    price: 1299,
    comparePrice: 1699,
    category: "furniture",
    subcategory: "sofas",
    brand: "Ulmo",
    images: [
      "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg",
      "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg"
    ],
    variants: {
      colors: ["gray", "beige", "navy"],
      materials: ["fabric", "leather"]
    },
    dimensions: {
      length: 220.0,
      width: 90.0,
      height: 85.0
    },
    inventoryQuantity: 5,
    isFeatured: true,
    tags: ["furniture", "sofas", "fabric", "gray"],
    weight: 45.0,
    sku: "ULM-FUR-2468",
    rating: 4.8,
    reviewCount: 42
  },
  {
    id: 7,
    name: "Brass Arc Floor Lamp - Gold",
    slug: "brass-arc-floor-lamp-gold",
    description: "Elegant arc floor lamp that provides ambient lighting and saves space.",
    shortDescription: "Brass arc floor lamp in gold",
    price: 349,
    comparePrice: 449,
    category: "lighting",
    subcategory: "floor",
    brand: "Ulmo",
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg"
    ],
    variants: {
      colors: ["black", "brass", "chrome"],
      materials: ["metal", "marble"]
    },
    dimensions: {
      length: 40.0,
      width: 40.0,
      height: 165.0
    },
    inventoryQuantity: 10,
    isFeatured: false,
    tags: ["lighting", "floor", "brass", "gold"],
    weight: 12.5,
    sku: "ULM-LIG-1357",
    rating: 4.4,
    reviewCount: 27
  },
  {
    id: 8,
    name: "Wool Area Rug - Pattern",
    slug: "wool-area-rug-pattern",
    description: "Beautiful area rug that defines spaces and adds warmth to any room.",
    shortDescription: "Wool area rug with pattern",
    price: 299,
    comparePrice: 399,
    category: "textiles",
    subcategory: "rugs",
    brand: "Ulmo",
    images: [
      "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg",
      "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg"
    ],
    variants: {
      colors: ["neutral", "pattern", "colorful"],
      materials: ["wool", "cotton"]
    },
    dimensions: {
      length: 200.0,
      width: 140.0,
      height: 2.0
    },
    inventoryQuantity: 18,
    isFeatured: false,
    tags: ["textiles", "rugs", "wool", "pattern"],
    weight: 8.0,
    sku: "ULM-TEX-9753",
    rating: 4.1,
    reviewCount: 15
  }
]

// Helper functions
export const getProductById = (id) => {
  return mockProducts.find(product => product.id === parseInt(id))
}

export const getProductsByCategory = (categorySlug) => {
  return mockProducts.filter(product => product.category === categorySlug)
}

export const getFeaturedProducts = () => {
  return mockProducts.filter(product => product.isFeatured)
}

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase()
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export const getCategoryBySlug = (slug) => {
  return mockCategories.find(category => category.slug === slug)
}

