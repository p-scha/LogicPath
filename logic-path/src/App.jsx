import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StartMenu from "./components/StartMenu.jsx";
import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import WorldMap from "./pages/WorldMap.jsx"; 

import GameNavbar from "./components/GameNavbar.jsx"
import Settings from "./pages/Settings.jsx"
import LessonOne from "./pages/LessonOne.jsx"
import LessonOneQuiz from "./pages/LessonOneQuiz.jsx"
import LessonTwo from "./pages/LessonTwo.jsx"
import LessonTwoQuiz from "./pages/LessonTwoQuiz.jsx"
import LessonThree from "./pages/LessonThree.jsx"
import LessonThreeBoss from "./pages/LessonThreeBoss.jsx"
import ModuleOne_LessonSelect from "./pages/ModuleOne_LessonSelect.jsx"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

   return (
    <Router>
      <Routes>
        <Route path="/" element={<StartMenu />} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/map" element={<><GameNavbar /><WorldMap /></>} />
        <Route path="/settings" element={<><GameNavbar /><Settings /></>} />
        <Route path="/module_one" element={<><GameNavbar /><ModuleOne_LessonSelect /></>} />
        <Route path="/module_one/lesson" element={<><GameNavbar /><LessonOne /></>} />
        <Route path="/module_one/quiz" element={<><GameNavbar /><LessonOneQuiz /></>} />
        <Route path="/module_one/lesson2" element={<><GameNavbar /><LessonTwo /></>} />
        <Route path="/module_one/quiz2" element={<><GameNavbar /><LessonTwoQuiz /></>} />
        <Route path="/module_one/lesson3" element={<><GameNavbar /><LessonThree /></>} />
        <Route path="/module_one/boss3" element={<><GameNavbar /><LessonThreeBoss /></>} />
      </Routes>
    </Router>
  );

}

export default App
