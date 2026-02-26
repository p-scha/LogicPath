import "./StartMenu.css";

import { useNavigate } from "react-router-dom";

export default function StartMenu() {
  const navigate = useNavigate();

  return (
    <div className="start-menu">
      <h1 className="title">LogicPath</h1>

      <div className="menu">
        <button onClick={() => navigate("/login")}>Start</button> <br />
        <button>Options</button> <br />
        <button>Quit</button> <br />
      </div>
    </div>
  );
}

