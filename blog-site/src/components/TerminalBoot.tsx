import { useState, useEffect, useRef, useCallback } from "react";

/* ===== 数据结构 ===== */
type Segment = { text: string; color: string };
type BootLine = Segment[];

const G = "#39ff14"; // neon green
const C = "#00d4ff"; // cyan (动作词)
const W = "#ffffff"; // white
const A = "#ffb000"; // amber gold
const D = "#2d8a2d"; // dark green ([OK])
const X = "rgba(57, 255, 20, 0.4)"; // dim dots

/* ===== 启动序列（不含欢迎语，欢迎语在阶段三独立打出） ===== */
const BOOT_SEQUENCE: BootLine[] = [
  [
    { text: "> ", color: G },
    { text: "INITIALIZING", color: C },
    { text: " AuroraOS v1.0.0", color: G },
    { text: "......................................", color: X },
    { text: " [OK]", color: D },
  ],
  [
    { text: "> ", color: G },
    { text: "CHECKING", color: C },
    { text: " system integrity", color: G },
    { text: "........................................", color: X },
    { text: " [OK]", color: D },
  ],
  [
    { text: "> ", color: G },
    { text: "LOADING", color: C },
    { text: " kernel modules", color: G },
    { text: "...........................................", color: X },
    { text: " [OK]", color: D },
  ],
  [
    { text: "> ", color: G },
    { text: "MOUNTING", color: C },
    { text: " encrypted volumes", color: G },
    { text: ".......................................", color: X },
    { text: " [OK]", color: D },
  ],
  [
    { text: "> ", color: G },
    { text: "ESTABLISHING", color: C },
    { text: " quantum entanglement link", color: G },
    { text: "...........................", color: X },
    { text: " [OK]", color: D },
  ],
  [
    { text: "> ", color: G },
    { text: "CALIBRATING", color: C },
    { text: " holographic projectors", color: G },
    { text: "...............................", color: X },
    { text: " [OK]", color: D },
  ],
  [
    { text: "> ", color: G },
    { text: "SYNCING", color: C },
    { text: " neural interface protocols", color: G },
    { text: "................................", color: X },
    { text: " [OK]", color: D },
  ],
  [
    { text: "> ", color: G },
    { text: "LOADING", color: C },
    { text: " personal knowledge base", color: G },
    { text: "..................................", color: X },
    { text: " [OK]", color: D },
  ],
  [
    { text: "> ", color: G },
    { text: "RENDERING", color: C },
    { text: " Aurora Garden UI", color: G },
    { text: "......................................", color: X },
    { text: " [OK]", color: D },
  ],
];

/* 欢迎语（阶段三）两行 */
const WELCOME_LINE_1: Segment[] = [
  { text: "ACCESS GRANTED.", color: G },
];

const WELCOME_LINE_2: Segment[] = [
  { text: "WELCOME BACK, ", color: W },
  { text: "GEZHANG CAO.", color: A },
];

/* 震动触发索引（仅 BOOT_SEQUENCE 的 9 行内有效） */
const SHAKE_MAP: Record<number, "light" | "heavy"> = {
  4: "heavy",
  8: "light",
};

/* ===== 工具函数 ===== */
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

interface CharToken {
  char: string;
  color: string;
}

function tokenize(line: Segment[]): CharToken[] {
  const tokens: CharToken[] = [];
  for (const seg of line) {
    for (const ch of seg.text) {
      tokens.push({ char: ch, color: seg.color });
    }
  }
  return tokens;
}

function compactTokens(tokens: CharToken[]): Segment[] {
  const segs: Segment[] = [];
  for (const t of tokens) {
    const last = segs[segs.length - 1];
    if (last && last.color === t.color) {
      last.text += t.char;
    } else {
      segs.push({ text: t.char, color: t.color });
    }
  }
  return segs;
}

/* ===== 主组件 ===== */
interface TerminalBootProps {
  onFinish: () => void;
}

type Phase =
  | "scanline"       // 阶段一A: CRT扫描线
  | "booting"        // 阶段一B: 启动序列逐行打字
  | "bootFadeOut"    // 阶段二A: 启动序列整体淡出
  | "blackPause"     // 阶段二B: 短暂黑屏
  | "welcomeTyping"  // 阶段三A: 欢迎语逐字打出
  | "welcomePause"   // 阶段三B: 欢迎语停留
  | "transition"     // 阶段四: 极光过渡
  | "done";          // 阶段五: 完成

export default function TerminalBoot({ onFinish }: TerminalBootProps) {
  const [phase, setPhase] = useState<Phase>("scanline");

  /* 启动序列状态 */
  const [displayLines, setDisplayLines] = useState<Segment[][]>([]);
  const [currentLine, setCurrentLine] = useState<CharToken[] | null>(null);
  const [showCursor, setShowCursor] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(true);

  /* 欢迎语状态 */
  const [welcomeTokens1, setWelcomeTokens1] = useState<CharToken[] | null>(null);
  const [welcomeTokens2, setWelcomeTokens2] = useState<CharToken[] | null>(null);
  const [welcomeVisible, setWelcomeVisible] = useState(false);

  /* 过渡状态 */
  const [terminalBg, setTerminalBg] = useState("#000");
  const [clipActive, setClipActive] = useState(false);

  /* 震动 class */
  const [shakeClass, setShakeClass] = useState("");

  /* 光标闪烁（独立于组件 phase） */
  const [cursorBlink, setCursorBlink] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => setCursorBlink((v) => !v), 500);
    return () => clearInterval(iv);
  }, []);

  /* 保底 onFinish */
  const finishedRef = useRef(false);
  const safeFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  }, [onFinish]);

  /* ===================== 编排 ===================== */
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      /* ── 阶段一A：CRT扫描线（0s - 0.45s）── */
      setPhase("scanline");
      await delay(450);
      if (cancelled) return;

      /* ── 阶段一B：启动序列逐行打字（0.45s - ~4s）── */
      setPhase("booting");

      for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
        if (cancelled) return;

        /* 震动 */
        const intensity = SHAKE_MAP[i];
        if (intensity === "light") {
          setShakeClass("terminal-shake-light");
          setTimeout(() => setShakeClass(""), 300);
        } else if (intensity === "heavy") {
          setShakeClass("terminal-shake-heavy");
          setTimeout(() => setShakeClass(""), 400);
        }

        const tokens = tokenize(BOOT_SEQUENCE[i]);

        /* 光标出现 */
        setCurrentLine([]);
        setShowCursor(true);
        await delay(rand(30, 50));
        if (cancelled) return;

        /* 逐字打出 15-20ms/字 */
        for (let j = 0; j < tokens.length; j++) {
          if (cancelled) return;
          setCurrentLine(tokens.slice(0, j + 1));
          await delay(rand(15, 20));
        }

        /* 本行完成 */
        setDisplayLines((prev) => [...prev, compactTokens(tokens)]);
        setCurrentLine(null);
        setShowCursor(false);

        /* 行间间隔 */
        await delay(rand(50, 100));
      }

      if (cancelled) return;

      /* ── 阶段二A：启动序列整体淡出（~4s - 4.3s）── */
      setPhase("bootFadeOut");
      setTerminalVisible(false); // opacity 1→0，持续 0.3s（CSS transition）
      await delay(300);
      if (cancelled) return;

      /* ── 阶段二B：短暂黑屏（~4.3s - 4.5s）── */
      setPhase("blackPause");
      await delay(200);
      if (cancelled) return;

      /* ── 阶段三A：欢迎语逐字打出（~4.5s - 5.5s）── */
      setPhase("welcomeTyping");
      setWelcomeVisible(true);

      /* 第一行 ACCESS GRANTED. */
      const w1 = tokenize(WELCOME_LINE_1);
      setWelcomeTokens1([]);
      await delay(60);
      if (cancelled) return;

      for (let j = 0; j < w1.length; j++) {
        if (cancelled) return;
        setWelcomeTokens1(w1.slice(0, j + 1));
        await delay(rand(45, 65)); // 比启动行略慢，更有仪式感
      }

      await delay(180);
      if (cancelled) return;

      /* 第二行 WELCOME BACK, GEZHANG CAO. */
      const w2 = tokenize(WELCOME_LINE_2);
      setWelcomeTokens2([]);
      await delay(60);
      if (cancelled) return;

      for (let j = 0; j < w2.length; j++) {
        if (cancelled) return;
        setWelcomeTokens2(w2.slice(0, j + 1));
        await delay(rand(45, 65));
      }

      if (cancelled) return;

      /* ── 阶段三B：欢迎语停留让用户读完（0.6s）── */
      setPhase("welcomePause");
      await delay(600);
      if (cancelled) return;

      /* ── 阶段四：极光过渡（~5.5s - 6.3s）── */
      setPhase("transition");

      /* 欢迎语淡出（0.3s） */
      setWelcomeVisible(false);
      await delay(60); // 微小偏移让 welcome fade 先触发
      if (cancelled) return;

      /* 终端黑色背景 → transparent + clip-path 圆形扩散 */
      setTerminalBg("transparent");
      setClipActive(true);

      await delay(800); // 等两个过渡完成
      if (cancelled) return;

      /* ── 阶段五：完成 ── */
      safeFinish();
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [safeFinish]);

  /* ===================== 渲染 ===================== */
  if (phase === "done") return null;

  /* 终端窗口只在启动阶段显示；blackPause/welcome/transition 期间隐藏 */
  const showTerminalWindow = phase === "booting" || phase === "bootFadeOut";

  /* 欢迎语容器在欢迎和过渡阶段显示 */
  const showWelcome =
    phase === "welcomeTyping" || phase === "welcomePause" || phase === "transition";

  /* 欢迎语打完后不显示光标 */
  const w1Full = tokenize(WELCOME_LINE_1);
  const w2Full = tokenize(WELCOME_LINE_2);

  return (
    <>
      {/* ======== 阶段一A：扫描线 ======== */}
      {phase === "scanline" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10001,
            background: "#000",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 4,
              background: "#39ff14",
              boxShadow: "0 0 20px #39ff14, 0 0 60px #39ff14",
              animation: "crtScanline 0.4s ease-in forwards",
            }}
          />
        </div>
      )}

      {/* ======== 阶段一B～四：终端主体 + 欢迎语 + 过渡 ======== */}
      {phase !== "scanline" && (
        <div
          className={`${shakeClass}${clipActive ? " terminal-clip-expand" : ""}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: terminalBg,
            transition: "background 0.8s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 全息网格（极淡青色，全程存在） */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.03,
              backgroundImage: `
                repeating-linear-gradient(0deg, #00d4ff, #00d4ff 1px, transparent 1px, transparent 40px),
                repeating-linear-gradient(90deg, #00d4ff, #00d4ff 1px, transparent 1px, transparent 40px)
              `,
            }}
          />

          {/* ──── 终端窗口（仅启动+淡出阶段显示）──── */}
          {showTerminalWindow && (
            <div
              style={{
                width: "92vw",
                maxWidth: 900,
                opacity: terminalVisible ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(57, 255, 20, 0.15)",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 0 80px rgba(57, 255, 20, 0.06)",
                }}
              >
                {/* 顶部栏 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 36,
                    padding: "0 16px",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(0,212,255,0.08)",
                  }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e", marginLeft: 8 }} />
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#27c93f",
                      marginLeft: 8,
                      animation: "greenDotBlink 2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      marginLeft: 12,
                      fontSize: "0.75rem",
                      color: "rgba(0,212,255,0.5)",
                      fontFamily: "'Fira Code', 'SF Mono', monospace",
                    }}
                  >
                    AuroraOS v1.0.0
                  </span>
                </div>

                {/* 正文 */}
                <div
                  style={{
                    padding: "28px 32px",
                    fontFamily: "'Fira Code', 'SF Mono', monospace",
                    fontSize: "1.25rem",
                    lineHeight: 1.9,
                    minHeight: 420,
                  }}
                >
                  {/* 已完成的行 */}
                  {displayLines.map((segs, i) => (
                    <div key={i}>
                      {segs.map((s, j) => (
                        <span key={j} style={{ color: s.color }}>
                          {s.text}
                        </span>
                      ))}
                    </div>
                  ))}

                  {/* 当前打字行 */}
                  {currentLine && (
                    <div>
                      {currentLine.map((t, i) => (
                        <span key={i} style={{ color: t.color }}>
                          {t.char}
                        </span>
                      ))}
                      {showCursor && (
                        <span style={{ opacity: cursorBlink ? 1 : 0 }}>█</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ──── 欢迎语（阶段三～四）──── */}
          {showWelcome && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Fira Code', 'SF Mono', monospace",
                opacity: welcomeVisible ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {/* 第一行 ACCESS GRANTED. */}
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: 14,
                  textShadow:
                    "0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.3), 0 0 80px rgba(57, 255, 20, 0.15)",
                  animation: "neonPulse 2s ease-in-out infinite alternate",
                }}
              >
                {welcomeTokens1 !== null ? (
                  welcomeTokens1.map((t, i) => (
                    <span key={i} style={{ color: t.color }}>
                      {t.char}
                    </span>
                  ))
                ) : (
                  <span style={{ opacity: 0 }}>_</span>
                )}
                {/* 第一行已打完、第二行还未开始 → 光标 */}
                {phase === "welcomeTyping" &&
                  welcomeTokens1 &&
                  welcomeTokens1.length === w1Full.length &&
                  welcomeTokens2 === null && (
                    <span style={{ opacity: cursorBlink ? 1 : 0 }}>█</span>
                  )}
              </div>

              {/* 第二行 WELCOME BACK, GEZHANG CAO. */}
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 700,
                  textShadow:
                    "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(0,212,255,0.3)",
                  animation: "neonPulse 2s ease-in-out infinite alternate",
                }}
              >
                {welcomeTokens2 !== null ? (
                  welcomeTokens2.map((t, i) => (
                    <span key={i} style={{ color: t.color }}>
                      {t.char}
                    </span>
                  ))
                ) : (
                  <span style={{ opacity: 0 }}>_</span>
                )}
                {/* 第二行正在打字中 → 光标；打完则不显示 */}
                {phase === "welcomeTyping" &&
                  welcomeTokens2 &&
                  welcomeTokens2.length > 0 &&
                  welcomeTokens2.length < w2Full.length && (
                    <span style={{ opacity: cursorBlink ? 1 : 0 }}>█</span>
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scoped styles */}
      <style>{`
        .terminal-shake-light {
          animation: terminalShakeLight 0.3s ease-in-out;
        }
        .terminal-shake-heavy {
          animation: terminalShakeHeavy 0.4s ease-in-out;
        }
        .terminal-clip-expand {
          animation: clipExpand 0.8s ease-in-out forwards;
        }
        @keyframes clipExpand {
          from {
            clip-path: circle(80% at 50% 50%);
          }
          to {
            clip-path: circle(150% at 50% 50%);
          }
        }
      `}</style>
    </>
  );
}
