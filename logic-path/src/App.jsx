import { useState } from 'react'
import './App.css'
import StartMenu from "./components/StartMenu.jsx";
import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import WorldMap from "./pages/WorldMap.jsx";

import GameNavbar from "./components/GameNavbar.jsx"
import SocialBar from "./components/SocialBar.jsx"
import Settings from "./pages/Settings.jsx"
import LessonOne from "./pages/LessonOne.jsx"
import LessonOneQuiz from "./pages/LessonOneQuiz.jsx"
import LessonTwo from "./pages/LessonTwo.jsx"
import LessonTwoQuiz from "./pages/LessonTwoQuiz.jsx"
import LessonThree from "./pages/LessonThree.jsx"
import LessonThreeBoss from "./pages/LessonThreeBoss.jsx"
import ModuleOne_LessonSelect from "./pages/ModuleOne_LessonSelect.jsx"
import Arena from "./pages/Arena.jsx"

import ModuleTwo_LessonSelect from "./pages/ModuleTwo_LessonSelect.jsx";

import ModuleTwoLessonOne from "./pages/ModuleTwoLessonOne.jsx";
import ModuleTwoLessonOneQuiz from "./pages/ModuleTwoLessonOneQuiz.jsx";
import ModuleTwoLessonTwo from "./pages/ModuleTwoLessonTwo.jsx";
import ModuleTwoLessonTwoQuiz from "./pages/ModuleTwoLessonTwoQuiz.jsx";
import ModuleTwoLessonThree from "./pages/ModuleTwoLessonThree.jsx";
import ModuleTwoLessonThreeBoss from "./pages/ModuleTwoLessonThreeBoss.jsx";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartMenu />} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />

        <Route path="/map" element={<><GameNavbar /><SocialBar /><WorldMap /></>} />
        <Route path="/settings" element={<><GameNavbar /><SocialBar /><Settings /></>} />
        <Route path="/arena" element={<><GameNavbar /><SocialBar /><Arena /></>} />

        <Route path="/module_one" element={<><GameNavbar /><SocialBar /><ModuleOne_LessonSelect /></>} />
        <Route path="/module_one/lesson" element={<><GameNavbar /><SocialBar /><LessonOne /></>} />
        <Route path="/module_one/quiz" element={<><GameNavbar /><SocialBar /><LessonOneQuiz /></>} />
        <Route path="/module_one/lesson2" element={<><GameNavbar /><SocialBar /><LessonTwo /></>} />
        <Route path="/module_one/quiz2" element={<><GameNavbar /><SocialBar /><LessonTwoQuiz /></>} />
        <Route path="/module_one/lesson3" element={<><GameNavbar /><SocialBar /><LessonThree /></>} />
        <Route path="/module_one/boss3" element={<><GameNavbar /><SocialBar /><LessonThreeBoss /></>} />

        <Route path="/module_two" element={<><GameNavbar /><SocialBar /><ModuleTwo_LessonSelect /></>} />
        <Route path="/module_two/lesson" element={<><GameNavbar /><SocialBar /><ModuleTwoLessonOne /></>} />
        <Route path="/module_two/quiz" element={<><GameNavbar /><SocialBar /><ModuleTwoLessonOneQuiz /></>} />
        <Route path="/module_two/lesson2" element={<><GameNavbar /><SocialBar /><ModuleTwoLessonTwo /></>} />
        <Route path="/module_two/quiz2" element={<><GameNavbar /><SocialBar /><ModuleTwoLessonTwoQuiz /></>} />
        <Route path="/module_two/lesson3" element={<><GameNavbar /><SocialBar /><ModuleTwoLessonThree /></>} />
        <Route path="/module_two/boss3" element={<><GameNavbar /><SocialBar /><ModuleTwoLessonThreeBoss /></>} />
      </Routes>
    </Router>
  );
}

export default App
