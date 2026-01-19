import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    MSME Invest Connect
                </Link>
                <div className="navbar-links">
                    <Link to="/marketplace">Marketplace</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    {!localStorage.getItem('token') ? (
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
