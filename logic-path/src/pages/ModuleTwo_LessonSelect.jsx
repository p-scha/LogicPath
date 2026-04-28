import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ModuleTwo_LessonSelect.css";

const lessons = [
  {
    id: 1,
    title: "Lesson 1",
    subtitle: "What is a fallacy?",
    difficultyLevel: 1,
    description: "Learn what are fallacies and the different general types.",
    route: "/module_two/lesson",
  },
  {
    id: 2,
    title: "Lesson 2",
    subtitle: "Informal Fallacies",
    difficultyLevel: 1,
    description: "An overview of a wide array of common informal fallacies.",
    route: "/module_two/lesson2",
  },
  {
    id: 3,
    title: "Lesson 3",
    subtitle: "Formal Fallacies",
    difficultyLevel: 1,
    description: "An overview of the main formal fallacies",
    route: "/module_two/lesson3",
  },
];

const difficulties = [
  { level: 1, label: "Easy",   color: "#22c55e" },
  { level: 2, label: "Medium", color: "#eab308" },
  { level: 3, label: "Hard",   color: "#ef4444" },
];

export default function ModuleOne_LessonSelect() {
  const [selected, setSelected] = useState(null);
  const [chosenDifficulty, setChosenDifficulty] = useState(1);
  const navigate = useNavigate();

  const handleSelectLesson = (lesson) => {
    setSelected(lesson);
    setChosenDifficulty(lesson.difficultyLevel);
  };

  const activeDiff = difficulties.find((d) => d.level === chosenDifficulty);

  const handleStart = () => {
    if (!selected) return;
    navigate(selected.route, {
      state: { difficulty: chosenDifficulty },
    });
  };

  return (
    <div className="lesson-select-bg">
      <div className="lesson-select-container">
        {/* Left: Lesson List */}
        <div className="lesson-list">
          <h2 className="module-title">Module 2</h2>
          <p className="module-subtitle">Forest of Fallacies</p>
          <ul>
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className={`lesson-item ${selected?.id === lesson.id ? "active" : ""}`}
                onClick={() => handleSelectLesson(lesson)}
              >
                <span className="lesson-number">{lesson.id}</span>
                <div className="lesson-item-text">
                  <span className="lesson-item-title">{lesson.title}</span>
                  <span className="lesson-item-subtitle">{lesson.subtitle}</span>
                </div>
                <span
                  className="lesson-item-dot"
                  style={{ background: difficulties[lesson.difficultyLevel - 1].color }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Detail Panel */}
        <div className="lesson-detail">
          {selected ? (
            <>
              <div className="detail-header">
                <h3>{selected.title}</h3>
                <p className="detail-subtitle">{selected.subtitle}</p>
              </div>

              <p className="detail-description">{selected.description}</p>

              {/* Difficulty Selector */}
              <div className="difficulty-section">
                <span className="difficulty-label">Difficulty</span>
                <div className="difficulty-bar">
                  {difficulties.map((d) => (
                    <button
                      key={d.level}
                      className={`difficulty-segment-btn ${chosenDifficulty === d.level ? "selected" : ""}`}
                      style={{
                        background:
                          d.level <= chosenDifficulty
                            ? activeDiff.color
                            : "rgba(255,255,255,0.12)",
                        borderColor:
                          d.level <= chosenDifficulty
                            ? activeDiff.color
                            : "transparent",
                      }}
                      onClick={() => setChosenDifficulty(d.level)}
                      title={d.label}
                    />
                  ))}
                </div>
                <span
                  className="difficulty-tag"
                  style={{ color: activeDiff.color }}
                >
                  {activeDiff.label}
                </span>
              </div>

              <p className="difficulty-hint">
                Difficulty adjusts automatically after each lesson, but you can change it here.
              </p>

              <button className="start-lesson-btn" onClick={handleStart}>
                Start Lesson
              </button>
            </>
          ) : (
            <div className="detail-placeholder">
              <p>Select a lesson to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
