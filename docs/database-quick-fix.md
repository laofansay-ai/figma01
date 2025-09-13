# 🔧 数据库连接失败快速修复指南

## 🚨 问题症状

您遇到了以下错误信息之一：

- `Could not find the table 'public.site_settings' in the schema cache`
- `数据库表未设置，请运行数据库初始化脚本`
- 系统健康检查显示：❌ 数据库连接失败

## ⚡ 5 分钟快速修复

### 步骤 1: 打开 Supabase 控制台

1. 在新标签页中打开 https://app.supabase.com
2. 登录您的账户
3. 选择您当前使用的项目

### 步骤 2: 进入 SQL 编辑器

1. 在左侧导航栏点击 **"SQL Editor"**
2. 点击 **"New query"** 创建新查询

### 步骤 3: 执行数据库设置脚本

1. 打开项目中的 `scripts/setup_database.sql` 文件
2. **全选并复制** 整个文件内容 (Ctrl+A, Ctrl+C)
3. 回到 Supabase SQL Editor
4. **粘贴** 脚本内容到编辑器中 (Ctrl+V)
5. 点击 **"Run"** 按钮执行脚本

### 步骤 4: 等待完成

- 脚本执行可能需要 10-30 秒
- 看到以下消息表示成功：
  ```
  ✅ Ulmo E-Commerce database schema setup completed successfully!
  📊 Tables created: profiles, categories, products, ...
  ```

### 步骤 5: 验证修复

1. 返回您的应用页面
2. **刷新浏览器页面** (F5)
3. 访问 `/auth-test` 页面或查看系统状态
4. 应该看到：**✅ 数据库连接正常**

## 📋 创建的数据库表

设置脚本将创建以下 11 个核心表：

| 表名              | 用途         |
| ----------------- | ------------ |
| `profiles`        | 用户资料信息 |
| `categories`      | 商品分类     |
| `products`        | 商品数据     |
| `product_reviews` | 商品评价     |
| `cart_items`      | 购物车项目   |
| `orders`          | 订单信息     |
| `order_items`     | 订单明细     |
| `user_addresses`  | 用户地址     |
| `wishlists`       | 心愿单       |
| `coupons`         | 优惠券       |
| `site_settings`   | 网站配置     |

## 🔍 如何验证设置成功

### 在应用中验证：

- ✅ 系统健康检查显示："数据库连接正常"
- ✅ 登录功能正常工作
- ✅ 购物车功能可以使用

### 在 Supabase 控制台验证：

1. 点击左侧 **"Table Editor"**
2. 确认可以看到上述所有表格
3. 点击 `site_settings` 表查看是否有默认数据

## ❌ 如果仍然失败

### 检查常见问题：

1. **环境变量配置错误**

   - 检查 `.env` 文件中的 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
   - 确保 URL 格式为：`https://xxxxx.supabase.co`
   - 确保密钥以 `eyJ` 开头

2. **SQL 脚本执行失败**

   - 在 SQL Editor 中查看错误信息
   - 确保复制了完整的脚本内容
   - 尝试分段执行脚本

3. **网络连接问题**
   - 检查网络连接
   - 尝试在不同浏览器中执行

### 获取帮助：

- 查看详细设置指南：`docs/supabase-setup-guide.md`
- 查看登录测试指南：`docs/login-testing-guide.md`
- 在浏览器控制台查看具体错误信息

## 🚀 完成后的下一步

数据库设置完成后，您可以：

1. 测试用户注册和登录功能
2. 使用购物车和商品浏览功能
3. 在 `/auth-test` 页面进行完整的功能测试

---

**注意**: 这个修复方案适用于开发环境。生产环境请遵循适当的数据库迁移流程。
