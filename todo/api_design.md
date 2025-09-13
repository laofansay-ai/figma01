# Ulmo E-Commerce API 设计文档

## API 基础信息

- **Base URL**: `https://api.ulmo-ecommerce.com/v1`
- **认证方式**: Bearer Token (Supabase JWT)
- **数据格式**: JSON
- **HTTP 状态码**: 标准 REST API 状态码

## 1. 认证相关 API

### 用户注册
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    }
  }
}
```

### 用户登录
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token"
    }
  }
}
```

### 用户登出
```http
POST /auth/logout
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 获取用户信息
```http
GET /auth/me
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "avatar_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## 2. 商品相关 API

### 获取商品列表
```http
GET /products?page=1&limit=20&category=furniture&sort=price_asc&search=chair

Query Parameters:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20, 最大: 100)
- category: 分类 slug
- sort: 排序方式 (price_asc, price_desc, name_asc, name_desc, created_desc)
- search: 搜索关键词
- min_price: 最低价格
- max_price: 最高价格
- is_featured: 是否特色商品 (true/false)

Response:
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Modern Wooden Chair",
        "slug": "modern-wooden-chair",
        "price": 299.00,
        "compare_price": 399.00,
        "images": ["https://..."],
        "category": {
          "id": "uuid",
          "name": "Furniture",
          "slug": "furniture"
        },
        "is_featured": true,
        "inventory_quantity": 10,
        "rating": 4.5,
        "review_count": 24
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8
    }
  }
}
```

### 获取商品详情
```http
GET /products/{id}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Modern Wooden Chair",
    "slug": "modern-wooden-chair",
    "description": "A beautiful modern wooden chair...",
    "short_description": "Modern wooden chair with ergonomic design",
    "price": 299.00,
    "compare_price": 399.00,
    "images": ["https://..."],
    "variants": {
      "colors": ["brown", "black", "white"],
      "sizes": ["small", "medium", "large"]
    },
    "category": {
      "id": "uuid",
      "name": "Furniture",
      "slug": "furniture"
    },
    "brand": "Ulmo",
    "sku": "ULM-CHAIR-001",
    "weight": 5.5,
    "dimensions": {
      "length": 60,
      "width": 60,
      "height": 80
    },
    "inventory_quantity": 10,
    "is_featured": true,
    "tags": ["modern", "wooden", "chair"],
    "rating": 4.5,
    "review_count": 24,
    "reviews": [
      {
        "id": "uuid",
        "user_name": "John D.",
        "rating": 5,
        "title": "Great chair!",
        "content": "Very comfortable and stylish",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 搜索商品
```http
GET /products/search?q=wooden chair&category=furniture

Response:
{
  "success": true,
  "data": {
    "products": [...],
    "suggestions": ["wooden chair", "wooden table", "chair cushion"],
    "filters": {
      "categories": [
        {"slug": "furniture", "name": "Furniture", "count": 45}
      ],
      "price_ranges": [
        {"min": 0, "max": 100, "count": 12},
        {"min": 100, "max": 300, "count": 28}
      ],
      "brands": [
        {"name": "Ulmo", "count": 15}
      ]
    }
  }
}
```

## 3. 分类相关 API

### 获取分类列表
```http
GET /categories

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Furniture",
      "slug": "furniture",
      "description": "Modern furniture for your home",
      "icon": "🪑",
      "image_url": "https://...",
      "product_count": 120,
      "children": [
        {
          "id": "uuid",
          "name": "Chairs",
          "slug": "chairs",
          "product_count": 45
        }
      ]
    }
  ]
}
```

### 获取分类详情
```http
GET /categories/{slug}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Furniture",
    "slug": "furniture",
    "description": "Modern furniture for your home",
    "icon": "🪑",
    "image_url": "https://...",
    "product_count": 120,
    "parent": null,
    "children": [...],
    "products": [...]
  }
}
```

## 4. 购物车相关 API

### 获取购物车
```http
GET /cart
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "product": {
          "id": "uuid",
          "name": "Modern Wooden Chair",
          "price": 299.00,
          "images": ["https://..."]
        },
        "quantity": 2,
        "variant_options": {
          "color": "brown",
          "size": "medium"
        },
        "unit_price": 299.00,
        "total_price": 598.00
      }
    ],
    "summary": {
      "subtotal": 598.00,
      "tax": 47.84,
      "shipping": 15.00,
      "total": 660.84,
      "item_count": 2
    }
  }
}
```

### 添加商品到购物车
```http
POST /cart/items
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "product_id": "uuid",
  "quantity": 2,
  "variant_options": {
    "color": "brown",
    "size": "medium"
  }
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "product": {...},
    "quantity": 2,
    "variant_options": {...},
    "total_price": 598.00
  }
}
```

### 更新购物车商品
```http
PUT /cart/items/{id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "quantity": 3
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "quantity": 3,
    "total_price": 897.00
  }
}
```

### 删除购物车商品
```http
DELETE /cart/items/{id}
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "message": "Item removed from cart"
}
```

### 清空购物车
```http
DELETE /cart
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "message": "Cart cleared"
}
```

## 5. 订单相关 API

### 创建订单
```http
POST /orders
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_line_1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "billing_address": {...},
  "payment_method": "stripe",
  "shipping_method": "standard",
  "coupon_code": "SAVE10"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20240101-0001",
    "status": "pending",
    "total_amount": 660.84,
    "payment_url": "https://checkout.stripe.com/..."
  }
}
```

### 获取订单列表
```http
GET /orders?page=1&limit=10&status=delivered
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "order_number": "ORD-20240101-0001",
        "status": "delivered",
        "total_amount": 660.84,
        "created_at": "2024-01-01T00:00:00Z",
        "item_count": 2
      }
    ],
    "pagination": {...}
  }
}
```

### 获取订单详情
```http
GET /orders/{id}
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "order_number": "ORD-20240101-0001",
    "status": "delivered",
    "subtotal": 598.00,
    "tax_amount": 47.84,
    "shipping_amount": 15.00,
    "total_amount": 660.84,
    "shipping_address": {...},
    "items": [
      {
        "id": "uuid",
        "product_name": "Modern Wooden Chair",
        "quantity": 2,
        "unit_price": 299.00,
        "total_price": 598.00,
        "variant_options": {...}
      }
    ],
    "tracking_number": "1Z999AA1234567890",
    "created_at": "2024-01-01T00:00:00Z",
    "shipped_at": "2024-01-02T00:00:00Z",
    "delivered_at": "2024-01-05T00:00:00Z"
  }
}
```

## 6. 愿望清单 API

### 获取愿望清单
```http
GET /wishlist
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Modern Wooden Chair",
        "price": 299.00,
        "images": ["https://..."]
      },
      "added_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 添加到愿望清单
```http
POST /wishlist
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "product_id": "uuid"
}

Response:
{
  "success": true,
  "message": "Product added to wishlist"
}
```

### 从愿望清单删除
```http
DELETE /wishlist/{product_id}
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

## 7. 用户地址 API

### 获取地址列表
```http
GET /addresses
Authorization: Bearer {access_token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "shipping",
      "is_default": true,
      "first_name": "John",
      "last_name": "Doe",
      "address_line_1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US",
      "phone": "+1234567890"
    }
  ]
}
```

### 创建地址
```http
POST /addresses
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "type": "shipping",
  "is_default": true,
  "first_name": "John",
  "last_name": "Doe",
  "address_line_1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "shipping",
    "is_default": true,
    ...
  }
}
```

## 8. 商品评价 API

### 获取商品评价
```http
GET /products/{product_id}/reviews?page=1&limit=10&sort=newest

Response:
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "user_name": "John D.",
        "rating": 5,
        "title": "Great product!",
        "content": "Very satisfied with this purchase",
        "images": ["https://..."],
        "is_verified_purchase": true,
        "helpful_count": 12,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "summary": {
      "average_rating": 4.5,
      "total_reviews": 24,
      "rating_distribution": {
        "5": 12,
        "4": 8,
        "3": 3,
        "2": 1,
        "1": 0
      }
    },
    "pagination": {...}
  }
}
```

### 创建商品评价
```http
POST /products/{product_id}/reviews
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "rating": 5,
  "title": "Great product!",
  "content": "Very satisfied with this purchase",
  "images": ["https://..."]
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "rating": 5,
    "title": "Great product!",
    "content": "Very satisfied with this purchase",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## 9. 优惠券 API

### 验证优惠券
```http
POST /coupons/validate
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "code": "SAVE10",
  "cart_total": 598.00
}

Response:
{
  "success": true,
  "data": {
    "code": "SAVE10",
    "discount_type": "percentage",
    "discount_value": 10,
    "discount_amount": 59.80,
    "minimum_amount": 50.00,
    "is_valid": true
  }
}
```

## 10. 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 6 characters"]
    }
  }
}
```

## 常见错误码

- `400` - Bad Request (参数错误)
- `401` - Unauthorized (未认证)
- `403` - Forbidden (无权限)
- `404` - Not Found (资源不存在)
- `409` - Conflict (资源冲突)
- `422` - Unprocessable Entity (验证失败)
- `429` - Too Many Requests (请求过多)
- `500` - Internal Server Error (服务器错误)

## API 限流

- 每个用户每分钟最多 60 次请求
- 搜索 API 每分钟最多 30 次请求
- 认证相关 API 每分钟最多 10 次请求

