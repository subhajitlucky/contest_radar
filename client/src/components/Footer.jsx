import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-brand">🎯 Contest Radar</h3>
                        <p className="footer-description">
                            Your ultimate destination for discovering and tracking coding contests 
                            from top competitive programming platforms.
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="GitHub">💻</a>
                            <a href="#" aria-label="Twitter">🐦</a>
                            <a href="#" aria-label="Discord">🎮</a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/contests">Contests</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Platforms</h4>
                        <ul className="footer-links">
                            <li><a href="https://codeforces.com" target="_blank" rel="noopener noreferrer">Codeforces</a></li>
                            <li><a href="https://leetcode.com" target="_blank" rel="noopener noreferrer">LeetCode</a></li>
                            <li><a href="https://atcoder.jp" target="_blank" rel="noopener noreferrer">AtCoder</a></li>
                            <li><a href="https://codechef.com" target="_blank" rel="noopener noreferrer">CodeChef</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Legal</h4>
                        <ul className="footer-links">
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service">Terms of Service</Link></li>
                            <li><Link to="/disclaimer">Disclaimer</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                <p>&copy; {currentYear} Contest Radar. All rights reserved.</p>
                    <p>Made with ❤️ for the coding community</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;