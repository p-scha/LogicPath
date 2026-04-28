import "./LessonOne.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const slides = [
  {
    title: "What are Informal Fallacies?",
    body: `Informal fallacies are errors in reasoning that depend on the content, language, or context of an argument.

Unlike formal fallacies, they are not just mistakes in logical structure.

Because they often appear persuasive in ordinary language, informal fallacies can be harder to detect.`,
  },
  {
    title: "Ad Hominem",
    body: `An ad hominem fallacy attacks the person making the argument instead of the argument itself.

(Ad hominem means "to the person" in Latin).

Example:
"Don't listen to her opinion on logic, she failed her last exam."

Whether she failed an exam has nothing to do with whether her argument is correct.`,
  },
  {
    title: "Straw Man",
    body: `A straw man fallacy misrepresents someone's argument, making it easier to attack.

A straw man argument may appear deceptively similar to the actual argument.

On the other hand, a steel man argument represents someone's argument in its strongest form.

Example:
Person A: "...Thus, we should spend more money on education."
Person B: "My opponent wants to waste money on schools."

Person B has distorted the original claim instead of responding to it fairly.`,
  },
  {
    title: "Appeal to Authority",
    body: `An appeal to authority happens when someone claims an argument is true simply because an authority figure says it is.

Example:
"This must be true because a famous actor said so."

Authorities can sometimes be credible sources, but authority alone does not guarantee that a claim is correct.`,
  },
  {
    title: "False Dilemma",
    body: `A false dilemma presents only two options when more possibilities actually exist.

Example:
"Either you support this policy, or you don't care about safety."

This ignores the possibility that someone may care about safety while disagreeing with the policy.`,
  },
];

export default function ModuleTwoLessonTwo() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty ?? 1;

  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/module_two/quiz2", { state: { difficulty } });
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
