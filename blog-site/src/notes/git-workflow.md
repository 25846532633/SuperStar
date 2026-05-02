---
title: "Git 工作流实战：从 Solo 到团队协作"
date: "2026-04-15"
tags: ["Git", "DevOps", "协作"]
summary: "从个人项目到团队协作，介绍 Git Flow、GitHub Flow 和 Trunk-Based Development 三种主流工作流的使用场景与实操。"
---

## 个人项目：轻量级分支策略

当我独自开发项目时，通常采用最简单的工作流：

```bash
# 1. 从 main 切出功能分支
git checkout -b feat/aurora-background

# 2. 开发并原子化提交
git add src/components/AuroraBackground.tsx
git commit -m "feat: add aurora background with floating orbs"

git add src/styles/global.css
git commit -m "style: add glassmorphism card styles"

# 3. 合并回 main
git checkout main
git merge feat/aurora-background
git branch -d feat/aurora-background
```

**提交信息规范**：推荐使用 Conventional Commits 格式 —— `<type>: <description>`

常见的 type 包括：
- `feat`：新功能
- `fix`：Bug 修复
- `style`：样式调整（不影响逻辑）
- `refactor`：重构
- `docs`：文档
- `chore`：构建、依赖等杂项

## 团队协作：GitHub Flow

当项目有多个协作者时，GitHub Flow 是一个很好的选择。核心规则：

1. `main` 分支始终可部署
2. 从 `main` 创建描述性分支
3. 提交并推送到远程
4. 创建 Pull Request
5. 经过 Code Review 后合并

```bash
# 创建功能分支并推送
git checkout -b feat/search-filter
git push -u origin feat/search-filter

# 开发完成后，在 GitHub 创建 PR
# Code Review → CI 通过 → Squash Merge

# 合并后清理本地
git checkout main
git pull origin main
git branch -d feat/search-filter
```

> **Squash Merge** 是把一个分支上所有 commit 合并成一个干净 commit 的方式，保持 main 分支的历史清晰。

## Trunk-Based Development

对于成熟团队和持续集成要求高的项目，Trunk-Based 是更激进的选择：

- 所有开发者频繁向 `main` 提交小改动（每天至少一次）
- 使用 **Feature Flags** 控制未完成功能的可见性
- 短生命周期的分支（不超过 1-2 天）

## 解决冲突

冲突是协作中不可避免的：

```bash
# 1. 拉取最新代码
git checkout main && git pull

# 2. 变基到最新 main
git checkout feat/my-feature
git rebase main

# 3. 如果出现冲突，解决后
git add .
git rebase --continue

# 4. 强制推送（因为 rebase 改变了历史）
git push --force-with-lease
```

> `--force-with-lease` 比 `--force` 更安全，它会检查远程是否有你不知道的新提交。

## 总结

选择工作流的核心考量：

- **个人项目**：最简单的分支即可
- **小团队（2-5人）**：GitHub Flow 足够
- **大团队 / CI/CD 频繁**：Trunk-Based + Feature Flags

没有银弹，适合团队的才是最好的。
