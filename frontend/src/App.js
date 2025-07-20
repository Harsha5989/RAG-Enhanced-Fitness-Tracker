import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import MainApp from './MainApp';
import './App.css';

function App() {
  return (
    <Router>
      <div className="navbar">
        <span className="app-title">Health App</span>
        <div>
          <Link className="nav-button" to="/">Home</Link>
          <Link className="nav-button" to="/calorie">Calorie App</Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calorie" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
