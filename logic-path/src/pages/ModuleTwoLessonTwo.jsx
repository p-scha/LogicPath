import "./LessonOne.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// For progression API helper
import { markStageComplete } from "../services/ProgressService";
import { useStageAccess } from "../hooks/useStageAccess";

export default function ModuleTwoLessonTwo() {
  const location = useLocation();
  const navigate = useNavigate();

  // For logged-in user data
  const userId = localStorage.getItem("userId");

  // Access restriction w/ hook
  const { accessChecked, allowed } = useStageAccess(
    userId,
    "module_2",
    "lesson_2",
    "/module_two"
  );

  const difficulty =
    location.state?.difficulty ??
    Number(localStorage.getItem("difficulty")) ??
    1;

  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const isLast = index === slides.length - 1;

  // =========================
  // LOAD LESSON FROM BACKEND
  // =========================
  useEffect(() => {
    // No loading if accessed not allowed
    if (!allowed) return;

    async function loadLesson() {
      try {
        const res = await fetch("/api/lessons/module_2/2");

        if (!res.ok) {
          throw new Error("Failed to fetch lesson");
        }

        const data = await res.json();

        setSlides(data.slides ?? []);
        setIndex(0);
      } catch (err) {
        console.error("Lesson load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [allowed]);

  const handleNext = async () => {
    if (isLast) {
      try {
        await markStageComplete(userId, "module_2", "lesson_2", "LESSON");
        navigate("/module_two/quiz2", { state: { difficulty } });
      } catch (err) {
        console.error("Failed to save lesson progress:", err);
        alert("Could not save progress. Please try again.");
      }
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (loading || slides.length === 0) {
    return (
      <div className="lesson-one-bg">
        <div className="lesson-one-panel">
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  const slide = slides[index];

  return (
    <div className="lesson-one-bg">
      <div className="lesson-one-panel">
        {/* progress dots */}
        <div className="slide-progress">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`progress-dot ${
                i === index ? "active" : i < index ? "done" : ""
              }`}
            />
          ))}
        </div>

        {/* content */}
        <h2 className="slide-title">{slide.title}</h2>
        <p className="slide-body" style={{ whiteSpace: "pre-line" }}>
          {slide.body}
        </p>

        {/* controls */}
        <div className="slide-actions">
          {index > 0 && (
            <button
              className="slide-btn back"
              onClick={() => setIndex((i) => i - 1)}
            >
              Back
            </button>
          )}

          <button
            className={`slide-btn ${isLast ? "quiz" : "next"}`}
            onClick={handleNext}
          >
            {isLast ? "Battle!" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}