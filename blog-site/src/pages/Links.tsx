import { useState, useEffect } from "react";

/* ===== 个人信息配置（替换为你自己的） ===== */
const GITHUB_USERNAME = "25846532633";
const CSDN_URL = "https://blog.csdn.net/m0_62867859?spm=1011.2415.3001.5343";

/* ===== GitHub API 类型 ===== */
interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

/* ===== GitHub 卡片组件 ===== */
function GitHubCard() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}`
        );
        if (!res.ok) {
          throw new Error(res.status === 404 ? "用户不存在" : `请求失败 (${res.status})`);
        }
        const data: GitHubUser = await res.json();
        if (!cancelled) {
          setUser(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "网络请求失败，请检查网络连接");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();
    return () => { cancelled = true; };
  }, []);

  /* --- 加载态 --- */
  if (loading) {
    return (
      <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            margin: "0 auto 16px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: 160,
            height: 20,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 4,
            margin: "0 auto 12px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: 120,
            height: 14,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 4,
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  /* --- 错误态 --- */
  if (error) {
    return (
      <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", marginBottom: 8 }}>
          无法加载 GitHub 信息
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{error}</p>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: 12 }}>
          请确认 <code style={{ color: "var(--aurora-5)" }}>{GITHUB_USERNAME}</code> 是有效的 GitHub 用户名
        </p>
      </div>
    );
  }

  /* --- 数据态 --- */
  return (
    <a
      href={user!.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card"
      style={{ display: "block", padding: 32, textAlign: "center" }}
    >
      <img
        src={user!.avatar_url}
        alt={user!.login}
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "2px solid var(--border-card)",
          marginBottom: 16,
        }}
      />
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        {user!.name || user!.login}
      </h3>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          marginBottom: 12,
        }}
      >
        @{user!.login}
      </p>
      {user!.bio && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            marginBottom: 20,
            maxWidth: 300,
            margin: "0 auto 20px",
          }}
        >
          {user!.bio}
        </p>
      )}

      {/* 数值统计 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 32,
          paddingTop: 16,
          borderTop: "1px solid var(--border-card)",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.4rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--aurora-5), var(--aurora-3))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {user!.public_repos}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Repos</p>
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.4rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--aurora-1), var(--aurora-2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {user!.followers}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Followers</p>
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.4rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--aurora-6), var(--aurora-5))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {user!.following}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Following</p>
        </div>
      </div>
    </a>
  );
}

/* ===== CSDN 卡片组件 ===== */
function CSDNCard() {
  return (
    <a
      href={CSDN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card"
      style={{
        display: "block",
        padding: 32,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 背景微光 */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,107,0.15), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* CSDN 图标 */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          background: "linear-gradient(135deg, #fc5531, #fc5531cc)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: "1.8rem",
          fontWeight: 800,
          color: "#fff",
          fontFamily: "var(--font-heading)",
        }}
      >
        C
      </div>

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        CSDN 技术博客
      </h3>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
          marginBottom: 20,
        }}
      >
        查看更多技术文章、踩坑记录和开发笔记
      </p>

      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 24px",
          borderRadius: 999,
          background: "linear-gradient(135deg, #fc5531, #e04428)",
          color: "#fff",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        访问 CSDN
      </span>
    </a>
  );
}

/* ===== Links 页面 ===== */
export default function Links() {
  return (
    <div className="page-enter">
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1
          style={{
            fontSize: "2rem",
            fontFamily: "var(--font-heading)",
            marginBottom: 8,
          }}
        >
          我的其他平台
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          在其他地方也可以找到我和我的作品
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          maxWidth: 750,
          margin: "0 auto",
        }}
      >
        <GitHubCard />
        <CSDNCard />
      </div>
    </div>
  );
}
