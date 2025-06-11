# Media Manager

一个现代化的媒体文件管理和预览应用，支持图片、Lottie 动画和视频文件。

## 功能特性

- 📷 **图片预览** - 支持 JPEG、PNG、GIF、WebP、SVG 等格式
- 🎬 **视频播放** - 支持 MP4、WebM、OGG 格式
- ✨ **Lottie 动画** - 支持 JSON 和 .lottie 文件
- 📁 **拖拽上传** - 简单直观的文件上传体验
- 🎨 **响应式设计** - 适配各种设备尺寸
- 💾 **本地存储** - 文件信息保存在浏览器本地
- 🔍 **实时预览** - 选择文件即可立即预览

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Heroicons
- **Lottie**: lottie-react
- **语言**: TypeScript

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入你的 GitHub 仓库
3. Vercel 会自动检测 Next.js 项目并进行部署

或者使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

## 使用说明

1. **上传文件**: 拖拽文件到上传区域或点击选择文件
2. **预览文件**: 点击文件卡片在右侧预览面板查看
3. **删除文件**: 悬停在文件卡片上点击删除按钮
4. **下载文件**: 在预览面板中点击下载按钮

## 支持的文件格式

- **图片**: .jpg, .jpeg, .png, .gif, .webp, .svg
- **视频**: .mp4, .webm, .ogg
- **Lottie**: .json, .lottie

## 许可证

MIT License
