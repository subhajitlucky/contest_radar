import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="container">
                {/* Hero Section */}
                <section className="about-hero">
                    <h1>About Contest Radar</h1>
                    <p className="hero-subtitle">
                        Empowering developers to discover and excel in competitive programming
                    </p>
                </section>

                {/* Mission Section */}
                <section className="section">
                    <div className="content-grid">
                        <div className="content-text">
                            <h2>Our Mission</h2>
                            <p>
                                Contest Radar was born from a simple idea: competitive programming contests 
                                are scattered across multiple platforms, making it difficult for developers 
                                to stay updated with upcoming opportunities.
                            </p>
                            <p>
                                We believe every developer deserves easy access to competitive programming 
                                contests that can help them grow their skills, challenge their thinking, 
                                and connect with the global coding community.
                            </p>
                        </div>
                        <div className="content-visual">
                            <div className="visual-card">
                                <h3>🎯</h3>
                                <p>Centralized contest discovery from multiple platforms</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="section features-detailed">
                    <h2 className="text-center">What We Offer</h2>
                    <div className="features-detailed-grid">
                        <div className="feature-detailed">
                            <div className="feature-icon">🔄</div>
                            <h3>Real-time Updates</h3>
                            <p>
                                Stay informed with live updates on contest schedules, changes, 
                                and new contests as they're announced.
                            </p>
                        </div>
                        <div className="feature-detailed">
                            <div className="feature-icon">🌐</div>
                            <h3>Multi-Platform Support</h3>
                            <p>
                                Access contests from Codeforces, LeetCode, AtCoder, CodeChef, 
                                and more platforms in one convenient location.
                            </p>
                        </div>
                        <div className="feature-detailed">
                            <div className="feature-icon">📱</div>
                            <h3>Mobile-Friendly</h3>
                            <p>
                                Check contests on the go with our responsive design that works 
                                perfectly on all devices.
                            </p>
                        </div>
                        <div className="feature-detailed">
                            <div className="feature-icon">🔍</div>
                            <h3>Smart Search & Filter</h3>
                            <p>
                                Quickly find contests that match your interests with our 
                                intelligent search and filtering system.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="section stats-detailed">
                    <h2 className="text-center">By the Numbers</h2>
                    <div className="stats-detailed-grid">
                        <div className="stat-detailed">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Contests Tracked Monthly</div>
                        </div>
                        <div className="stat-detailed">
                            <div className="stat-number">5</div>
                            <div className="stat-label">Major Platforms Supported</div>
                        </div>
                        <div className="stat-detailed">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-detailed">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Real-time Monitoring</div>
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="section vision-section">
                    <div className="content-grid reverse">
                        <div className="content-visual">
                            <div className="visual-card">
                                <h3>🚀</h3>
                                <p>Building the future of competitive programming</p>
                            </div>
                        </div>
                        <div className="content-text">
                            <h2>Our Vision</h2>
                            <p>
                                We envision a world where every aspiring programmer has easy access 
                                to competitive programming opportunities, regardless of their location 
                                or background.
                            </p>
                            <p>
                                Contest Radar is just the beginning. We're working towards creating 
                                a comprehensive ecosystem that supports developers throughout their 
                                competitive programming journey.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="section cta-about">
                    <div className="cta-content text-center">
                        <h2>Join Our Community</h2>
                        <p>
                            Ready to take your competitive programming to the next level? 
                            Start exploring contests today!
                        </p>
                        <div className="cta-actions">
                            <a href="/contests" className="btn btn-primary">
                                Explore Contests
                            </a>
                            <a href="/contact" className="btn btn-secondary">
                                Get in Touch
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About; 