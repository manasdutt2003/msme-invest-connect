import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col pt-16">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-hero-glow opacity-20 blur-[100px] pointer-events-none" />

            {/* Hero Section */}
            <main className="flex-grow flex items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-float">
                        <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                        <span className="text-sm font-medium text-slate-300">Next-Gen Investment Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                        Fueling the Future of <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">
                            MSME Growth
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Bridge the gap between visionary investors and ambitious enterprises.
                        A secure, transparent, and AI-driven marketplace for the modern economy.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/25 hover:-translate-y-1 transition-all duration-300">
                            Start Investing Now
                        </Link>
                        <Link to="/marketplace" className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-medium bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                            Explore Opportunities
                        </Link>
                    </div>

                    {/* Stats / Trust Markers */}
                    <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 mt-12">
                        {[
                            { label: 'Total Invested', value: '$5M+' },
                            { label: 'Active MSMEs', value: '1,200+' },
                            { label: 'Verified Investors', value: '450+' },
                            { label: 'Growth Rate', value: '185%' },
                        ].map((stat, index) => (
                            <div key={index} className="space-y-1">
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="relative z-10 py-24 bg-brand-card/30 backdrop-blur-sm border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose Us?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Built with industry-leading technology to ensure security, speed, and transparency.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Secure Transactions', desc: 'Bank-grade encryption and verified payment gateways for peace of mind.', icon: '🔒' },
                            { title: 'Real-time Analytics', desc: 'Monitor your portfolio performance with live dashboards and AI insights.', icon: '📊' },
                            { title: 'Instant Matching', desc: 'Smart algorithms connect the right investors with the right businesses instantly.', icon: '⚡' },
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                                <div className="w-12 h-12 rounded-lg bg-brand-primary/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
