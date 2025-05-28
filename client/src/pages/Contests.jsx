import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../styles/Contests.css";

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('startTime');

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://codeforces.com/api/contest.list');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();

                    const upcomingContests = data.result.filter(contest => contest.phase === 'BEFORE');
                    setContests(upcomingContests);
                setFilteredContests(upcomingContests);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            };
            fetchData();
    }, []);

    useEffect(() => {
        let filtered = contests.filter(contest =>
            contest.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort contests
        filtered.sort((a, b) => {
            if (sortBy === 'startTime') {
                return a.startTimeSeconds - b.startTimeSeconds;
            } else if (sortBy === 'duration') {
                return a.durationSeconds - b.durationSeconds;
            } else if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        setFilteredContests(filtered);
    }, [searchTerm, sortBy, contests]);

    const handleRegister = (contestId) => {
        window.open(`https://codeforces.com/contestRegistration/${contestId}`, '_blank');
    }

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }

    const getTimeUntilStart = (startTimeSeconds) => {
        const now = Math.floor(Date.now() / 1000);
        const diff = startTimeSeconds - now;
        
        if (diff <= 0) return 'Started';
        
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    if (loading) {
        return (
            <div className="contests-container">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading"></div>
                        <p>Loading contests...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="contests-container">
                <div className="container">
                    <div className="error-container">
                        <h2>⚠️ Something went wrong</h2>
                        <p>Error: {error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contests-container">
            <div className="container">
                {/* Header Section */}
                <div className="contests-header">
                    <h1>Upcoming Contests</h1>
                    <p>Discover and participate in exciting coding competitions</p>
                </div>

                {/* Controls Section */}
                <div className="contests-controls">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search contests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    
                    <div className="sort-container">
                        <label htmlFor="sort-select">Sort by:</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="startTime">Start Time</option>
                            <option value="duration">Duration</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <p>{filteredContests.length} contest{filteredContests.length !== 1 ? 's' : ''} found</p>
                </div>

                {/* Contests Grid */}
                {filteredContests.length === 0 ? (
                    <div className="no-contests">
                        <h3>No contests found</h3>
                        <p>Try adjusting your search term or check back later for new contests.</p>
                    </div>
                ) : (
                    <div className="contests-grid">
                        {filteredContests.map(contest => (
                            <div key={contest.id} className="contest-card">
                                <div className="contest-card-header">
                                    <h3 className="contest-title">{contest.name}</h3>
                                    <div className="contest-platform">
                                        <span className="platform-badge">Codeforces</span>
                                    </div>
                                </div>
                                
                                <div className="contest-details">
                                    <div className="detail-item">
                                        <span className="detail-icon">🕒</span>
                                        <div className="detail-content">
                                            <div className="detail-label">Start Time</div>
                                            <div className="detail-value">
                                                {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-icon">⏱️</span>
                                        <div className="detail-content">
                                            <div className="detail-label">Duration</div>
                                            <div className="detail-value">
                                                {formatDuration(contest.durationSeconds)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-icon">⏰</span>
                                        <div className="detail-content">
                                            <div className="detail-label">Starts In</div>
                                            <div className="detail-value countdown">
                                                {getTimeUntilStart(contest.startTimeSeconds)}
                                            </div>
                                        </div>
                                    </div>
                        </div>
                                
                                <div className="contest-actions">
                                    <button 
                                        onClick={() => handleRegister(contest.id)}
                                        className="btn btn-primary register-btn"
                                    >
                                        Register Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Contests;