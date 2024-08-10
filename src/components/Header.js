// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './components.css'; // Import CSS file for styling

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        
        <header className="header">
            <h2 className="logo">St Mary's Cryptos</h2>
            <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
                <div className="menu-icon" onClick={toggleMenu}>
                    <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                    <li><Link to="/cryptograph" onClick={toggleMenu}>CryptoGraph</Link></li>
                    <li><Link to="/converter" onClick={toggleMenu}>Converter</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
