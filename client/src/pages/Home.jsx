import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    const [contestStats, setContestStats] = useState({
        totalContests: 0,
        upcomingContests: 0,
        activeUsers: "10K+",
        platformsSupported: 5
    });
    const [featuredContests, setFeaturedContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContestData = async () => {
            try {
                const response = await fetch('https://codeforces.com/api/contest.list');
                const data = await response.json();
                
                const upcomingContests = data.result.filter(contest => contest.phase === 'BEFORE');
                const totalContests = data.result.length;
                
                setContestStats(prev => ({
                    ...prev,
                    totalContests,
                    upcomingContests: upcomingContests.length
                }));
                
                // Get first 3 upcoming contests for preview
                setFeaturedContests(upcomingContests.slice(0, 3));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contest data:', error);
                setLoading(false);
            }
        };

        fetchContestData();
    }, []);

    const platforms = [
        { name: "Codeforces", icon: "🔥", color: "#1f8dd6" },
        { name: "LeetCode", icon: "💡", color: "#ffa116" },
        { name: "AtCoder", icon: "⚡", color: "#3c9ae8" },
        { name: "CodeChef", icon: "👨‍🍳", color: "#5b4638" },
        { name: "HackerRank", icon: "🚀", color: "#2ec866" }
    ];

    const features = [
        {
            icon: "🎯",
            title: "Real-time Updates",
            description: "Get instant notifications about upcoming contests from multiple platforms."
        },
        {
            icon: "📊",
            title: "Contest Analytics",
            description: "View detailed statistics, duration, and difficulty levels for better preparation."
        },
        {
            icon: "🔔",
            title: "Smart Reminders",
            description: "Never miss a contest with our intelligent reminder system."
        },
        {
            icon: "🌐",
            title: "Multi-Platform",
            description: "Access contests from Codeforces, LeetCode, AtCoder, and more in one place."
        }
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Your Ultimate <span className="text-gradient">Contest Radar</span>
                        </h1>
                        <p className="hero-description">
                            Discover, track, and participate in coding contests from top platforms. 
                            Stay ahead of the competition with real-time updates and smart notifications.
                        </p>
                        <div className="hero-actions">
                            <Link to="/contests" className="btn btn-primary">
                                View Contests
                            </Link>
                            <Link to="/about" className="btn btn-secondary">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="hero-background"></div>
            </section>

            {/* Statistics Section */}
            <section className="section-sm stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{loading ? "..." : contestStats.totalContests}</div>
                            <div className="stat-label">Total Contests</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{loading ? "..." : contestStats.upcomingContests}</div>
                            <div className="stat-label">Upcoming Contests</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{contestStats.activeUsers}</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{contestStats.platformsSupported}</div>
                            <div className="stat-label">Platforms Supported</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section features-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Why Choose Contest Radar?</h2>
                        <p>Everything you need to stay competitive in the coding world</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platforms Section */}
            <section className="section-sm platforms-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Supported Platforms</h2>
                        <p>Access contests from all major competitive programming platforms</p>
                    </div>
                    <div className="platforms-grid">
                        {platforms.map((platform, index) => (
                            <div key={index} className="platform-card">
                                <div className="platform-icon" style={{ color: platform.color }}>
                                    {platform.icon}
                                </div>
                                <div className="platform-name">{platform.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Contests Preview */}
            <section className="section preview-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Upcoming Contests</h2>
                        <p>Don't miss these exciting upcoming competitions</p>
                    </div>
                    {loading ? (
                        <div className="text-center">
                            <div className="loading"></div>
                        </div>
                    ) : (
                        <div className="contests-preview">
                            {featuredContests.map((contest) => (
                                <div key={contest.id} className="contest-preview-card">
                                    <h3>{contest.name}</h3>
                                    <div className="contest-details">
                                        <div className="contest-time">
                                            🕒 {new Date(contest.startTimeSeconds * 1000).toLocaleDateString()}
                                        </div>
                                        <div className="contest-duration">
                                            ⏱️ {Math.floor(contest.durationSeconds / 3600)}h {Math.floor((contest.durationSeconds % 3600) / 60)}m
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-xl">
                        <Link to="/contests" className="btn btn-primary">
                            View All Contests
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-sm cta-section">
                <div className="container">
                    <div className="cta-content text-center">
                        <h2>Ready to Level Up Your Competitive Programming?</h2>
                        <p>Join thousands of developers who use Contest Radar to stay ahead</p>
                        <Link to="/contests" className="btn btn-primary">
                            Start Exploring Contests
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;