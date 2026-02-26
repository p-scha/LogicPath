import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StartMenu from "./components/StartMenu.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import WorldMap from "./pages/WorldMap.jsx"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

   return (
    <Router>
      <Routes>
        <Route path="/" element={<StartMenu />} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/map" element={<WorldMap />} />
      </Routes>
    </Router>
  );

}

export default App
