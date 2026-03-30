import "./LessonOne.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const slides = [
  {
    title: "Argument Regimentation",
    body: `Many of the arguments we encounter are expressed in natural language — the everyday speech we use in conversation, writing, and media.

Natural language is often ambiguous, vague, or informal. Regimentation is the process of making the logical structure of an argument explicit and clear.`,
  },
  {
    title: "Premise / Conclusion Form",
    body: `The most common way to regiment an argument is to rewrite it in premise / conclusion form.

Each premise is listed separately and numbered. The conclusion is stated clearly at the end, often introduced by the word "therefore."

Example:
  P1. If it rains, the ground gets wet.
  P2. It is raining.
  C.  Therefore, the ground is wet.`,
  },
  {
    title: "Formal Languages",
    body: `A second method of regimentation is translating the argument into a formal language, such as propositional or predicate logic.

Formal languages use symbols to eliminate ambiguity entirely. For example:
  P → Q
  P
  ∴ Q

This makes it possible to evaluate validity using strict logical rules.`,
  },
];

export default function LessonTwo() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty ?? 1;

  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/module_one/quiz2", { state: { difficulty } });
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
