import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import this
import "./WorldMap.css";
import worldMap from "../assets/world-map.png";

const nodes = [
  { id: "region-1", label: "Module 1", description: "Pathway to Logic", xPercent: 30, yPercent: 40, path: "/module_one" },
  { id: "region-2", label: "Module 2", description: "(Under construction)", xPercent: 55, yPercent: 25 },
  { id: "region-3", label: "Module 3", description: "(Under construction)", xPercent: 70, yPercent: 60 },
];

export default function WorldMap() {
  const [selectedModule, setSelectedModule] = useState(null);
  const navigate = useNavigate(); // <-- initialize navigate

  return (
    <div
      className="map-container"
      style={{ backgroundImage: `url(${worldMap})` }}
    >
      {nodes.map((node) => (
        <button
          key={node.id}
          className={`node ${selectedModule?.id === node.id ? "active" : ""}`}
          style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%` }}
          onClick={() => setSelectedModule(node)}
        />
      ))}

      {selectedModule && (
        <div className="module-panel">
          <h2>{selectedModule.label}</h2>
          <p>{selectedModule.description}</p>

          <button
            className="start-btn"
            onClick={() => {
              // Navigate to module_one route
              navigate(selectedModule.path);
            }}
          >
            Start
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