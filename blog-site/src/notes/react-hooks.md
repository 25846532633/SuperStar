---
title: "深入理解 React Hooks：从入门到最佳实践"
date: "2026-04-28"
tags: ["React", "TypeScript", "Hooks"]
summary: "系统梳理 useState、useEffect、useMemo、useCallback 等核心 Hooks，结合实际案例讲解最佳实践与常见踩坑。"
---

## 为什么需要 Hooks

在 React 16.8 之前，函数组件只能通过 props 接收数据，无法拥有自己的状态或使用生命周期方法。Hooks 的引入彻底改变了这一局面，让函数组件也能拥有状态管理和副作用处理的能力。

Hooks 遵循三个核心原则：

1. **只在函数组件最顶层调用**，不要在循环、条件判断或嵌套函数中使用
2. **只在 React 函数组件或自定义 Hook 中调用**
3. **自定义 Hook 必须以 `use` 开头命名**

## useState：状态管理基础

`useState` 是最常用的 Hook，用于在函数组件中添加本地状态。

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev - 1)}>-1</button>
    </div>
  );
}
```

> **最佳实践**：当新状态依赖旧状态时，使用函数式更新 `prev => prev + 1`，避免闭包陷阱。

## useEffect：副作用处理

`useEffect` 用于处理副作用 —— 数据请求、DOM 操作、订阅管理等。

```tsx
import { useState, useEffect } from "react";

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      setLoading(true);
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      if (!cancelled) setUser(data);
      setLoading(false);
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <p>加载中...</p>;
  return <div>{user?.name}</div>;
}
```

**关键要点：**

- 依赖数组 `[userId]` 决定何时重新执行 effect
- 清理函数 `return () => { cancelled = true }` 防止竞态条件
- 空依赖数组 `[]` 表示仅在组件挂载时执行一次

## useMemo 与 useCallback：性能优化

当计算开销大或者需要保持引用稳定时，这两个 Hook 非常有用。

```tsx
import { useMemo, useCallback } from "react";

function ExpensiveList({ items, filter }: Props) {
  // 只在 items 或 filter 变化时重新计算
  const filtered = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  );

  // 保持回调引用稳定，避免子组件不必要的重渲染
  const handleClick = useCallback((id: string) => {
    console.log("选中:", id);
  }, []);

  return (
    <ul>
      {filtered.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

## 总结

| Hook | 用途 | 返回值 |
|------|------|--------|
| `useState` | 状态管理 | `[value, setter]` |
| `useEffect` | 副作用处理 | 无（可选清理函数） |
| `useMemo` | 缓存计算结果 | 缓存值 |
| `useCallback` | 缓存函数引用 | 缓存函数 |

掌握这些核心 Hooks，你就掌握了 React 函数组件开发的基石。
