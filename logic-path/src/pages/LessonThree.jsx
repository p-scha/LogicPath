import "./LessonOne.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const slides = [
  {
    title: "Logical Form",
    body: `Every argument has a logical form — an abstract structure that can be separated from its content.

Two arguments share the same logical form if one can be obtained from the other by substituting different words for the same terms.

Example:
  All A are B. All B are C. Therefore, all A are C.

This form is valid regardless of what A, B, and C stand for.`,
  },
  {
    title: "Symbolic Notation",
    body: `Formal logic uses symbols to represent logical relationships clearly and precisely.

Common symbols:
  ¬P   — "not P" (negation)
  P ∧ Q — "P and Q" (conjunction)
  P ∨ Q — "P or Q" (disjunction)
  P → Q — "if P then Q" (conditional)
  P ↔ Q — "P if and only if Q" (biconditional)

Using symbols removes ambiguity that natural language introduces.`,
  },
  {
    title: "Validity and Form",
    body: `An argument is valid if its logical form guarantees that a true conclusion follows from true premises — regardless of the actual content.

A classic valid form (Modus Ponens):
  P1. P → Q
  P2. P
  C.  ∴ Q

An argument can be valid but have false premises. Validity is about structure, not truth.`,
  },
];

export default function LessonThree() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty ?? 1;

  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/module_one/boss3", { state: { difficulty } });
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
            {isLast ? "Boss Battle!" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
