import "./LessonOne.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const slides = [
  {
    title: "What is a Fallacy?",
    body: `Fallacies, broadly, are errors in reasoning.

Arguments may contain formal or informal fallacies. 

A fallacy occurs when an argument fails to properly support its conclusion, even if it appears convincing.`,
  },
  {
    title: "Importance of Fallacies",
    body: `Fallacies can make weak arguments seem strong.

They often appear in everyday conversations, debates, and media. Because of their rhetorical strength, they may be even used purposefully.

Learning to recognize fallacies helps you:
- Think more clearly
- Avoid being misled
- Evaluate arguments more effectively`,
  },
  {
    title: "Types of Fallacies",
    body: `There are two main types of fallacies:

Formal Fallacies: errors in the structure of an argument.

Informal Fallacies: errors in reasoning based on content, language, or context.

In this module, you will be introduced to both types`,
  },
];

export default function ModuleTwoLessonOne() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty ?? 1;

  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigate("/module_two/quiz", { state: { difficulty } });
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
