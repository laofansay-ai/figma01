# 修复 PGRST116 错误指南

## 🔍 错误分析

**错误代码**: `PGRST116`  
**错误信息**: "Cannot coerce the result to a single JSON object"  
**详细说明**: "The result contains 0 rows"

这个错误表明 Supabase 查询使用了 `.single()` 方法期望返回单个记录，但实际查询结果为空（0行）。

## 🛠️ 解决方案

### 1. 立即执行数据库修复

在 Supabase Dashboard 的 SQL Editor 中执行：

```sql
-- 执行 scripts/fix-empty-query-results.sql
```

此脚本将：
- ✅ 检查并插入基础分类数据
- ✅ 确保必要的表结构存在
- ✅ 添加缺失的字段（average_rating, review_count）
- ✅ 验证数据完整性

### 2. 插入测试产品数据

如果产品表为空，执行：

```sql
-- 执行 scripts/insert_mock_data.sql
```

### 3. 代码修复已完成

已修复以下文件中的错误处理：

#### ✅ ProductService.js
- `getCategoryBySlug()` - 正确处理分类不存在的情况
- `getProductById()` - 正确处理产品不存在的情况  
- `getProductBySlug()` - 正确处理产品不存在的情况
- `getRelatedProducts()` - 正确处理当前产品不存在的情况
- `getSimilarProducts()` - 正确处理当前产品不存在的情况

#### ✅ CartService.js
- `addToCart()` - 正确处理购物车项目不存在的情况

#### ✅ OrderService.js  
- `getOrderById()` - 正确处理订单不存在的情况

## 📋 错误处理模式

修复后的代码使用以下模式处理 PGRST116 错误：

```javascript
try {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('id', id)
    .single()

  // 处理记录不存在的情况
  if (error && error.code === 'PGRST116') {
    return { data: null, error: null }
  }

  return { data, error }
} catch (error) {
  console.error('Error:', error)
  return { data: null, error }
}
```

## 🎯 测试验证

### 1. 验证数据库状态
```sql
-- 检查数据表状态
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
FROM categories;
```

### 2. 测试应用功能
1. **首页加载** - 检查特色产品是否正常显示
2. **产品详情** - 尝试访问不存在的产品ID
3. **分类页面** - 检查分类列表是否正常
4. **搜索功能** - 测试空搜索结果处理
5. **购物车** - 添加产品到购物车

### 3. 错误场景测试
- 访问不存在的产品：`/products/nonexistent-slug`
- 访问不存在的分类：`/categories/nonexistent-category`
- 查看空用户的订单列表
- 在空购物车中操作

## 🚀 预期结果

修复完成后：
- ✅ 不再出现 PGRST116 错误
- ✅ 应用能优雅处理空查询结果
- ✅ 用户看到友好的"未找到"提示而不是错误页面
- ✅ 所有功能正常工作

## 📝 注意事项

1. **数据依赖**：确保数据库中有基础数据（分类、产品）
2. **错误处理**：所有使用 `.single()` 的查询都应该处理 PGRST116 错误
3. **用户体验**：空结果应该显示友好提示，不是错误信息
4. **性能优化**：考虑使用 `.maybeSingle()` 替代 `.single()` + 错误处理

## 🔄 回退方案

如果仍有问题，可以暂时启用 mock 数据模式：

```javascript
// 在 ProductService 和 CartService 中
this.useMockData = true
```

这将使用本地模拟数据，确保应用基本功能可用。