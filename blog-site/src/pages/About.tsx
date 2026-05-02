const timeline = [
  {
    year: "2025",
    title: "硕士研究生 · 计算机科学与技术",
    desc: "某 985 高校，研究方向为前端工程化与 Web 性能优化。",
  },
  {
    year: "2021",
    title: "本科 · 软件工程",
    desc: "系统学习了数据结构、算法、操作系统、计算机网络等计算机基础课程，大三开始专注前端方向。",
  },
  {
    year: "2023",
    title: "前端实习 · 某互联网公司",
    desc: "参与内部组件库建设，负责 10+ 个业务组件的开发与维护，使用 React + TypeScript 技术栈。",
  },
  {
    year: "2020",
    title: "第一个开源项目",
    desc: "在 GitHub 上发布了第一个开源工具，使用 Vue 开发了一个 Markdown 预览器，获得了 200+ stars。",
  },
];

const techStack = [
  { name: "React", color: "#339af0" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "Vite", color: "#bd34fe" },
  { name: "Node.js", color: "#51cf66" },
  { name: "Tailwind CSS", color: "#38bdf8" },
  { name: "Next.js", color: "#ffffff" },
  { name: "Git", color: "#f05032" },
  { name: "Docker", color: "#2496ed" },
  { name: "MySQL", color: "#ffa500" },
  { name: "Python", color: "#fcee0a" },
  { name: "Figma", color: "#ff6b6b" },
  { name: "VS Code", color: "#33a6f0" },
];

export default function About() {
  return (
    <div className="page-enter">
      {/* Header */}
      <div className="about-header">
        <h1>关于我</h1>
        <p>
          一个热爱技术、喜欢探索的前端开发者。
          闲暇时写写笔记、鼓捣开源项目，这里是我的数字花园。
        </p>
      </div>

      {/* Timeline */}
      <section style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: 24 }}>教育 & 经历</h2>
        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className="timeline-item">
              <p className="timeline-year">{item.year}</p>
              <h3 className="timeline-title">{item.title}</h3>
              <p className="timeline-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tag-cloud-section">
        <h2>技术栈</h2>
        <div className="tag-cloud">
          {techStack.map((tech) => (
            <span
              key={tech.name}
              className="tag-cloud-item"
              style={{
                color: tech.color,
                background: `${tech.color}15`,
              }}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
