import { useState } from "react";
import "./SocialBar.css";

const mockFriends = [
  { id: 1, name: "Chrono",  online: true,  lesson: "M1 · Lesson 2",  xp: 340, level: 4 },
  { id: 2, name: "Ninten",   online: true,  lesson: "M1 · Quiz 1",    xp: 210, level: 3 },
  { id: 3, name: "Ness",  online: false, lesson: "M1 · Lesson 1",  xp:  90, level: 1 },
  { id: 4, name: "Lucas",  online: false, lesson: "M1 · Boss",      xp: 580, level: 6 },
];

// XP required to reach the next level (each level needs level * 100 XP)
function xpProgress(xp, level) {
  const required = level * 100;
  const earned = xp % required;
  return Math.round((earned / required) * 100);
}

// Give each friend a consistent accent color based on their name
const AVATAR_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function SocialBar() {
  const [openPanel, setOpenPanel] = useState(null); // 'friends' | null

  const toggle = (panel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  return (
    <>
      {/* ── Friends Panel ── */}
      {openPanel === "friends" && (
        <div className="social-panel">
          <div className="panel-header">
            <span className="panel-title">Friends</span>
            <button className="panel-close" onClick={() => setOpenPanel(null)}>
              ✕
            </button>
          </div>

          <ul className="friend-list">
            {mockFriends.map((f) => {
              const color = avatarColor(f.name);
              const progress = xpProgress(f.xp, f.level);
              return (
                <li key={f.id} className="friend-item">
                  {/* Avatar */}
                  <div
                    className="friend-avatar"
                    style={{ background: `${color}28`, borderColor: `${color}66`, color }}
                  >
                    {f.name[0]}
                    <span className={`online-dot ${f.online ? "online" : "offline"}`} />
                  </div>

                  {/* Name + Lesson */}
                  <div className="friend-info">
                    <span className="friend-name">{f.name}</span>
                    <span className="friend-lesson">{f.lesson}</span>
                  </div>

                  {/* Level + XP bar */}
                  <div className="friend-xp">
                    <span className="friend-level" style={{ color }}>
                      Lv.{f.level}
                    </span>
                    <div className="xp-bar">
                      <div
                        className="xp-fill"
                        style={{ width: `${progress}%`, background: color }}
                      />
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
            <button className="social-btn locked" title="Coming soon">
              Achievements
            </button>
          </li>
          <li>
            <button className="social-btn locked" title="Coming soon">
              Guild
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}