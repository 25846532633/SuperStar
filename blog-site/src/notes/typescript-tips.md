---
title: "TypeScript 实用技巧：让你的类型体操不再枯燥"
date: "2026-03-22"
tags: ["TypeScript", "技巧", "类型系统"]
summary: "分享日常开发中高频使用的 TypeScript 技巧，包括泛型约束、条件类型、工具类型和类型推导的进阶用法。"
---

## 内置工具类型

TypeScript 提供了丰富的内置工具类型，熟练使用可以大幅减少重复代码。

```typescript
// Partial: 所有属性变为可选
interface User {
  name: string;
  age: number;
  email: string;
}

function updateUser(id: string, patch: Partial<User>) {
  // patch 的每个字段都是可选的
}

// Pick 和 Omit: 精确控制字段
type UserPreview = Pick<User, "name" | "email">;
type UserWithoutEmail = Omit<User, "email">;

// Record: 快速创建键值对类型
type PageRoutes = Record<string, string>;
const routes: PageRoutes = {
  home: "/",
  about: "/about",
  notes: "/notes",
};
```

## 泛型约束与条件类型

泛型不是无限制的，我们需要给它们加上合理的约束。

```typescript
// 基础约束: T 必须具有 length 属性
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength("hello");   // ✅ 5
getLength([1, 2, 3]); // ✅ 3
// getLength(42);     // ❌ number 没有 length

// 条件类型: 根据输入类型决定输出类型
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

// 实战: 提取 Promise 的返回值类型
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type Result = Unwrap<Promise<string>>; // string
```

## keyof 与索引访问

这两个操作符是类型体操的基础组合技。

```typescript
interface Config {
  theme: "light" | "dark";
  fontSize: number;
  showSidebar: boolean;
}

// keyof: 获取所有属性名
type ConfigKey = keyof Config;
// "theme" | "fontSize" | "showSidebar"

// 索引访问: 获取特定属性的类型
type ThemeType = Config["theme"]; // "light" | "dark"

// 组合使用: 创建类型安全的 getter
function getConfig<K extends ConfigKey>(
  key: K
): Config[K] {
  const config: Config = {
    theme: "dark",
    fontSize: 14,
    showSidebar: true,
  };
  return config[key];
}

const theme = getConfig("theme");      // 类型: "light" | "dark"
const font = getConfig("fontSize");    // 类型: number
```

## as const 与字面量类型

`as const` 是最被低估的 TypeScript 特性之一。

```typescript
// 没有 as const: 类型被拓宽
const colors1 = ["red", "green", "blue"];
// 类型: string[]

// 使用 as const: 保留字面量
const colors2 = ["red", "green", "blue"] as const;
// 类型: readonly ["red", "green", "blue"]

// 实战: 从数组推导联合类型
type Color = (typeof colors2)[number];
// "red" | "green" | "blue"
```

## 总结

TypeScript 的类型系统远比看上去强大。掌握这些技巧，你能写出更安全、更自解释的代码：

- **内置工具类型** 减少模板代码
- **泛型约束** 让类型更精确
- **条件类型** 实现类型级编程
- **`keyof` + 索引访问** 提供编译时安全保障
- **`as const`** 保留关键的字面量信息

类型不是负担，而是你最好的文档和保镖。
