# Netlify 部署指南

本文档介绍如何将媒体文件管理器部署到 Netlify。

## 🚀 快速部署

### 方法一：通过 Netlify CLI（推荐）

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **部署到 Netlify**
   ```bash
   # 首次部署
   netlify deploy --prod --dir=out
   
   # 或者先预览部署
   netlify deploy --dir=out
   # 然后发布到生产环境
   netlify deploy --prod
   ```

### 方法二：通过 Git 集成

1. **推送代码到 Git 仓库**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **连接 Netlify**
   - 访问 [Netlify](https://app.netlify.com)
   - 点击 "New site from Git"
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 选择你的仓库

3. **配置构建设置**
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18` (在环境变量中设置 `NODE_VERSION=18`)

### 方法三：手动部署

1. **构建项目**
   ```bash
   npm install
   npm run build
   ```

2. **上传文件**
   - 将 `out` 目录中的所有文件上传到 Netlify
   - 或者将 `out` 目录压缩为 zip 文件并在 Netlify 控制台中拖拽上传

## ⚙️ 配置说明

### netlify.toml 配置文件

项目根目录的 `netlify.toml` 文件包含了 Netlify 的部署配置：

```toml
[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
```

### Next.js 配置

`next.config.js` 已配置为静态导出模式：

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}
```

## 🌐 环境变量

如果你的应用需要环境变量，请在 Netlify 控制台中设置：

1. 进入站点设置
2. 点击 "Environment variables"
3. 添加所需的环境变量

常用环境变量：
- `NODE_VERSION`: `18`
- `NPM_FLAGS`: `--prefer-offline`

## 🔧 故障排除

### 构建失败

1. **检查 Node.js 版本**
   ```bash
   node --version  # 确保本地版本与 Netlify 一致
   ```

2. **清理依赖**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **检查构建日志**
   - 在 Netlify 控制台查看详细的构建日志
   - 查找具体的错误信息

### 路由问题

如果遇到客户端路由问题，确保 `netlify.toml` 中的重定向规则正确：

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 静态文件问题

确保所有静态文件都在 `public` 目录中，它们会被自动复制到输出目录。

## 📈 性能优化

### 缓存策略

`netlify.toml` 已配置了静态文件缓存：

```toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 图片优化

由于使用了静态导出，图片优化已禁用。如需优化图片，请：

1. 使用适当的图片格式（WebP, AVIF）
2. 压缩图片大小
3. 考虑使用 CDN

## 🔒 安全配置

项目已包含基本的安全头部配置：

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📱 自定义域名

1. 在 Netlify 控制台中转到 "Domain settings"
2. 点击 "Add custom domain"
3. 输入你的域名
4. 根据指示配置 DNS 记录

## 🔄 持续部署

通过 Git 集成，每次推送到主分支都会自动触发部署：

```bash
git add .
git commit -m "Update feature"
git push origin main  # 自动触发部署
```

## 📞 支持

如果遇到问题：

1. 查看 [Netlify 文档](https://docs.netlify.com/)
2. 检查 [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
3. 查看构建日志获取详细错误信息

---

## 示例部署命令

```bash
# 完整部署流程
npm install           # 安装依赖
npm run build        # 构建项目
netlify deploy --prod --dir=out  # 部署到生产环境
```

部署成功后，你的媒体文件管理器就可以在 Netlify 提供的 URL 上访问了！
