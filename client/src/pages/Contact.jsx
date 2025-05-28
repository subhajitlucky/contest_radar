import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // EmailJS integration using environment variables
            const result = await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    to_email: import.meta.env.VITE_CONTACT_EMAIL
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            console.log('Email sent successfully:', result.text);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="container">
                {/* Hero Section */}
                <section className="contact-hero">
                    <h1>Get In Touch</h1>
                    <p className="hero-subtitle">
                        Have questions or suggestions? We'd love to hear from you!
                    </p>
                </section>

                <div className="contact-content">
                    {/* Contact Info */}
                    <div className="contact-info">
                        <h2>Contact Information</h2>
                        <div className="info-cards">
                            <div className="info-card">
                                <div className="info-icon">📧</div>
                                <h3>Email</h3>
                                <p>{import.meta.env.VITE_CONTACT_EMAIL || 'your-email@example.com'}</p>
                                <p className="info-desc">Send us an email anytime</p>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">💬</div>
                                <h3>Response Time</h3>
                                <p>Within 24 hours</p>
                                <p className="info-desc">We reply to all messages quickly</p>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">🌍</div>
                                <h3>Location</h3>
                                <p>Available Worldwide</p>
                                <p className="info-desc">Supporting developers globally</p>
                            </div>
                        </div>

                        <div className="social-section">
                            <h3>Connect With Us</h3>
                            <div className="social-links">
                                <a href="#" className="social-link">
                                    <span>💻</span>
                                    <span>GitHub</span>
                                </a>
                                <a href="#" className="social-link">
                                    <span>🐦</span>
                                    <span>Twitter</span>
                                </a>
                                <a href="#" className="social-link">
                                    <span>💼</span>
                                    <span>LinkedIn</span>
                                </a>
                                <a href="#" className="social-link">
                                    <span>🎮</span>
                                    <span>Discord</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>Send Message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className={`btn btn-primary submit-btn ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>

                            {submitStatus === 'success' && (
                                <div className="form-message success">
                                    ✅ Message sent successfully! We'll get back to you soon.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="form-message error">
                                    ❌ Failed to send message. Please try again or contact us directly.
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>How often is contest data updated?</h3>
                            <p>Contest data is updated in real-time using official APIs from each platform.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Can I suggest new features?</h3>
                            <p>Absolutely! We welcome all suggestions and feedback to improve Contest Radar.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Is Contest Radar free to use?</h3>
                            <p>Yes, Contest Radar is completely free for all users worldwide.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Which platforms are supported?</h3>
                            <p>We currently support Codeforces, LeetCode, AtCoder, CodeChef, and HackerRank.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Contact; 