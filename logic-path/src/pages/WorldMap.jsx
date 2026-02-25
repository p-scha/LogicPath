import { useState } from "react";
import "./WorldMap.css";
import worldMap from "../assets/world-map.png";

const nodes = [
  { id: "region-1", label: "Module 1", xPercent: 30, yPercent: 40 },
  { id: "region-2", label: "Module 2", xPercent: 55, yPercent: 25 },
  { id: "region-3", label: "Module 3", xPercent: 70, yPercent: 60 },
];

export default function WorldMap() {
  const [selectedModule, setSelectedModule] = useState(null);

  return (
    <div className="map-container">
      <img src={worldMap} alt="World Map" />

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
          <button onClick={() => setSelectedModule(null)}>Close</button>
        </div>
      )}
    </div>
  );
}