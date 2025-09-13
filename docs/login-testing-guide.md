# 登录和测试功能指南

## 概述

Ulmo E-Commerce 项目现在已完全实现了登录认证功能和完整的测试工具套件。本指南将帮助您了解和使用所有可用的认证和测试功能。

## 功能特性

### 🔐 认证功能

- ✅ 用户注册 (Email + 密码)
- ✅ 用户登录
- ✅ 用户登出
- ✅ 会话管理
- ✅ 受保护路由
- ✅ 用户状态持久化

### 🧪 测试工具

- ✅ 快速登录测试组件
- ✅ 完整认证流程测试
- ✅ 系统健康检查
- ✅ Supabase 连接验证
- ✅ 环境配置验证

## 使用方法

### 1. 启动应用

```bash
cd c:\Users\Dream\Documents\GitHub\figma01
pnpm run dev
```

应用将在 http://localhost:5175 启动

### 2. 访问测试页面

#### 基础登录界面

- 访问 `/account` 页面
- 如果未登录，会显示登录表单
- 底部有快速登录测试工具

#### 高级测试页面

- 访问 `/auth-test` 页面
- 提供完整的认证功能测试
- 包含系统状态监控和详细测试结果

### 3. 测试账户

默认测试账户信息：

- **邮箱**: `test@ulmo.com`
- **密码**: `test123456`

## 测试工具详解

### 快速登录测试 (QuickLoginTest)

位置：`/account` 页面底部

功能：

- 🔍 系统健康检查
- 👤 快速注册测试用户
- 🔑 一键登录测试
- 🚪 快速登出
- 📊 实时状态显示

使用方法：

1. 修改测试邮箱和密码（可选）
2. 点击"注册"创建测试用户
3. 点击"登录"测试登录功能
4. 点击"登出"测试登出功能

### 高级测试页面 (AuthTestPage)

位置：`/auth-test`

功能：

- 📊 详细的用户状态显示
- 🔄 完整认证流程测试
- 📝 测试结果记录
- ⚡ 快捷操作面板
- 🔗 直接链接到 Supabase 控制台

测试选项：

- **测试注册**: 单独测试用户注册功能
- **测试登录**: 单独测试用户登录功能
- **测试登出**: 单独测试用户登出功能
- **完整测试**: 运行完整的认证流程测试

### 系统健康检查

自动检查项目：

- ✅ 环境变量配置 (.env 文件)
- ✅ Supabase URL 格式验证
- ✅ API 密钥格式验证
- ✅ 数据库连接状态
- ✅ 认证服务可用性

## 技术实现

### 认证架构

- **后端**: Supabase Auth (PostgreSQL + JWT)
- **前端**: React Context + Custom Hooks
- **状态管理**: UserContext + CartContext
- **路由**: React Router DOM v7

### 核心组件

1. **UserContext** (`src/context/UserContext.jsx`)

   - 全局用户状态管理
   - 认证状态持久化

2. **useAuth Hook** (`src/hooks/useAuth.js`)

   - 封装认证逻辑
   - 提供简单的 API 接口

3. **Supabase Client** (`src/lib/supabase.js`)
   - 统一的数据库和认证接口
   - 错误处理和类型安全

### 安全特性

- 🔒 JWT Token 自动管理
- 🛡️ 行级安全策略 (RLS)
- 🔐 密码强度要求
- 🚫 XSS 防护
- 📧 邮箱验证支持

## 配置说明

### 环境变量 (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=Ulmo E-Commerce
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

### Supabase 设置

1. 访问 https://app.supabase.com
2. 创建新项目或使用现有项目
3. 在项目设置中获取 URL 和 API 密钥
4. 更新 .env 文件

## 故障排除

### 常见问题

#### 1. 环境变量未配置

**症状**: 系统健康检查失败
**解决**: 检查 .env 文件，确保所有必需变量已设置

#### 2. Supabase 连接失败

**症状**: 数据库连接测试失败
**解决**:

- 验证 Supabase URL 和 API 密钥
- 检查网络连接
- 确认 Supabase 项目状态

#### 3. 登录失败

**症状**: 认证请求返回错误
**解决**:

- 确认测试用户已注册
- 检查邮箱格式和密码要求
- 查看 Supabase 认证设置

#### 4. 页面路由错误

**症状**: 无法访问 /auth-test 页面
**解决**:

- 确认 App.jsx 中的路由配置
- 检查组件导入路径

### 调试工具

1. **浏览器开发者工具**

   - 查看 Network 选项卡中的 API 请求
   - 检查 Console 中的错误信息

2. **Supabase 控制台**

   - 监控认证日志
   - 查看用户管理界面

3. **应用内调试**
   - 使用"在控制台输出用户信息"按钮
   - 查看测试结果详情

## 下一步开发

### 建议的增强功能

- 🔄 密码重置功能
- 👥 社交登录 (Google, GitHub)
- 🛡️ 双因素认证 (2FA)
- 📱 手机号验证
- 👤 用户资料管理
- 🔐 角色和权限系统

### 性能优化

- ⚡ 认证状态缓存
- 🚀 懒加载认证组件
- 📊 认证指标监控

## 技术支持

如需技术支持或遇到问题：

1. 查看浏览器控制台错误信息
2. 运行系统健康检查
3. 查看 Supabase 项目日志
4. 参考本指南的故障排除部分

---

**更新时间**: 2025-09-12
**版本**: 1.0.0
**维护者**: Qoder AI Assistant
