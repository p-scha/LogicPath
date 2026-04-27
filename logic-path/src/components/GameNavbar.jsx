import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function GameNavbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/map">World Map</Link></li>
        <li><Link to="/arena">Arena</Link></li>
        <li><Link to="/login">Log Out</Link></li>
      </ul>
    </nav>
  );
}

export default GameNavbar;
