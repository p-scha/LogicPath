import "./LessonOne.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const slides = [
  {
    title: "What is Logic?",
    body: `Logic is the study of arguments.

An argument is a sequence of statements made up of premises and a conclusion.

Statements are declarative sentences that are truth-apt — meaning they can be either true or false. Commands, questions, and exclamations are not statements.`,
  },
  {
    title: "Arguments & Statements",
    body: `Every argument has two key parts:

Premises — statements intended to establish or justify a conclusion.

Conclusion — the statement the premises are meant to support or prove true.

Example:
  P1. All humans are mortal.
  P2. Socrates is a human.
  C.  Therefore, Socrates is mortal.`,
  },
  {
    title: "Argument Regimentation",
    body: `Many arguments we encounter are written in natural language — everyday speech like English or Spanish.

Regimentation is the process of clarifying and restructuring these arguments so their logical form is clear. This can be done in two ways:

1) Translating the argument into explicit premise / conclusion form.
2) Translating the argument into a formal symbolic language.

Both methods help us evaluate whether an argument is valid.`,
  },
];

export default function LessonOne() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty =
    location.state?.difficulty ??
    Number(localStorage.getItem("difficulty")) ??
    1;

  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/module_one/quiz", { state: { difficulty } });
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="lesson-one-bg">
      <div className="lesson-one-panel">
        <div className="slide-progress">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`progress-dot ${i === index ? "active" : i < index ? "done" : ""}`}
            />
          ))}
        </div>

        <h2 className="slide-title">{slides[index].title}</h2>
        <p className="slide-body">{slides[index].body}</p>

        <div className="slide-actions">
          {index > 0 && (
            <button className="slide-btn back" onClick={() => setIndex((i) => i - 1)}>
              Back
            </button>
          )}
          <button className={`slide-btn ${isLast ? "quiz" : "next"}`} onClick={handleNext}>
            {isLast ? "Battle!" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
