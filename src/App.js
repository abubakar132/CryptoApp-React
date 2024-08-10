// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Converter from './components/Converter';
import CryptoGraph from './components/CryptoGraph'; 
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route exact path="/" element={<Dashboard />} /> 
            <Route path="/converter" element={<Converter />} /> 
            <Route path="/cryptograph" element={<CryptoGraph />} /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
