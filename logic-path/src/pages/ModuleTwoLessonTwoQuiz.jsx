import "./LessonTwoQuiz.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import slimeImg from "../assets/M1L1_Slime.webp";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const difficultyMeta = {
  1: { label: "Easy", color: "#22c55e", maxHp: 3 },
  2: { label: "Medium", color: "#eab308", maxHp: 5 },
  3: { label: "Hard", color: "#ef4444", maxHp: 7 },
};

function adjustDifficulty(current, hits, totalAttempts) {
  const accuracy = hits / totalAttempts;
  if (accuracy >= 0.8) return Math.min(current + 1, 3);
  if (accuracy < 0.5) return Math.max(current - 1, 1);
  return current;
}

export default function ModuleTwoLessonTwoQuiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const difficulty = location.state?.difficulty ?? 1;
  const meta = difficultyMeta[difficulty];

  const [questions, setQuestions] = useState([]);
  const [queue, setQueue] = useState([]);
  const [qIndex, setQIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  const [hp, setHp] = useState(meta.maxHp);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const [battleLog, setBattleLog] = useState("A wild Slime appears!");
  const [slimeAnim, setSlimeAnim] = useState("");

  const [won, setWon] = useState(false);

  const question = queue[qIndex];

  // =========================
  // LOAD MODULE 2 LESSON 2
  // =========================
  useEffect(() => {
    async function loadLesson() {
      try {
        const res = await fetch("/api/lessons/module_2/2");

        if (!res.ok) {
          throw new Error("Failed to fetch lesson");
        }

        const data = await res.json();

        const diffKey = String(difficulty);
        const rawQuestions = data.questions?.[diffKey] ?? [];

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

  if (loading || queue.length === 0 || !question) {
    return (
      <div className="quiz-bg">
        <div className="battle-log">
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  const hpPct = (hp / meta.maxHp) * 100;
  const hpColor =
    hpPct > 55 ? "#22c55e" : hpPct > 25 ? "#eab308" : "#ef4444";

  // =========================
  // GAME LOGIC
  // =========================
  const handleSelect = (i) => {
    if (confirmed) return;
    setSelected(i);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);

    if (selected === question.answer) {
      const newHp = hp - 1;
      setHp(newHp);

      setBattleLog("It's super effective!");

      if (newHp <= 0) {
        setSlimeAnim("dead");
        setTimeout(() => setWon(true), 1200);
      } else {
        setSlimeAnim("hit");
        setTimeout(() => setSlimeAnim(""), 500);
      }
    } else {
      setBattleLog("The slime resists! Try again.");
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
    setBattleLog("The slime waits...");
  };

  // =========================
  // WIN SCREEN
  // =========================
  if (won) {
    return (
      <div className="quiz-bg">
        <div className="victory-panel">
          <img src={slimeImg} alt="Defeated Slime" className="victory-slime" />
          <h2 className="victory-title">Victory!</h2>
          <p className="victory-msg">
            You defeated the Slime and mastered Informal Fallacies!
          </p>
          <div className="victory-actions">
            <button
              className="results-btn done"
              onClick={() => navigate("/module_two")}
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="quiz-bg">
      <div className="battle-arena">

        {/* Enemy */}
        <div className="enemy-section">
          <div className="enemy-info">
            <span className="enemy-name">Slime</span>
            <span className="enemy-level">{meta.label}</span>
          </div>

          <div className="hp-track">
            <div
              className="hp-fill"
              style={{ width: `${hpPct}%`, background: hpColor }}
            />
          </div>

          <span className="hp-label">
            {hp} / {meta.maxHp} HP
          </span>

          <div className="enemy-sprite-wrap">
            <img
              src={slimeImg}
              alt="Slime"
              className={`enemy-sprite ${slimeAnim}`}
            />
          </div>
        </div>

        {/* Log */}
        <div className="battle-log">
          <p>{battleLog}</p>
        </div>

        {/* Question */}
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
                {hp <= 0 ? "Finish" : "Next"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}