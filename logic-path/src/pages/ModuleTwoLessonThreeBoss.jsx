import "./LessonThreeBoss.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import dragonImg from "../assets/M1L3_ForestDragon.webp";
import emergencyGif from "../assets/Emergency.gif";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const difficultyMeta = {
  1: { label: "Easy", color: "#22c55e", bossHp: 5, playerHp: 5 },
  2: { label: "Medium", color: "#eab308", bossHp: 7, playerHp: 4 },
  3: { label: "Hard", color: "#ef4444", bossHp: 9, playerHp: 3 },
};

export default function ModuleThreeLessonThreeBoss() {
  const location = useLocation();
  const navigate = useNavigate();

  const difficulty =
    location.state?.difficulty ??
    Number(localStorage.getItem("difficulty")) ??
    1;

  const meta = difficultyMeta[difficulty];

  const [questions, setQuestions] = useState([]);
  const [queue, setQueue] = useState([]);
  const [qIndex, setQIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  const [bossHp, setBossHp] = useState(meta.bossHp);
  const [playerHp, setPlayerHp] = useState(meta.playerHp);

  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const [battleLog, setBattleLog] = useState("The Forest Dragon awakens...");
  const [dragonAnim, setDragonAnim] = useState("");
  const [playerAnim, setPlayerAnim] = useState("");

  const [phase, setPhase] = useState("battle");
  const [showIntro, setShowIntro] = useState(true);

  const question = queue[qIndex];

  // Intro animation
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // =========================
  // LOAD MODULE 3 LESSON 3
  // =========================
  useEffect(() => {
    async function loadLesson() {
      try {
        const res = await fetch("/api/quizzes/module_2/3");

        if (!res.ok) {
          throw new Error("Failed to fetch lesson");
        }

        const data = await res.json();

        const diffKey = String(difficulty);

        const rawQuestions =
          data?.questions?.[diffKey] ??
          data?.questions?.[Number(diffKey)] ??
          [];

        setQuestions(rawQuestions);
        setQueue(shuffle(rawQuestions));
        setQIndex(0);
      } catch (err) {
        console.error("Lesson load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [difficulty]);

  // =========================
  // LOADING
  // =========================
  if (loading || queue.length === 0 || !question) {
    return (
      <div className="boss-bg">
        <div className="battle-log">
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  const bossHpPct = (bossHp / meta.bossHp) * 100;
  const playerHpPct = (playerHp / meta.playerHp) * 100;

  const bossHpColor =
    bossHpPct > 55 ? "#22c55e" : bossHpPct > 25 ? "#eab308" : "#ef4444";

  const playerHpColor =
    playerHpPct > 55 ? "#22c55e" : playerHpPct > 25 ? "#eab308" : "#ef4444";

  const handleSelect = (i) => {
    if (!confirmed) setSelected(i);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);

    if (selected === question.answer) {
      const newBossHp = bossHp - 1;
      setBossHp(newBossHp);

      setBattleLog("Direct hit! The dragon recoils!");
      setDragonAnim("hit");
      setTimeout(() => setDragonAnim(""), 500);

      if (newBossHp <= 0) {
        setDragonAnim("dead");
        setTimeout(() => setPhase("victory"), 1400);
      }
    } else {
      const newPlayerHp = playerHp - 1;
      setPlayerHp(newPlayerHp);

      setBattleLog("Wrong! The dragon breathes fire!");
      setPlayerAnim("hurt");
      setTimeout(() => setPlayerAnim(""), 500);

      if (newPlayerHp <= 0) {
        setTimeout(() => setPhase("defeat"), 900);
      }
    }
  };

  const handleNext = () => {
    let nextIndex = qIndex + 1;
    let nextQueue = queue;

    if (nextIndex >= queue.length) {
      nextQueue = shuffle(questions);
      nextIndex = 0;
      setQueue(nextQueue);
    }

    setQIndex(nextIndex);
    setSelected(null);
    setConfirmed(false);
    setBattleLog("The dragon glares at you...");
  };

  const handleRetry = () => {
    setBossHp(meta.bossHp);
    setPlayerHp(meta.playerHp);
    setQueue(shuffle(questions));
    setQIndex(0);
    setSelected(null);
    setConfirmed(false);
    setBattleLog("The Forest Dragon awakens...");
    setDragonAnim("");
    setPlayerAnim("");
    setPhase("battle");
  };

// =========================
  // VICTORY
  // =========================
  if (phase === "victory") {
    return (
      <div className="boss-bg">
        <div className="boss-result-panel">
          <img
            src={dragonImg}
            alt="Defeated Dragon"
            className="result-dragon dead-dragon"
          />
          <h2 className="result-title victory">Victory!</h2>
          <p className="result-msg">
            You defeated the Forest Dragon and completed Lesson 3!
          </p>
          <button className="result-btn done" onClick={() => navigate("/module_two")}>
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DEFEAT
  // =========================
  if (phase === "defeat") {
    return (
      <div className="boss-bg">
        <div className="boss-result-panel">
          <img src={dragonImg} alt="Forest Dragon" className="result-dragon" />
          <h2 className="result-title defeat">Defeated!</h2>
          <p className="result-msg">
            The Forest Dragon was too powerful. Study the material and try again!
          </p>
          <div className="result-actions">
            <button className="result-btn retry" onClick={handleRetry}>
              Try Again
            </button>
            <button className="result-btn back" onClick={() => navigate("/module_two")}>
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }


  // =========================
  // MAIN
  // =========================
  return (
    <div className="boss-bg">
      {showIntro && (
        <div className="boss-intro-overlay">
          <img src={emergencyGif} alt="Emergency!" className="boss-intro-gif" />
        </div>
      )}

      <div className="boss-arena">

        <div className="boss-badge">
          <span>Boss Battle</span>
          <span className="boss-diff-tag" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>

        <div className="boss-section">
          <div className="boss-info">
            <span className="boss-name">Forest Dragon</span>
            <span className="boss-level">{meta.label} Boss</span>
          </div>

          <div className="hp-track">
            <div
              className="hp-fill"
              style={{ width: `${bossHpPct}%`, background: bossHpColor }}
            />
          </div>

          <span className="hp-label">
            {bossHp} / {meta.bossHp} HP
          </span>

          <div className="boss-sprite-wrap">
            <img
              src={dragonImg}
              alt="Forest Dragon"
              className={`boss-sprite ${dragonAnim}`}
            />
          </div>
        </div>

        <div className="player-hp-panel">
          <div className="player-hp-info">
            <span className="player-label">Your HP</span>
            <span className="player-hp-text">
              {playerHp} / {meta.playerHp}
            </span>
          </div>

          <div className={`player-hp-track ${playerAnim}`}>
            <div
              className="player-hp-fill"
              style={{ width: `${playerHpPct}%`, background: playerHpColor }}
            />
          </div>
        </div>

        <div className="battle-log">
          <p>{battleLog}</p>
        </div>

        <div className="battle-question-panel">
          <p className="battle-question">{question.question}</p>

          <div className="battle-options">
            {question.options.map((opt, i) => {
              let cls = "battle-option";

              if (confirmed) {
                if (i === question.answer) cls += " correct";
                else if (i === selected) cls += " wrong";
              } else if (i === selected) {
                cls += " chosen";
              }

              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => handleSelect(i)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="battle-actions">
            {!confirmed ? (
              <button
                className="battle-btn confirm"
                onClick={handleConfirm}
                disabled={selected === null}
              >
                Attack!
              </button>
            ) : (
              <button className="battle-btn next" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}