import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./WorldMap.css";
import worldMap from "../assets/world-map.png";

import { getProgress } from "../services/ProgressService";

const nodes = [
  { id: "module_1", label: "Module 1", description: "Pathway to Logic", xPercent: 30, yPercent: 40, path: "/module_one" },
  { id: "module_2", label: "Module 2", description: "Forest of Fallacies", xPercent: 55, yPercent: 25, path: "/module_two" },
  { id: "module_3", label: "Module 3", description: "(Under construction)", xPercent: 70, yPercent: 60 },
];

export default function WorldMap() {
  const [selectedModule, setSelectedModule] = useState(null);

  const [unlockedModules, setUnlockedModules] = useState({
    module_1: true,
    module_2: false,
    module_3: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [unlockedMessage, setUnlockedMessage] = useState(
    location.state?.unlockedMessage || ""
  );

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadProgress() {
      try {
        const progress = await getProgress(userId);

        setUnlockedModules({
          module_1: true,
          module_2: progress.unlockedModules?.module_2 || false,
          module_3: progress.unlockedModules?.module_3 || false,
        });
      } catch (error) {
        console.error("Failed to load progress:", error);
      }
    }

    if (userId) {
      loadProgress();
    }
  }, [userId]);

  function getLockedMessage(moduleId) {
    if (moduleId === "module_2") {
      return "Defeat the Module 1 boss to unlock Module 2.";
    }

    if (moduleId === "module_3") {
      return "Defeat the Module 2 boss to unlock Module 3.";
    }

    return "This module is locked.";
  }

  return (
    <div
      className="map-container"
      style={{ backgroundImage: `url(${worldMap})` }}
    >
      {unlockedMessage && (
        <div className="unlock-popup">
          <h2>{unlockedMessage}</h2>
          <p>A new region is now available on the world map.</p>

          <button onClick={() => setUnlockedMessage("")}>
            Continue
          </button>
        </div>
      )}

      {nodes.map((node) => (
        <button
          key={node.id}
          className={`node 
            ${selectedModule?.id === node.id ? "active" : ""}
            ${!unlockedModules[node.id] ? "locked" : ""}
          `}
          style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%` }}
          onClick={() => setSelectedModule(node)}
        />
      ))}

      {selectedModule && (
        <div className="module-panel">
          <h2>{selectedModule.label}</h2>
          <p>{selectedModule.description}</p>

          {!unlockedModules[selectedModule.id] && (
            <p className="locked-message">
              {getLockedMessage(selectedModule.id)}
            </p>
          )}

          <button
            className="start-btn"
            disabled={!unlockedModules[selectedModule.id] || !selectedModule.path}
            onClick={() => {
              if (!unlockedModules[selectedModule.id]) return;
              if (!selectedModule.path) return;

              navigate(selectedModule.path);
            }}
          >
            {unlockedModules[selectedModule.id] ? "Start" : "Locked"}
          </button>

          <button
            className="close-btn"
            onClick={() => setSelectedModule(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}