import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn.js';
import SignUp from './pages/SignUp';
import Home from './pages/Home.js';
import './css/home.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/home" element={<Home />} />

    </Routes>
  </Router>
);

export default App;