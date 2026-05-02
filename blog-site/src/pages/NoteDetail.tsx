import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getNoteBySlug, Note } from "../utils/loadNotes";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <button className="copy-button" onClick={handleCopy}>
      {copied ? "已复制 ✓" : "复制"}
    </button>
  );
}

function CodeBlock({
  language,
  value,
}: {
  language: string | undefined;
  value: string;
}) {
  return (
    <div className="code-block-wrapper">
      <CopyButton code={value} />
      <div className="code-block-header">
        <span className="code-dot red" />
        <span className="code-dot yellow" />
        <span className="code-dot green" />
        <span className="code-block-lang">{language || "code"}</span>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="pre"
        customStyle={{
          margin: 0,
          borderRadius: "0 0 12px 12px",
          background: "transparent",
          padding: "20px",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const value = String(children).replace(/\n$/, "");

    if (match) {
      return <CodeBlock language={match[1]} value={value} />;
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export default function NoteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError(true);
      return;
    }

    const found = getNoteBySlug(slug);
    if (found) {
      setNote(found);
      setError(false);
    } else {
      setError(true);
    }
  }, [slug]);

  if (error) {
    return (
      <div className="page-enter">
        <Link to="/notes" className="note-back-link">
          ← 返回笔记列表
        </Link>
        <div className="notes-empty">
          <p>笔记未找到</p>
          <p style={{ marginTop: 8, fontSize: "0.9rem" }}>
            试试返回笔记列表浏览其他内容
          </p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="page-enter">
        <p style={{ textAlign: "center", color: "var(--text-muted)", paddingTop: 80 }}>
          加载中...
        </p>
      </div>
    );
  }

  return (
    <div className="page-enter note-detail">
      <Link to="/notes" className="note-back-link">
        ← 返回笔记列表
      </Link>

      <div className="note-meta">
        <h1>{note.title}</h1>
        <p className="note-meta-date">{note.date}</p>
        <div className="note-meta-tags">
          {note.tags.map((tag) => (
            <span key={tag} className="note-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="markdown-body">
        <ReactMarkdown components={components}>{note.content}</ReactMarkdown>
      </div>
    </div>
  );
}
