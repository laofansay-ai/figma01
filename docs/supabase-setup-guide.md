# Supabase 数据库完整设置指南

这个详细指南将帮助您完成 Ulmo E-Commerce 项目的 Supabase 数据库配置。

## 🚨 快速故障排除：数据库表缺失问题

### 如果您看到以下错误：

- `Could not find the table 'public.site_settings' in the schema cache`
- `数据库表未设置，请运行数据库初始化脚本`
- 系统健康检查显示 "❌ 数据库连接失败"

### 🔧 立即解决方案：

1. **打开 Supabase 控制台**

   - 访问 https://app.supabase.com
   - 登录您的账户并选择项目

2. **进入 SQL Editor**

   - 点击左侧导航栏的 "SQL Editor"
   - 点击 "New query"

3. **执行数据库设置脚本**

   - 复制 `scripts/setup_database.sql` 文件的所有内容
   - 粘贴到 SQL Editor 中
   - 点击 "Run" 按钮执行
   - 等待看到 "✅ Ulmo E-Commerce database schema setup completed successfully!" 消息

4. **验证修复**
   - 返回应用，刷新页面
   - 重新运行系统健康检查
   - 应该看到 "✅ 数据库连接正常"

---

## 🎯 第一步：创建 Supabase 项目

### 1.1 注册和登录

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project" 或 "Sign Up"
3. 使用 GitHub、Google 或邮箱注册
4. 验证邮箱（如果使用邮箱注册）

### 1.2 创建新项目

1. 登录后，点击 "New Project"
2. 选择您的组织（Organization）
3. 填写项目信息：
   - **项目名称**: `ulmo-ecommerce`
   - **数据库密码**: 选择一个强密码（至少 12 位，包含大小写字母、数字和特殊字符）
   - **地区**: 选择离您用户最近的地区
   - **定价计划**: 选择 "Free" （免费）
4. 点击 "Create new project"
5. 等待项目初始化（通常需要 2-3 分钟）

## 🔑 第二步：获取项目凭证

### 2.1 访问 API 设置

1. 在 Supabase 仪表板，点击左侧边栏的 "Settings"
2. 选择 "API"
3. 您将看到以下重要信息：

### 2.2 复制关键信息

- **Project URL**: 格式为 `https://xxxxxxxxxxxxx.supabase.co`
- **Project API keys** 部分：
  - **anon public**: 这是前端使用的公共密钥
  - **service_role**: 这是服务器端使用的密钥（暂时不需要）

⚠️ **重要提示**:

- 只使用 `anon public` 密钥用于前端
- 永远不要在前端代码中暴露 `service_role` 密钥
- 保护好您的密钥，不要提交到公共代码仓库

## 🔧 第三步：配置环境变量

### 3.1 更新 .env 文件

项目根目录已经有 `.env` 文件，请编辑它：

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Application Settings
VITE_APP_NAME=Ulmo E-Commerce
VITE_APP_VERSION=1.0.0

# Development Settings
VITE_NODE_ENV=development
```

### 3.2 替换占位符

1. 将 `https://your-project-id.supabase.co` 替换为您的实际 Project URL
2. 将 `your-anon-public-key-here` 替换为您的实际 anon public 密钥

### 3.3 验证配置

保存文件后，重启开发服务器：

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
pnpm run dev
```

## 🗄️ 第四步：设置数据库表结构

### 4.1 访问 SQL 编辑器

1. 在 Supabase 仪表板，点击左侧边栏的 "SQL Editor"
2. 点击 "New query"

### 4.2 执行数据库设置脚本

1. 复制 `scripts/setup_database.sql` 文件的全部内容
2. 粘贴到 SQL 编辑器中
3. 点击 "Run" 按钮执行脚本
4. 等待执行完成（可能需要几秒钟）
5. 确认看到成功消息

### 4.3 验证表创建

执行完成后，您应该看到以下表被创建：

- `profiles` - 用户资料
- `categories` - 商品分类
- `products` - 商品信息
- `product_reviews` - 商品评价
- `cart_items` - 购物车项目
- `orders` - 订单
- `order_items` - 订单项目
- `user_addresses` - 用户地址
- `wishlists` - 愿望清单
- `coupons` - 优惠券
- `site_settings` - 网站设置

您可以在 "Table Editor" 中查看这些表。

## 🔒 第五步：配置认证设置

### 5.1 设置认证 URL

1. 在 Supabase 仪表板，点击 "Authentication"
2. 点击 "Settings"
3. 在 "Site URL" 中添加：`http://localhost:5173`
4. 在 "Redirect URLs" 中添加：`http://localhost:5173/**`

### 5.2 配置邮箱设置（可选）

1. 在 "Auth" 设置页面
2. 启用 "Enable email confirmations" （如果需要邮箱验证）
3. 自定义邮件模板（可选）

### 5.3 配置提供商（可选）

如果您想要社交登录：

1. 滚动到 "Auth Providers" 部分
2. 启用 Google、GitHub 等提供商
3. 填写相应的客户端 ID 和密钥

## 🧪 第六步：测试连接

### 6.1 启动应用

```bash
cd c:\Users\Dream\Documents\GitHub\figma01
pnpm run dev
```

### 6.2 测试功能

1. 打开浏览器访问 `http://localhost:5173`
2. 导航到 "Account" 页面
3. 尝试注册新账户
4. 检查 Supabase 仪表板的 "Authentication" > "Users" 中是否出现新用户

### 6.3 验证数据库连接

1. 打开浏览器开发者控制台 (F12)
2. 查看是否有任何与 Supabase 相关的错误
3. 如果看到连接成功的消息，说明配置正确

## 📊 第七步：插入示例数据

### 7.1 使用现有的商品数据脚本

```bash
# 生成商品数据（如果还未生成）
python scripts/generate_products.py

# 查看生成的数据
cat scripts/products.json
```

### 7.2 手动插入商品数据（可选）

如果需要手动插入数据：

1. 在 SQL 编辑器中
2. 复制并运行 `scripts/insert_products.sql` 脚本

## 🔍 故障排除

### 常见问题 1: "Invalid API key" 错误

**解决方案**:

- 检查 `.env` 文件中的密钥是否正确
- 确保使用的是 `anon public` 密钥，不是 `service_role` 密钥
- 重启开发服务器

### 常见问题 2: 数据库连接错误

**解决方案**:

- 验证 Supabase Project URL 是否正确
- 检查数据库表是否成功创建
- 确认 RLS 策略是否正确配置

### 常见问题 3: 认证不工作

**解决方案**:

- 检查 Site URL 和 Redirect URLs 设置
- 验证邮箱确认设置
- 确认用户是否出现在 Authentication > Users 中

### 常见问题 4: CORS 错误

**解决方案**:

- 确保在 Supabase 设置中添加了正确的域名
- 检查开发服务器 URL 是否正确

## ✅ 完成检查清单

在继续之前，请确认以下项目都已完成：

- [ ] ✅ Supabase 项目已创建
- [ ] ✅ 项目凭证已获取
- [ ] ✅ `.env` 文件已配置
- [ ] ✅ 数据库表已创建
- [ ] ✅ RLS 策略已启用
- [ ] ✅ 认证设置已配置
- [ ] ✅ 应用连接测试成功
- [ ] ✅ 用户注册功能正常
- [ ] ✅ 商品数据已准备

## 🚀 下一步

完成数据库设置后，您可以：

1. **测试核心功能**: 试用所有主要功能
2. **自定义数据**: 添加您自己的商品和分类
3. **部署到生产环境**: 准备生产部署
4. **性能优化**: 配置缓存和索引优化

## 📞 获取帮助

如果遇到问题：

1. 查看 Supabase 官方文档：[docs.supabase.com](https://docs.supabase.com)
2. 检查 Supabase 仪表板的 "Logs" 部分
3. 查看浏览器控制台的错误信息
4. 参考项目的 `README.md` 和 `SETUP.md` 文档

---

**完成时间估算**: 15-30 分钟  
**难度级别**: 初级到中级  
**前置条件**: 基本的网络开发知识

🎉 **恭喜！** 完成这些步骤后，您的 Ulmo E-Commerce 应用将拥有一个完全功能的后端数据库！
