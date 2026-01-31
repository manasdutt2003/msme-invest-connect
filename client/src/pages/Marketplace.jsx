import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Marketplace = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get('/companies');
                setCompanies(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching companies", err);
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Investment Marketplace</h1>
                        <p className="text-slate-400 mt-1">Discover high-potential businesses seeking capital.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:bg-slate-900/50 focus:ring-2 focus:ring-brand-primary transition-all duration-200 sm:text-sm backdrop-blur-sm"
                            placeholder="Search by company or sector..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map(company => (
                                <div key={company._id} className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-primary/10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-brand-primary transition-colors">{company.name}</h3>
                                            <p className="text-sm text-slate-400">{company.sector}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${company.trustScore >= 80 ? 'bg-green-500/10 text-green-500 border-green-500/20' : company.trustScore >= 50 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            Trust Score: {company.trustScore || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <span className="px-2 py-1 rounded text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">{company.returnsPercentage}% Returns</span>
                                    </div>

                                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">{company.description}</p>

                                    <div className="space-y-4">
                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-medium text-slate-300">
                                                <span>Raised: ${company.raised || 0}</span>
                                                <span>Goal: ${company.fundingGoal}</span>
                                            </div>
                                            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-brand-success h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(((company.raised || 0) / company.fundingGoal) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="text-sm">
                                                <span className="block text-slate-400">Returns</span>
                                                <span className="font-bold text-brand-success">{company.returnPercentage}%</span>
                                            </div>
                                            <button className="px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20">
                                                Invest Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                No companies found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
