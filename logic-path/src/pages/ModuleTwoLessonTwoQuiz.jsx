import "./LessonTwoQuiz.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import slimeImg from "../assets/M1L1_Slime.webp";

const questionBank = {
  1: [
    {
      question: "What is an informal fallacy?",
      options: [
        "An error in reasoning based on structure",
        "An error in reasoning based on content or language",
        "A valid argument",
        "A sound argument",
      ],
      answer: 1,
    },
    {
      question: "Which fallacy attacks the person instead of the argument?",
      options: ["Straw Man", "False Dilemma", "Ad Hominem", "Appeal to Authority"],
      answer: 2,
    },
    {
      question: "Informal fallacies often appear persuasive.",
      options: ["True", "False"],
      answer: 0,
    },
  ],

  2: [
    {
      question: "Which of the following is an example of an ad hominem fallacy?",
      options: [
        "That argument is invalid because it has a false premise.",
        "You shouldn't believe him because he's not that smart.",
        "The conclusion does not follow from the premises.",
        "If you are not vegan, you are an immoral person.",
      ],
      answer: 1,
    },
    {
      question: "What does a straw man fallacy do?",
      options: [
        "Strengthens an argument",
        "Misrepresents an argument to make it easier to attack",
        "Uses correct reasoning",
        "Presents multiple valid options",
      ],
      answer: 1,
    },
    {
      question: "An appeal to authority assumes a claim is true because:",
      options: [
        "It is logically valid",
        "Everyone else believes it",
        "An authority figure supports it",
        "It is widely believed",
      ],
      answer: 2,
    },
    {
      question: "A false dilemma presents:",
      options: [
        "Many possible choices",
        "Only two options when more exist",
        "No options at all",
        "A contradiction",
      ],
      answer: 1,
    },
    {
      question: "Informal fallacies depend on only structure.",
      options: ["True", "False"],
      answer: 1,
    },
  ],

  3: [
    {
      question: "Which fallacy is committed here: 'Either you agree with me or you're wrong'?",
      options: [
        "Ad Hominem",
        "Straw Man",
        "False Dilemma",
        "Appeal to Authority",
      ],
      answer: 2,
    },
    {
      question: "Which fallacy is committed here: 'You can't trust her argument beecause she's failed before'?",
      options: [
        "Ad Hominem",
        "Straw Man",
        "False Dilemma",
        "Appeal to Authority",
      ],
      answer: 0,
    },
    {
      question: "Which fallacy is committed here: 'A celebrity says this is true, so it must be true'?",
      options: [
        "Ad Hominem",
        "Straw Man",
        "False Dilemma",
        "Appeal to Authority",
      ],
      answer: 3,
    },
    {
      question: "Which fallacy is committed here: 'You want better schools? So you just want to waste money.'?",
      options: [
        "Ad Hominem",
        "Straw Man",
        "False Dilemma",
        "Appeal to Authority",
      ],
      answer: 1,
    },
    {
      question: "Informal fallacies often appear persuasive.",
      options: ["True", "False"],
      answer: 0,
    },
    {
      question: "An appeal to authority assumes a claim is true because:",
      options: [
        "It is logically valid",
        "Everyone else believes it",
        "An authority figure supports it",
        "It is widely believed",
      ],
      answer: 2,
    },
    {
      question: "A false dilemma presents:",
      options: [
        "Many possible choices",
        "Only two options when more exist",
        "No options at all",
        "A contradiction",
      ],
      answer: 1,
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
export default function ModuleTwoLessonTwoQuiz() {
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
