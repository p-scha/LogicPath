import { useState } from "react";
import "./SocialBar.css";

// ── Friends Data ──────────────────────────────────────────────
const mockFriends = [
  { id: 1, name: "Chrono", online: true,  lesson: "M1 · Lesson 2", xp: 340, level: 4 },
  { id: 2, name: "Ninten", online: true,  lesson: "M1 · Quiz 1",   xp: 210, level: 3 },
  { id: 3, name: "Ness",   online: false, lesson: "M1 · Lesson 1", xp:  90, level: 1 },
  { id: 4, name: "Lucas",  online: false, lesson: "M1 · Boss",     xp: 580, level: 6 },
];

function xpProgress(xp, level) {
  const required = level * 100;
  return Math.round(((xp % required) / required) * 100);
}

const AVATAR_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── Achievements ──────────────────────────────────────────────
const achievements = [
  { id: 1, title: "First Step",       desc: "Complete your first lesson.",         icon: "⚔️",  earned: true  },
  { id: 2, title: "Quiz Crusher",     desc: "Score 100% on any quiz.",             icon: "💎",  earned: true  },
  { id: 3, title: "Boss Slayer",      desc: "Defeat your first boss.",             icon: "🐉",  earned: true  },
  { id: 4, title: "Logic Lord",       desc: "Complete all Module 1 lessons.",      icon: "🧠",  earned: false },
  { id: 5, title: "Speed Runner",     desc: "Finish a lesson in under 3 minutes.", icon: "⚡",  earned: false },
  { id: 6, title: "Social Butterfly", desc: "Add 3 friends.",                      icon: "🦋",  earned: false },
];

// ── Guild Data ────────────────────────────────────────────────
const initialGuild = {
  name: "Logic Vanguard",
  crest: "🛡️",
  members: [
    { id: 1, name: "Chrono", role: "Leader", lesson: "M1 · Lesson 2", progress: 60 },
    { id: 2, name: "Ninten", role: "Member", lesson: "M1 · Quiz 1",   progress: 40 },
    { id: 3, name: "Ness",   role: "Member", lesson: "M1 · Lesson 1", progress: 15 },
  ],
};

export default function SocialBar() {
  const [openPanel, setOpenPanel] = useState(null);
  const [guild, setGuild] = useState(initialGuild);
  const [guildView, setGuildView] = useState("members"); // 'members' | 'add'

  const toggle = (panel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  const memberIds = new Set(guild.members.map((m) => m.id));
  const candidates = mockFriends.filter((f) => !memberIds.has(f.id));

  const addToGuild = (friend) => {
    setGuild((g) => ({
      ...g,
      members: [
        ...g.members,
        {
          id: friend.id,
          name: friend.name,
          role: "Member",
          lesson: friend.lesson,
          progress: Math.min(100, Math.round((friend.xp / (friend.level * 100)) * 100)),
        },
      ],
    }));
  };

  return (
    <>
      {/* ── Friends ── */}
      {openPanel === "friends" && (
        <div className="social-panel">
          <div className="panel-header">
            <span className="panel-title">Friends</span>
            <button className="panel-close" onClick={() => setOpenPanel(null)}>✕</button>
          </div>

          <ul className="friend-list">
            {mockFriends.map((f) => {
              const color = avatarColor(f.name);
              const progress = xpProgress(f.xp, f.level);
              return (
                <li key={f.id} className="friend-item">
                  <div className="friend-avatar" style={{ background: `${color}28`, borderColor: `${color}66`, color }}>
                    {f.name[0]}
                    <span className={`online-dot ${f.online ? "online" : "offline"}`} />
                  </div>
                  <div className="friend-info">
                    <span className="friend-name">{f.name}</span>
                    <span className="friend-lesson">{f.lesson}</span>
                  </div>
                  <div className="friend-xp">
                    <span className="friend-level" style={{ color }}>Lv.{f.level}</span>
                    <div className="xp-bar">
                      <div className="xp-fill" style={{ width: `${progress}%`, background: color }} />
                    </div>
                    <span className="friend-xp-label">{f.xp} XP</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="panel-footer">
            <button className="add-friend-btn">+ Add Friend</button>
          </div>
        </div>
      )}

      {/* ── Achievements ── */}
      {openPanel === "achievements" && (
        <div className="social-panel">
          <div className="panel-header">
            <span className="panel-title">Achievements</span>
            <button className="panel-close" onClick={() => setOpenPanel(null)}>✕</button>
          </div>

          <div className="achievement-summary">
            <span className="achievement-count">
              {achievements.filter((a) => a.earned).length}
              <span className="achievement-total"> / {achievements.length}</span>
            </span>
            <div className="achievement-progress-bar">
              <div className="achievement-progress-fill"
                style={{ width: `${(achievements.filter((a) => a.earned).length / achievements.length) * 100}%` }} />
            </div>
          </div>

          <ul className="achievement-list">
            {achievements.map((a) => (
              <li key={a.id} className={`achievement-item ${a.earned ? "earned" : "locked"}`}>
                <span className="achievement-icon">{a.earned ? a.icon : "🔒"}</span>
                <div className="achievement-info">
                  <span className="achievement-title">{a.title}</span>
                  <span className="achievement-desc">{a.earned ? a.desc : "???"}</span>
                </div>
                {a.earned && <span className="achievement-badge">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Guild ── */}
      {openPanel === "guild" && (
        <div className="social-panel">
          <div className="panel-header">
            <span className="panel-title">Guild</span>
            <button className="panel-close" onClick={() => setOpenPanel(null)}>✕</button>
          </div>

          {/* Guild crest + name */}
          <div className="guild-header">
            <div className="guild-crest">{guild.crest}</div>
            <div className="guild-meta">
              <span className="guild-name">{guild.name}</span>
              <span className="guild-stats">{guild.members.length} member{guild.members.length === 1 ? "" : "s"}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="guild-tabs">
            <button
              className={`guild-tab ${guildView === "members" ? "active" : ""}`}
              onClick={() => setGuildView("members")}
            >
              Members
            </button>
            <button
              className={`guild-tab ${guildView === "add" ? "active" : ""}`}
              onClick={() => setGuildView("add")}
            >
              Add
            </button>
          </div>

          {/* Members */}
          {guildView === "members" && (
            <ul className="guild-list">
              {guild.members.map((m) => {
                const color = avatarColor(m.name);
                return (
                  <li key={m.id} className="guild-item">
                    <div className="friend-avatar" style={{ background: `${color}28`, borderColor: `${color}66`, color }}>
                      {m.name[0]}
                    </div>
                    <div className="friend-info">
                      <span className="friend-name">{m.name}</span>
                      <span className={`guild-role ${m.role === "Leader" ? "leader" : ""}`}>
                        {m.role} · <span style={{ color: "rgba(255,255,255,0.38)", textTransform: "none", letterSpacing: "0" }}>{m.lesson}</span>
                      </span>
                    </div>
                    <div className="guild-progress">
                      <span className="guild-progress-label">{m.progress}%</span>
                      <div className="guild-progress-bar">
                        <div className="guild-progress-fill" style={{ width: `${m.progress}%` }} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Add */}
          {guildView === "add" && (
            <ul className="guild-add-list">
              {candidates.length === 0 ? (
                <li className="guild-add-item" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>
                  All your friends are already in the guild.
                </li>
              ) : (
                candidates.map((f) => {
                  const color = avatarColor(f.name);
                  return (
                    <li key={f.id} className="guild-add-item">
                      <div className="friend-avatar" style={{ background: `${color}28`, borderColor: `${color}66`, color }}>
                        {f.name[0]}
                      </div>
                      <span className="guild-add-name">{f.name}</span>
                      <button className="guild-add-btn" onClick={() => addToGuild(f)}>+ Add</button>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
      )}

      {/* ── Right Social Navbar ── */}
      <nav className="social-nav">
        <ul>
          <li>
            <button
              className={`social-btn ${openPanel === "friends" ? "active" : ""}`}
              onClick={() => toggle("friends")}
            >
              Friends
            </button>
          </li>
          <li>
            <button
              className={`social-btn ${openPanel === "achievements" ? "active" : ""}`}
              onClick={() => toggle("achievements")}
            >
              Achievements
            </button>
          </li>
          <li>
            <button
              className={`social-btn ${openPanel === "guild" ? "active" : ""}`}
              onClick={() => toggle("guild")}
            >
              Guild
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
