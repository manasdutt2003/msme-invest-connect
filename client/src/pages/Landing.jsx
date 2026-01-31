import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Fueling India's Manufacturing Future</h1>
                    <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">Invest in vetted MSMEs and earn attractive returns while empowering the backbone of the economy.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/marketplace" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg">Start Investing</Link>
                        <Link to="/register" className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">Get Funding</Link>
                    </div>
                </div>
            </header>

            <section className="py-20 px-4">
                <div className="container mx-auto grid md:grid-cols-3 gap-8">
                    <Link to="/marketplace" className="group block p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">For Investors</h3>
                        <p className="text-gray-600">Access high-yield opportunities in the manufacturing sector with transparent data and automated reports.</p>
                    </Link>

                    <Link to="/register" className="group block p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">For MSMEs</h3>
                        <p className="text-gray-600">Get quick working capital without the hassle of traditional public listing. Simple application process.</p>
                    </Link>

                    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Secure & Transparent</h3>
                        <p className="text-gray-600">Direct connection between investors and business owners on a secure platform with encrypted data.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
