---
title: "Nuxt3 项目部署全流程：从开发到上线"
date: "2024-12-15"
tags: ["Nuxt", "部署", "DevOps"]
summary: "记录 Nuxt3 项目从本地开发到 Vercel 部署的完整流程，包括环境变量管理、SSR 配置和常见踩坑。"
---

> 原文发表于 CSDN，此处为归档备份。

## 为什么选择 Nuxt3

Nuxt3 基于 Vue3 + Vite，开箱即用地提供了：

- 文件系统路由
- 自动导入组件和 API
- SSR / SSG / SPA 三种渲染模式自由切换
- Nitro 服务端引擎（跨平台部署）

## 项目初始化

```bash
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app
npm install
```

初始化完成后目录结构如下：

```
my-nuxt-app/
├── pages/          # 文件路由
├── components/     # 自动导入的组件
├── server/         # API 和中间件
├── public/         # 静态资源
└── nuxt.config.ts  # 核心配置
```

## 关键配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  runtimeConfig: {
    // 仅服务端可访问
    apiSecret: process.env.API_SECRET,
    // 客户端也可访问
    public: {
      apiBase: process.env.API_BASE || "https://api.example.com",
    },
  },
});
```

`runtimeConfig` 是 Nuxt3 管理环境变量的推荐方式，比直接用 `process.env` 更安全、更类型友好。

## 部署到 Vercel

Vercel 对 Nuxt3 有原生支持，几乎零配置：

1. 将项目推送到 GitHub
2. 在 Vercel 中导入仓库
3. 框架会自动识别为 Nuxt.js
4. 设置环境变量
5. 点击 Deploy

构建命令：`npm run build`，输出目录：`.output/public`

## 常见踩坑

### 1. 客户端 API 请求 500

如果 `server/api/` 下的接口在开发环境正常但生产环境 500，检查是否正确导出了 `defineEventHandler`：

```typescript
// ❌ 错误
export default (event) => { ... }

// ✅ 正确
export default defineEventHandler(async (event) => {
  return { data: "hello" };
});
```

### 2. 静态生成时动态路由不生效

如果使用了 `pages/[id].vue` 这样的动态路由，SSG 模式下需要预生成路径：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ["/post/1", "/post/2"],
    },
  },
});
```

## 总结

Nuxt3 是目前部署最省心的 Vue 全栈框架之一。Vercel 的一键部署体验相当优秀，适合个人项目和中小型应用。
