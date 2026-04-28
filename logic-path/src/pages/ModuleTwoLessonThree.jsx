import "./LessonOne.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const slides = [
  {
    title: "What are Formal Fallacies?",
    body: `Formal fallacies are errors in the structure of an argument.

Unlike informal fallacies, they do not depend on content or wording. They depend entirely on logical form.

Any formal fallacy can be generally referred to as a 'non-sequitur'`,
  },
  {
    title: "Form vs Content",
    body: `In formal logic, we only care about the structure of an argument, not what it is about (its content).

Example (Modus Ponens):
  P1. If P, then Q.
  P2. P.
  C.  Therefore, Q.

This is a valid argument because it's structured such that the conclusion must be true given the premises are true.

All invalid arguments are formally fallacious.`,
  },
  {
    title: "Affirming the Consequent",
    body: `This fallacy has the form:

  If P, then Q.
  Q.
  Therefore, P.

Example:
  If it is raining, the ground is wet.
  The ground is wet.
  Therefore, it is raining.

This is invalid because there could be other reasons the ground is wet.

*In a conditional (If P, then Q), the first proposition is the 'antecedent' while the second proposition is the 'consequent'.`,
  },
  {
    title: "Denying the Antecedent",
    body: `This fallacy has the form:

  If P, then Q.
  Not P.
  Therefore, not Q.

Example:
  If it is raining, the ground is wet.
  It is not raining.
  Therefore, the ground is not wet.

This is invalid because the ground could be wet for other reasons.`,
  },
];

export default function ModuleTwoLessonThree() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty ?? 1;

  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/module_two/boss3", { state: { difficulty } });
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
