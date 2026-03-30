import "./LessonTwoQuiz.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import slimeImg from "../assets/M1L1_Slime.webp";

const questionBank = {
  1: [
    {
      question: "What is logic?",
      options: ["The study of mathematics", "The study of arguments", "The study of language", "The study of science"],
      answer: 1,
    },
    {
      question: "Which of the following is a statement?",
      options: ["Close the door!", "Is it raining?", "Snow is white.", "Run!"],
      answer: 2,
    },
    {
      question: "What is the conclusion of an argument?",
      options: ["A question", "A command", "Any premise", "The statement intended to be established as true"],
      answer: 3,
    },
  ],
  2: [
    {
      question: "Which sentence is truth-apt?",
      options: ["Please sit down.", "What time is it?", "The Earth orbits the Sun.", "Don't do that!"],
      answer: 2,
    },
    {
      question: "Which of the following is an example of a premise?",
      options: ["Therefore, it will rain.", "The sky is cloudy, so it will rain.", "The sky is cloudy.", "Will it rain?"],
      answer: 2,
    },
    {
      question: "Argument regimentation involves:",
      options: [
        "Making arguments longer",
        "Translating arguments into formal or premise/conclusion form",
        "Memorizing arguments",
        "Ignoring natural language",
      ],
      answer: 1,
    },
  ],
  3: [
    {
      question: "Which best distinguishes a premise from a conclusion?",
      options: [
        "Premises are always true, conclusions are always false",
        "Premises provide support; conclusions are what is supported",
        "Premises come after conclusions",
        "There is no distinction",
      ],
      answer: 1,
    },
    {
      question: "An argument in natural language can be regimented by:",
      options: [
        "Translating into premise/conclusion form only",
        "Translating into a formal language only",
        "Both translating into premise/conclusion form and into a formal language",
        "Neither of the above",
      ],
      answer: 2,
    },
    {
      question: "Which of the following is NOT a characteristic of a statement?",
      options: ["It is declarative", "It can be true or false", "It commands an action", "It is truth-apt"],
      answer: 2,
    },
  ],
};

const difficultyMeta = {
  1: { label: "Easy",   color: "#22c55e", maxHp: 3 },
  2: { label: "Medium", color: "#eab308", maxHp: 5 },
  3: { label: "Hard",   color: "#ef4444", maxHp: 7 },
};

function adjustDifficulty(current, hits, totalAttempts) {
  const accuracy = hits / totalAttempts;
  if (accuracy >= 0.8) return Math.min(current + 1, 3);
  if (accuracy < 0.5)  return Math.max(current - 1, 1);
  return current;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Single Battle Component ───────────────────────────────────────────────
function Battle({ difficulty, battleNum, onComplete }) {
  const meta = difficultyMeta[difficulty];
  const baseQuestions = questionBank[difficulty];

  const [queue, setQueue]     = useState(() => shuffle(baseQuestions));
  const [qIndex, setQIndex]   = useState(0);
  const [hp, setHp]           = useState(meta.maxHp);
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [battleLog, setBattleLog] = useState(`Battle ${battleNum} begins!`);
  const [slimeAnim, setSlimeAnim] = useState("");

  // track accuracy
  const [hits, setHits]               = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const question = queue[qIndex];
  const hpPct   = (hp / meta.maxHp) * 100;
  const hpColor = hpPct > 55 ? "#22c55e" : hpPct > 25 ? "#eab308" : "#ef4444";

  const handleSelect = (i) => { if (!confirmed) setSelected(i); };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    const newTotal = totalAttempts + 1;
    setTotalAttempts(newTotal);

    if (selected === question.answer) {
      const newHp   = hp - 1;
      const newHits = hits + 1;
      setHp(newHp);
      setHits(newHits);
      setBattleLog("It's super effective!");

      if (newHp <= 0) {
        setSlimeAnim("dead");
        setTimeout(() => onComplete(newHits, newTotal), 1200);
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
      nextQueue = shuffle(baseQuestions);
      nextIndex = 0;
      setQueue(nextQueue);
    }
    setQIndex(nextIndex);
    setSelected(null);
    setConfirmed(false);
    setBattleLog("The slime waits...");
  };

  return (
    <div className="battle-arena">
      {/* Battle number badge */}
      <div className="battle-badge">
        <span>Battle {battleNum}</span>
        <span className="battle-diff-tag" style={{ color: meta.color }}>{meta.label}</span>
      </div>

      {/* Enemy */}
      <div className="enemy-section">
        <div className="enemy-info">
          <span className="enemy-name">Slime</span>
          <span className="enemy-level">{meta.label}</span>
        </div>
        <div className="hp-track">
          <div className="hp-fill" style={{ width: `${hpPct}%`, background: hpColor }} />
        </div>
        <span className="hp-label">{hp} / {meta.maxHp} HP</span>
        <div className="enemy-sprite-wrap">
          <img src={slimeImg} alt="Slime" className={`enemy-sprite ${slimeAnim}`} />
        </div>
      </div>

      {/* Battle log */}
      <div className="battle-log"><p>{battleLog}</p></div>

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
              <button key={i} className={cls} onClick={() => handleSelect(i)}>
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        <div className="battle-actions">
          {!confirmed ? (
            <button className="battle-btn confirm" onClick={handleConfirm} disabled={selected === null}>
              Attack!
            </button>
          ) : (
            <button className="battle-btn next" onClick={handleNext}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Transition Screen ──────────────────────────────────────────────────────
function Transition({ oldDifficulty, newDifficulty, accuracy, onContinue }) {
  const oldMeta = difficultyMeta[oldDifficulty];
  const newMeta = difficultyMeta[newDifficulty];
  const changed = oldDifficulty !== newDifficulty;
  const increased = newDifficulty > oldDifficulty;

  return (
    <div className="transition-panel">
      <h2 className="transition-title">Battle 1 Complete!</h2>
      <p className="transition-accuracy">
        Accuracy: <strong>{Math.round(accuracy * 100)}%</strong>
      </p>

      <div className="transition-diff-row">
        <div className="diff-pill" style={{ borderColor: oldMeta.color, color: oldMeta.color }}>
          {oldMeta.label}
        </div>
        <span className="diff-arrow">
          {changed ? (increased ? "▲" : "▼") : "—"}
        </span>
        <div className="diff-pill" style={{ borderColor: newMeta.color, color: newMeta.color }}>
          {newMeta.label}
        </div>
      </div>

      <p className="transition-msg">
        {!changed
          ? "Difficulty unchanged. Keep it up!"
          : increased
          ? "Great work! Difficulty increased for Battle 2."
          : "Difficulty decreased for Battle 2. You've got this!"}
      </p>

      <button className="battle-btn confirm" style={{ width: "100%", marginTop: "1rem" }} onClick={onContinue}>
        Start Battle 2
      </button>
    </div>
  );
}

// ─── Main Orchestrator ──────────────────────────────────────────────────────
export default function LessonTwoQuiz() {
  const location = useLocation();
  const navigate  = useNavigate();
  const startDifficulty = location.state?.difficulty ?? 1;

  // phase: "battle1" | "transition" | "battle2" | "victory"
  const [phase, setPhase]             = useState("battle1");
  const [difficulty1, setDifficulty1] = useState(startDifficulty);
  const [difficulty2, setDifficulty2] = useState(startDifficulty);
  const [accuracy1, setAccuracy1]     = useState(0);

  const handleBattle1Complete = (hits, total) => {
    const acc  = hits / total;
    const newD = adjustDifficulty(difficulty1, hits, total);
    setAccuracy1(acc);
    setDifficulty2(newD);
    setPhase("transition");
  };

  const handleBattle2Complete = () => {
    setPhase("victory");
  };

  return (
    <div className="quiz-bg">
      {phase === "battle1" && (
        <Battle difficulty={difficulty1} battleNum={1} onComplete={handleBattle1Complete} />
      )}

      {phase === "transition" && (
        <Transition
          oldDifficulty={difficulty1}
          newDifficulty={difficulty2}
          accuracy={accuracy1}
          onContinue={() => setPhase("battle2")}
        />
      )}

      {phase === "battle2" && (
        <Battle difficulty={difficulty2} battleNum={2} onComplete={handleBattle2Complete} />
      )}

      {phase === "victory" && (
        <div className="victory-panel">
          <img src={slimeImg} alt="Defeated Slime" className="victory-slime" />
          <h2 className="victory-title">Victory!</h2>
          <p className="victory-msg">You defeated both Slimes and completed Lesson 2!</p>
          <button className="results-btn done" onClick={() => navigate("/module_one")}>
            Back to Lessons
          </button>
        </div>
      )}
    </div>
  );
}
