import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import "../styles/Navbar.css";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav>
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    🎯 Contest Radar
                </Link>
                
                <button 
                    className="mobile-menu-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    ☰
                </button>
                
                <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/contests" onClick={() => setIsMobileMenuOpen(false)}>
                        Contests
                    </Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                        About
                    </Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        Contact
                    </Link>
            </div>
            </div>
        </nav>
    );
}

export default Navbar;