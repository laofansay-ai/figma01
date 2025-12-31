# Cloudflare Pages 部署指南

## 概述
本文档介绍如何将 ULMO 电商前端项目部署到 Cloudflare Pages。项目使用 React + Vite + Tailwind + Supabase 技术栈。

## 部署前准备

### 1. 环境要求
- Node.js 18 或更高版本
- PNPM 包管理器
- Git 仓库（GitHub、GitLab 或 Bitbucket）
- Cloudflare 账户

### 2. 环境变量配置
在项目根目录创建 `.env` 文件（参考 `.env.example`）：

```bash
# Supabase 配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# 应用配置
VITE_APP_NAME=ULMO
VITE_APP_VERSION=1.0.0
```

### 3. 本地测试构建
在部署前，建议先本地测试构建过程：

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 本地预览构建结果
pnpm preview
```

## Cloudflare Pages 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 选择你的账户

2. **创建 Pages 项目**
   - 在左侧菜单选择 "Pages"
   - 点击 "Create a project"
   - 选择 "Connect to Git"

3. **连接 Git 仓库**
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 授权 Cloudflare 访问你的仓库
   - 选择包含项目代码的仓库

4. **配置构建设置**
   ```
   Framework preset: Vite
   Build command: pnpm install && pnpm build
   Build output directory: dist
   Root directory: (留空，使用仓库根目录)
   ```

5. **设置环境变量**
   - 在 "Environment variables" 部分添加：
     - `VITE_SUPABASE_URL`: 你的 Supabase 项目 URL
     - `VITE_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥
     - `NODE_VERSION`: 18 (或更高版本)

6. **部署项目**
   - 点击 "Save and Deploy"
   - Cloudflare 将自动开始构建和部署过程

### 方法二：使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **创建 Pages 项目**
   ```bash
   wrangler pages project create ulmo-ecommerce
   ```

4. **部署项目**
   ```bash
   # 构建项目
   pnpm build
   
   # 部署到 Cloudflare Pages
   wrangler pages publish dist --project-name=ulmo-ecommerce
   ```

## 自动部署设置

### 1. Git 集成
一旦设置完成，Cloudflare Pages 将自动：
- 监听你的 Git 仓库变化
- 在推送到主分支时自动触发构建
- 为每个 Pull Request 创建预览部署

### 2. 分支部署策略
- **生产分支**: `main` 或 `master`
- **预览分支**: 所有其他分支
- **预览 URL**: `https://branch-name.ulmo-ecommerce.pages.dev`

## 域名配置

### 1. 使用 Cloudflare 提供的域名
默认情况下，你的应用将在以下 URL 可用：
```
https://ulmo-ecommerce.pages.dev
```

### 2. 自定义域名
如果你有自己的域名：

1. 在 Pages 项目设置中点击 "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入你的域名（如 `your-domain.com`）
4. 按照提示配置 DNS 记录

## 性能优化

### 1. 缓存配置
项目已在 `wrangler.toml` 中配置了适当的缓存策略：
- 静态资源（CSS/JS）：缓存 1 年
- HTML 文件：不缓存，确保及时更新

### 2. 构建优化
Vite 配置已优化用于生产部署：
- 代码分割：按模块自动分割
- Tree Shaking：移除未使用的代码
- 压缩：使用 Terser 压缩 JavaScript
- 去除 console.log：生产环境自动移除

## 监控和调试

### 1. 构建日志
在 Cloudflare Dashboard 的 Pages 项目中：
- 查看 "Deployments" 标签页
- 点击具体部署查看详细日志

### 2. 函数日志
如果使用 Cloudflare Pages Functions：
- 在 "Functions" 标签页查看函数执行日志
- 使用 `wrangler pages deployment tail` 实时查看日志

### 3. 常见问题排查

**构建失败**
- 检查 Node.js 版本是否正确
- 确认所有依赖都在 `package.json` 中声明
- 查看构建日志中的错误信息

**环境变量问题**
- 确保所有 `VITE_` 前缀的变量都已设置
- 注意变量名的大小写
- 重新部署以应用新的环境变量

**路由问题**
- SPA 路由重定向已在 `wrangler.toml` 中配置
- 确保所有页面都返回 `index.html`

## 安全配置

### 1. 环境变量安全
- 敏感信息（如 API 密钥）应设置为环境变量
- 不要在代码中硬编码敏感信息
- 使用 `VITE_` 前缀暴露给前端的变量

### 2. HTTP 安全头
已在 `wrangler.toml` 中配置：
- `X-Frame-Options`: 防止点击劫持
- `X-Content-Type-Options`: 防止 MIME 类型混淆
- `Referrer-Policy`: 控制引用信息泄露

## 费用说明

Cloudflare Pages 提供慷慨的免费额度：
- 每月 500 次构建
- 无限带宽
- 全球 CDN 加速
- 自定义域名支持

超出免费额度后的定价请查看 [Cloudflare Pages 定价页面](https://pages.cloudflare.com/)。

## 后续步骤

1. **设置监控**: 配置 Cloudflare Analytics 监控网站性能
2. **配置 DNS**: 如果使用自定义域名，优化 DNS 设置
3. **设置 CI/CD**: 配置自动化测试和部署流程
4. **性能优化**: 使用 Cloudflare 的其他服务优化性能

## 支持

如果在部署过程中遇到问题：
- 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- 检查 [Cloudflare 社区论坛](https://community.cloudflare.com/)
- 联系项目维护者