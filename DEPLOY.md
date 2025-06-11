# 部署指南

## 部署到 Vercel

### 方法一：通过 GitHub

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Media Manager App"
   git branch -M main
   git remote add origin https://github.com/你的用户名/media-manager.git
   git push -u origin main
   ```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"

### 方法二：使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```

4. **设置生产域名**
   ```bash
   vercel --prod
   ```

## 环境配置

由于本应用使用浏览器本地存储，不需要额外的环境变量配置。

## 功能特性

- ✅ **SVG 支持** - 完整的 SVG 文件上传和预览
- ✅ **持久化存储** - 文件数据保存在浏览器 localStorage 中
- ✅ **文件管理** - 上传、预览、删除文件
- ✅ **存储统计** - 显示文件数量和存储大小
- ✅ **响应式设计** - 适配移动端和桌面端
- ✅ **多格式支持** - 图片、SVG、视频、Lottie 动画

## 支持的文件格式

| 类型 | 格式 | 说明 |
|------|------|------|
| 图片 | JPEG, PNG, GIF, WebP | 标准图片格式 |
| SVG | .svg | 矢量图形，支持交互和动画 |
| 视频 | MP4, WebM, OGG | HTML5 视频格式 |
| 动画 | JSON, .lottie | Lottie 动画文件 |

## 注意事项

1. **存储限制**: localStorage 通常有 5-10MB 的限制
2. **浏览器兼容性**: 需要支持 ES6+ 和 localStorage 的现代浏览器
3. **文件大小**: 建议单个文件不超过 2MB 以确保良好的性能
4. **数据持久性**: 清除浏览器数据会删除所有上传的文件

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 自定义配置

### 修改存储限制

在 `lib/storage.ts` 中可以添加文件大小检查：

```typescript
static async saveFile(file: File): Promise<StoredFile> {
  // 检查文件大小 (例如: 2MB 限制)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('文件大小不能超过 2MB')
  }
  // ...existing code...
}
```

### 添加新的文件格式

在 `lib/storage.ts` 中修改类型检查逻辑：

```typescript
let type: 'image' | 'lottie' | 'video' | 'svg' | 'your-new-type'
// 添加你的类型检查逻辑
```

## 故障排除

### 构建错误
- 确保所有依赖都已正确安装: `npm install`
- 检查 TypeScript 错误: `npm run lint`

### 部署问题
- 确保 `next.config.js` 配置正确
- 检查 Vercel 部署日志

### 存储问题
- 检查浏览器的 localStorage 是否被禁用
- 清理浏览器缓存和数据

## 技术支持

如果遇到问题，请检查：
1. Node.js 版本 (推荐 18+)
2. npm 版本
3. 浏览器控制台错误信息
