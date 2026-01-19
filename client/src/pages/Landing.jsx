import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            <header className="hero-section">
                <div className="container hero-content">
                    <h1>Fueling India's Manufacturing Future</h1>
                    <p>Invest in vetted MSMEs and earn attractive returns while empowering the backbone of the economy.</p>
                    <div className="hero-buttons">
                        <Link to="/marketplace" className="btn btn-primary">Start Investing</Link>
                        <Link to="/register" className="btn btn-secondary">Get Funding</Link>
                    </div>
                </div>
            </header>

            <section className="features-section container">
                <Link to="/marketplace" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>For Investors</h3>
                    <p>Access high-yield opportunities in the manufacturing sector with transparent data.</p>
                </Link>
                <Link to="/register" className="feature-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3>For MSMEs</h3>
                    <p>Get quick working capital without the hassle of traditional public listing complexities.</p>
                </Link>
                <div className="feature-card">
                    <h3>Secure & Transparent</h3>
                    <p>Direct connection between investors and business owners on a secure platform.</p>
                </div>
            </section>
        </div>
    );
};

export default Landing;
