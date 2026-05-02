import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNotes, getAllTags } from "../utils/loadNotes";
import SpotlightCard from "../components/SpotlightCard";

export default function Notes() {
  const navigate = useNavigate();
  const allNotes = useMemo(() => getAllNotes(), []);
  const allTags = useMemo(() => getAllTags(), []);

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    return allNotes.filter((note) => {
      const matchesSearch =
        !search ||
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.summary.toLowerCase().includes(search.toLowerCase()) ||
        note.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesTag = !activeTag || note.tags.includes(activeTag);

      return matchesSearch && matchesTag;
    });
  }, [allNotes, search, activeTag]);

  return (
    <div className="page-enter">
      <div className="notes-header">
        <h1>笔记</h1>
        <input
          type="text"
          className="notes-search"
          placeholder="搜索笔记标题、内容或标签..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="notes-tags">
          <button
            className={`notes-tag ${activeTag === null ? "active" : ""}`}
            onClick={() => setActiveTag(null)}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`notes-tag ${activeTag === tag ? "active" : ""}`}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <p className="notes-empty">
          {search || activeTag ? "没有匹配的笔记，试试其他关键词" : "还没有笔记"}
        </p>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <SpotlightCard
              key={note.slug}
              onClick={() => navigate(`/notes/${note.slug}`)}
              style={{ cursor: "pointer", display: "block" }}
            >
              <p className="home-card-date">{note.date}</p>
              <h3 className="home-card-title">{note.title}</h3>
              <p className="home-card-summary">{note.summary}</p>
              <div style={{ marginTop: 12 }}>
                {note.tags.map((tag) => (
                  <span key={tag} className="home-card-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
}
