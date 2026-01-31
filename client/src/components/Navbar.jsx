import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-slate-900/60 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-all duration-300">
                            Invest Connect
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 hover:scale-105 transform">Home</Link>
                        <Link to="/marketplace" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 hover:scale-105 transform">Marketplace</Link>
                        {token ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 hover:scale-105 transform">Dashboard</Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 ease-out"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 hover:scale-105 transform">Log In</Link>
                                <Link to="/register" className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/25 hover:scale-105 transition-all duration-300 ease-out">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-300 hover:text-white focus:outline-none transition-transform duration-200 active:scale-90"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/marketplace" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
                    {token ? (
                        <>
                            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">Log Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                            <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-brand-primary hover:text-brand-accent hover:bg-brand-primary/10 transition-colors" onClick={() => setIsMenuOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
