import "./LessonOneQuiz.css";
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

export default function LessonOneQuiz() {
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

  const [hp, setHp] = useState(meta.maxHp);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [battleLog, setBattleLog] = useState("A wild Slime appears!");
  const [slimeAnim, setSlimeAnim] = useState("");
  const [won, setWon] = useState(false);

  const question = queue[qIndex];

  // =========================
  // LOAD LESSON FROM BACKEND
  // =========================
  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch("/api/quizzes/module_1/1");

        if (!res.ok) {
          throw new Error("Failed to fetch quiz");
        }

        const data = await res.json();

        const diffKey = String(difficulty);

        console.log("Quiz response:", data);
        console.log("Difficulty key:", diffKey);

        const rawQuestions =
          data?.questions?.[diffKey] ||
          data?.questions?.[Number(diffKey)] ||
          [];

        setQuestions(rawQuestions);
        setQueue(shuffle(rawQuestions));
        setQIndex(0);

      } catch (err) {
        console.error("Quiz load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [difficulty]);

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
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
  // GAME LOGIC (UNCHANGED)
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
            You defeated the Slime and completed the lesson!
          </p>
          <div className="victory-actions">
            <button
              className="results-btn done"
              onClick={() => navigate("/module_one")}
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN RENDER
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