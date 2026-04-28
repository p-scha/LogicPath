import { useState } from "react";
import "./Arena.css";
import arenaBg from "../assets/arena.png";

const challenges = [
  {
    id: 1,
    title: "The Argument Gauntlet",
    week: "Week 1",
    difficulty: 2,
    unlocked: true,
    description:
      "You're given five messy real-world arguments. Your task: identify the premises, isolate the conclusion, and decide whether each argument is valid. The clock is ticking — the arena crowd demands precision.",
    reward: "150 XP + Gauntlet Badge",
  },
  {
    id: 2,
    title: "Fallacy Hunt",
    week: "Week 2",
    difficulty: 3,
    unlocked: false,
    description: "Locked",
    reward: "200 XP",
  },
  {
    id: 3,
    title: "Symbolic Siege",
    week: "Week 3",
    difficulty: 4,
    unlocked: false,
    description: "Locked",
    reward: "250 XP",
  },
  {
    id: 4,
    title: "The Paradox Pit",
    week: "Week 4",
    difficulty: 5,
    unlocked: false,
    description: "Locked",
    reward: "300 XP",
  },
];

function Stars({ count, max = 5 }) {
  return (
    <span className="stars">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`star ${i < count ? "filled" : "empty"}`}>★</span>
      ))}
    </span>
  );
}

export default function Arena() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="arena-bg" style={{ backgroundImage: `url(${arenaBg})` }}>
      <div className="arena-container">

        {/* ── Left: Challenge List ── */}
        <div className="arena-list">
          <h2 className="arena-title">Arena</h2>
          <p className="arena-subtitle">Weekly Challenges</p>

          <ul>
            {challenges.map((c) => (
              <li
                key={c.id}
                className={`arena-item ${!c.unlocked ? "arena-item--locked" : ""} ${selected?.id === c.id ? "arena-item--active" : ""}`}
                onClick={() => c.unlocked && setSelected(c)}
              >
                <div className="arena-item-left">
                  <span className="arena-item-week">{c.week}</span>
                  <span className="arena-item-title">{c.title}</span>
                </div>
                <div className="arena-item-right">
                  {c.unlocked ? (
                    <Stars count={c.difficulty} />
                  ) : (
                    <span className="arena-lock">🔒</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: Detail Panel ── */}
        <div className="arena-detail">
          {selected ? (
            <>
              <div className="arena-detail-header">
                <span className="arena-detail-week">{selected.week}</span>
                <h3 className="arena-detail-title">{selected.title}</h3>
                <div className="arena-detail-difficulty">
                  <span className="arena-detail-difficulty-label">Difficulty</span>
                  <Stars count={selected.difficulty} />
                </div>
              </div>

              <p className="arena-detail-desc">{selected.description}</p>

              <div className="arena-reward">
                <span className="arena-reward-label">Reward</span>
                <span className="arena-reward-value">{selected.reward}</span>
              </div>

              <button className="arena-start-btn">Enter Arena</button>
            </>
          ) : (
            <div className="arena-placeholder">
              <span className="arena-placeholder-icon">⚔️</span>
              <p>Select a challenge to begin.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}