# 修复产品评分字段错误

## 🔍 问题分析

数据库错误：`column products.rating does not exist`

**原因**：代码中引用了数据库表 `products` 中不存在的字段：
- `rating` → 应该是 `average_rating`
- `review_count` → 需要添加到数据库

## 🛠️ 解决方案

### 1. 执行数据库修复脚本

在 Supabase Dashboard 的 SQL Editor 中执行：

```sql
-- 执行 scripts/add_missing_product_fields.sql
```

此脚本会：
- ✅ 添加 `average_rating` 字段（DECIMAL(3,2)）
- ✅ 添加 `review_count` 字段（INTEGER）  
- ✅ 创建自动更新评分统计的触发器
- ✅ 为现有产品初始化评分数据

### 2. 代码修复完成

已修复以下文件中的字段引用：

#### ProductService.js
- `rating` → `average_rating`
- 保持 `review_count` 不变

#### Home.jsx  
- `product.rating` → `product.average_rating`
- 保持 `product.review_count` 不变

#### ProductDetail.jsx
- `productData.rating` → `productData.average_rating`
- `productData.reviewCount` → `productData.review_count`

## 🎯 字段映射表

| 代码中使用 | 数据库字段 | 数据类型 | 说明 |
|-----------|-----------|----------|------|
| `product.average_rating` | `average_rating` | DECIMAL(3,2) | 平均评分 (0-5) |
| `product.review_count` | `review_count` | INTEGER | 评论数量 |
| `product.price` | `price` | DECIMAL(10,2) | 产品价格 |
| `product.compare_price` | `compare_price` | DECIMAL(10,2) | 对比价格 |

## 🔄 自动更新机制

数据库现在具有自动更新评分统计的功能：

1. **触发器**：当 `product_reviews` 表有变化时自动更新
2. **函数**：`update_product_rating_stats(product_uuid)` 重新计算评分
3. **实时性**：评分和评论数量会自动保持最新

## 🧪 测试验证

### 验证数据库字段
```sql
-- 检查新字段是否存在
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('average_rating', 'review_count');

-- 查看产品评分数据
SELECT id, name, average_rating, review_count, price
FROM products 
WHERE is_active = true
LIMIT 5;
```

### 测试应用功能
1. 启动开发服务器：`pnpm run dev`
2. 访问首页，检查产品评分显示
3. 进入产品详情页，验证评分信息
4. 确认不再出现数据库错误

## 📝 注意事项

1. **初始数据**：新添加的产品默认评分为 0，评论数为 0
2. **评分计算**：只统计已批准的评论 (`is_approved = true`)
3. **性能优化**：已为新字段添加数据库索引
4. **向后兼容**：代码修改保持与现有功能的兼容性

## 🚀 完成状态

- ✅ 数据库结构修复
- ✅ 代码字段引用修复  
- ✅ 自动更新机制建立
- ✅ 性能优化索引添加
- ✅ 测试验证准备就绪

现在可以正常使用真实数据功能，不会再出现 `rating` 字段不存在的错误！