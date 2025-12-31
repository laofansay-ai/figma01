# 测试真实数据功能指南

## 🎯 功能说明

已经将以下功能切换为使用 Supabase 数据库中的真实数据：

### ✅ 已完成的修改

1. **ProductService** - 启用真实数据
   - `useMockData = false`
   - 所有产品查询都使用 Supabase 数据库

2. **CartService** - 启用真实数据
   - `useMockData = false`
   - 购物车数据存储在 Supabase（登录用户）或 localStorage（游客）

3. **ProductDetail 页面** - 使用 productService
   - 异步加载产品数据
   - 支持通过 UUID 或 slug 查找产品
   - 添加加载状态和错误处理

4. **Home 页面** - 适配数据库字段
   - 特色产品展示使用真实数据
   - 分类信息使用真实数据
   - 修正字段名称（如 `compare_price`、`categories.name`）

5. **ProductList 页面** - 适配数据库字段
   - 产品列表使用真实数据
   - 购物车添加功能修正

## 🚀 测试步骤

### 1. 确保数据库数据已插入
```bash
# 1. 先在 Supabase Dashboard 中执行 RLS 策略修复
# 执行 scripts/fix_rls_policies.sql

# 2. 插入模拟产品数据
# 执行 scripts/insert_mock_data.sql
```

### 2. 启动开发服务器
```bash
pnpm run dev
```

### 3. 测试功能点

#### 🏠 首页测试
- 访问 http://localhost:5173
- 检查特色产品是否显示来自数据库的真实数据
- 检查分类是否正确显示
- 点击产品添加到购物车

#### 📦 产品详情测试
- 点击任意产品进入详情页
- 检查产品信息是否正确加载
- 测试添加到购物车功能
- 检查变体选择（颜色、尺寸）

#### 📋 产品列表测试
- 访问 /products 或点击分类
- 检查产品列表是否显示真实数据
- 测试排序和分页功能
- 测试搜索功能

#### 🛒 购物车测试
- 添加多个产品到购物车
- 检查购物车侧边栏显示
- 测试数量调整和删除功能
- 检查价格计算是否正确

#### ✅ 结账流程测试
- 确保用户已登录（使用测试账户：test@ulmo.com / test123456）
- 进入结账页面
- 完成订单创建
- 检查订单是否保存到数据库

## 🔍 数据库字段映射

### Mock 数据 → 数据库字段
- `comparePrice` → `compare_price`
- `reviewCount` → `review_count`
- `inventoryQuantity` → `inventory_quantity`
- `category` → `categories.name`
- `isFeatured` → `is_featured`

### 注意事项
1. **图片数组**：数据库中存储为 JSONB，包含图片 URL 数组
2. **变体选项**：存储在 `variants` JSONB 字段中
3. **分类关联**：通过外键关联 `categories` 表
4. **价格格式**：数据库中为 DECIMAL 类型，前端显示需要格式化

## 🐛 可能的问题和解决方案

### 1. 产品图片不显示
- 检查 `images` 字段是否正确存储为 JSON 数组
- 确保图片 URL 可访问

### 2. 购物车功能异常
- 检查产品 ID 格式（UUID vs 数字）
- 确保 CartContext 正确处理产品数据

### 3. 数据库连接错误
- 检查 .env 文件中的 Supabase 配置
- 确保 RLS 策略已正确设置

### 4. 订单创建失败
- 检查用户是否已登录
- 确保 orders 和 order_items 表的 RLS 策略允许插入

## 📊 验证数据完整性

在 Supabase Dashboard 中运行以下查询来验证数据：

```sql
-- 检查产品数据
SELECT id, name, price, images, inventory_quantity, is_featured 
FROM products 
WHERE is_active = true;

-- 检查分类数据
SELECT id, name, slug, icon 
FROM categories 
WHERE is_active = true;

-- 检查订单数据（如果有）
SELECT id, order_number, total_amount, status 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🎉 预期结果

完成测试后，应该看到：
- ✅ 首页显示 8 个真实产品
- ✅ 产品详情页正确加载产品信息
- ✅ 购物车功能正常工作
- ✅ 订单可以成功创建并保存到数据库
- ✅ 所有价格、图片、描述都来自数据库