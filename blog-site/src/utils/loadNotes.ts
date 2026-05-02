export interface Note {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  content: string;
}

export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
}

/**
 * 简易 YAML frontmatter 解析器（替代 gray-matter，避免 ESM/CJS 兼容问题）
 */
function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, unknown> = {};

  const lines = yamlBlock.split("\n");
  let currentKey = "";
  let arrayBuffer: string[] = [];
  let inArray = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // 空行跳过
    if (!trimmed) continue;

    // 多行数组延续
    if (inArray) {
      if (trimmed.startsWith("- ")) {
        arrayBuffer.push(trimmed.slice(2).replace(/^["']|["']$/g, ""));
        continue;
      } else {
        // 数组结束
        data[currentKey] = arrayBuffer;
        arrayBuffer = [];
        inArray = false;
        currentKey = "";
      }
    }

    // 单行数组: tags: [React, TypeScript]
    const inlineArrayMatch = trimmed.match(/^(\w+):\s*\[(.+)\]$/);
    if (inlineArrayMatch) {
      const key = inlineArrayMatch[1];
      const rawItems = inlineArrayMatch[2];
      data[key] = rawItems
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    // 多行数组开始: tags:
    const arrayStartMatch = trimmed.match(/^(\w+):$/);
    if (arrayStartMatch) {
      currentKey = arrayStartMatch[1];
      inArray = true;
      arrayBuffer = [];
      continue;
    }

    // 键值对: key: value
    const kvMatch = trimmed.match(/^(\w+):\s*(.+)$/);
    if (kvMatch) {
      data[kvMatch[1]] = kvMatch[2].replace(/^["']|["']$/g, "");
    }
  }

  // 处理末尾的数组
  if (inArray && currentKey) {
    data[currentKey] = arrayBuffer;
  }

  return { data, content };
}

const rawModules = import.meta.glob("/src/notes/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function getAllNotes(): NoteMeta[] {
  const notes: NoteMeta[] = [];

  for (const [path, raw] of Object.entries(rawModules)) {
    const slug = path.replace("/src/notes/", "").replace(".md", "");
    const { data } = parseFrontmatter(raw as string);
    notes.push({
      slug,
      title: (data.title as string) || slug,
      date: (data.date as string) || "",
      tags: (data.tags as string[]) || [],
      summary: (data.summary as string) || "",
    });
  }

  notes.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return notes;
}

export function getNoteBySlug(slug: string): Note | null {
  const path = `/src/notes/${slug}.md`;
  const raw = rawModules[path];
  if (!raw) return null;

  const { data, content } = parseFrontmatter(raw as string);
  return {
    slug,
    title: (data.title as string) || slug,
    date: (data.date as string) || "",
    tags: (data.tags as string[]) || [],
    summary: (data.summary as string) || "",
    content,
  };
}

export function getAllTags(): string[] {
  const notes = getAllNotes();
  const tagSet = new Set<string>();
  notes.forEach((note) => note.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}
