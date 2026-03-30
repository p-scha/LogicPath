import "./LessonOneQuiz.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LessonOneQuiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty ?? 1;

  const meta = difficultyMeta[difficulty];
  const baseQuestions = questionBank[difficulty];

  const [queue, setQueue] = useState(() => shuffle(baseQuestions));
  const [qIndex, setQIndex] = useState(0);

  const [hp, setHp] = useState(meta.maxHp);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [battleLog, setBattleLog] = useState("A wild Slime appears!");
  const [slimeAnim, setSlimeAnim] = useState(""); // "hit" | "dead" | ""
  const [won, setWon] = useState(false);

  const question = queue[qIndex];
  const hpPct = (hp / meta.maxHp) * 100;
  const hpColor = hpPct > 55 ? "#22c55e" : hpPct > 25 ? "#eab308" : "#ef4444";

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
    // Advance queue; refill + reshuffle when exhausted
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

  if (won) {
    return (
      <div className="quiz-bg">
        <div className="victory-panel">
          <img src={slimeImg} alt="Defeated Slime" className="victory-slime" />
          <h2 className="victory-title">Victory!</h2>
          <p className="victory-msg">You defeated the Slime and mastered Lesson 1!</p>
          <div className="victory-actions">
            <button className="results-btn done" onClick={() => navigate("/module_one")}>
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-bg">
      <div className="battle-arena">

        {/* Enemy section */}
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
            <img
              src={slimeImg}
              alt="Slime"
              className={`enemy-sprite ${slimeAnim}`}
            />
          </div>
        </div>

        {/* Battle log */}
        <div className="battle-log">
          <p>{battleLog}</p>
        </div>

        {/* Question & options */}
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
