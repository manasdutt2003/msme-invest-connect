import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import CreateListing from '../components/CreateListing';
import KYCVerification from '../components/KYCVerification';
import DocumentVault from '../components/documents/DocumentVault';
import PortfolioAnalytics from '../components/dashboard/analytics/PortfolioAnalytics';
import InvestmentWizard from '../components/invest/InvestmentWizard';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [investments, setInvestments] = useState([]);
    const [myCompany, setMyCompany] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        if (storedUser?.role === 'investor') {
            // Fetch investments (mock for now as backend endpoint might need specific implementation)
            // setInvestments([...]); 
        } else if (storedUser?.role === 'msme') {
            // Fetch my company
            const fetchMyCompany = async () => {
                try {
                    // Assuming we have an endpoint or filtering client side for now. 
                    // ideally: GET /companies/me
                    const res = await axios.get('/companies');
                    const mine = res.data.find(c => c.owner === storedUser.id || c.owner?._id === storedUser.id);
                    setMyCompany(mine);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchMyCompany();
        }
    }, []);

    if (!user) return null;

    const [recommendations, setRecommendations] = useState([]);
    const [preferences, setPreferences] = useState('');
    const [editingPrefs, setEditingPrefs] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const userRes = await axios.get('/auth/user', config).catch(() => null); // Or however we get user details
                // Assuming user is already partly loaded, but we need fresh prefs maybe? 
                // Let's rely on the user state from context/parent if possible, or fetch it.
                // For simplicity, let's fetch recommendations if user is investor.

                if (user && user.role === 'investor') {
                    // Load Preferences & Recs
                    // Note: We might need a dedicated user endpoint that returns prefs if not in 'user' object currently
                }

            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user]);

    // Fetch Recommendations Effect
    useEffect(() => {
        if (user?.role === 'investor') {
            const fetchRecs = async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await axios.get('/invest/recommendations', { headers: { Authorization: `Bearer ${token}` } });
                    setRecommendations(res.data);
                } catch (e) { console.error(e); }
            };
            fetchRecs();

            // Also init preferences text
            if (user.preferences) setPreferences(user.preferences.join(', '));
        }
    }, [user]);

    const handleSavePrefs = async () => {
        const token = localStorage.getItem('token');
        const prefsArray = preferences.split(',').map(s => s.trim()).filter(Boolean);
        try {
            await axios.put('/invest/preferences', { preferences: prefsArray }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingPrefs(false);
            // Refresh User/Recs
            window.location.reload(); // Quick dirty refresh to re-run effects
        } catch (err) {
            console.error(err);
        }
    };

    const handleInvestment = async (status, details) => {
        try {
            await axios.post('/invest/pay', {
                companyId: selectedCompany._id,
                amount: details.amount,
                equity: details.equity,
                status: status
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Success logic (toast, close modal, etc.)
        } catch (err) {
            console.error("Investment failed", err);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome back, <span className="text-brand-primary">{user?.name}</span>
                        </h1>
                        <p className="text-slate-400 mt-2">
                            {user?.role === 'investor' ? 'Track your portfolio and find new opportunities.' : 'Manage your business profile and funding.'}
                        </p>

                        {user?.role === 'investor' && (
                            <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold text-white">AI Matchmaking Preferences</h3>
                                    <button onClick={() => setEditingPrefs(!editingPrefs)} className="text-xs text-brand-primary hover:text-white transition-colors">
                                        {editingPrefs ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                {editingPrefs ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={preferences}
                                            onChange={(e) => setPreferences(e.target.value)}
                                            className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-white"
                                            placeholder="e.g. Solar, Tech, Agriculture"
                                        />
                                        <button onClick={handleSavePrefs} className="px-3 py-1 bg-brand-primary rounded text-sm text-white">Save</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {user?.preferences?.length > 0 ? (
                                            user.preferences.map((p, i) => (
                                                <span key={i} className="px-2 py-1 bg-brand-accent/10 text-brand-accent rounded text-xs border border-brand-accent/20">{p}</span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-500 italic">No preferences set. Add tags to get AI recommendations.</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Recommendations Section (Investor Only) */}
                {user?.role === 'investor' && recommendations.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-accent">
                                Top AI Recommendations
                            </span>
                            <span className="ml-2 text-xs py-0.5 px-2 bg-white/10 rounded-full text-slate-300 border border-white/5">Beta</span>
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {recommendations.map(company => (
                                <div key={company._id} className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                                    <div className="absolute top-4 right-4">
                                        <div className="flex items-center space-x-1 bg-brand-primary/20 text-brand-primary px-2 py-1 rounded text-xs font-bold border border-brand-primary/30">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            <span>{company.matchScore > 100 ? 99 : company.matchScore}% Match</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">{company.businessName}</h3>
                                    <p className="text-sm text-slate-400 mb-4">{company.sector}</p>
                                    <p className="text-slate-300 text-sm line-clamp-2 mb-4">{company.description}</p>
                                    <div className="flex justify-between items-center text-xs text-slate-400">
                                        <span>Target: ₹{company.fundingGoal.toLocaleString()}</span>
                                        <span className="text-brand-success">{company.returnsPercentage}% Returns</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Hello, <span className="text-brand-accent">{user.name}</span>
                    </h1>
                    <p className="text-slate-400">Here's what's happening with your portfolio today.</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/10 w-fit mb-8">
                    {['overview', 'vault', 'activity', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${activeTab === tab
                                ? 'bg-brand-primary text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Vault Tab (Full Width) */}
                    {activeTab === 'vault' && (
                        <div className="lg:col-span-3">
                            <DocumentVault user={user} />
                        </div>
                    )}

                    {/* Overview / Activity / Settings (Left Column) */}
                    {activeTab !== 'vault' && (
                        <div className="lg:col-span-2 space-y-8">

                            {/* ANALYTICS: Investor Only */}
                            {user?.role === 'investor' && <PortfolioAnalytics />}

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                                    <h3 className="text-slate-400 text-sm font-medium mb-1">Total Balance</h3>
                                    <div className="text-3xl font-bold text-white">$124,500.00</div>
                                    <div className="text-brand-success text-xs font-medium mt-2 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        +12.5% this month
                                    </div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                                    <h3 className="text-slate-400 text-sm font-medium mb-1">Active Investments</h3>
                                    <div className="text-3xl font-bold text-white">7</div>
                                    <div className="text-slate-500 text-xs font-medium mt-2">
                                        Across 3 sectors
                                    </div>
                                </div>
                            </div>

                            {/* Role Specific Content */}
                            {user.role === 'msme' && (
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-xl font-bold text-white mb-6">Company Management</h2>
                                    {myCompany ? (
                                        <div className="p-4 rounded-xl bg-brand-card border border-white/5">
                                            <h3 className="font-bold text-lg text-white">{myCompany.name}</h3>
                                            <p className="text-slate-400 text-sm mb-4">{myCompany.description}</p>
                                            <div className="w-full bg-slate-700/50 rounded-full h-2.5 mb-2">
                                                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-300">
                                                <span>Raised: ${myCompany.raised || 0}</span>
                                                <span>Goal: ${myCompany.fundingGoal}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-slate-400 mb-4">You haven't listed a company yet.</p>
                                            <CreateListing onCreated={(newCompany) => setMyCompany(newCompany)} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {user.role === 'investor' && (
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-xl font-bold text-white mb-6">Recent Investments</h2>
                                    <div className="space-y-4">
                                        {/* Mock items */}
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">T</div>
                                                    <div>
                                                        <h4 className="text-white font-medium">TechNova Ltd.</h4>
                                                        <p className="text-xs text-slate-400">Technology • Seed Round</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-white font-bold">$5,000</div>
                                                    <div className="text-brand-success text-xs">+15% ROI</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Right Sidebar (Overview Only) */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* KYC Verification Widget */}
                            <KYCVerification />

                            {/* Profile Card */}
                            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl p-1 shadow-lg">
                                <div className="bg-slate-900/90 backdrop-blur-md rounded-xl p-6 text-center h-full">
                                    <div className="w-20 h-20 mx-auto bg-slate-700 rounded-full mb-4 flex items-center justify-center text-2xl border-4 border-slate-800">
                                        {user.name.charAt(0)}
                                    </div>
                                    <h3 className="text-white font-bold text-lg">{user.name}</h3>
                                    <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/80 mt-2 capitalize border border-white/10">
                                        {user.role} Account
                                    </div>
                                    <button className="w-full mt-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            {/* Market Insights */}
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                                <h3 className="text-white font-bold mb-4">Market Insights</h3>
                                <div className="space-y-4">
                                    <div className="text-sm">
                                        <div className="flex justify-between text-slate-300 mb-1">
                                            <span>Tech Sector</span>
                                            <span className="text-brand-success">+2.4%</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                                            <div className="bg-brand-success h-1.5 rounded-full" style={{ width: '70%' }}></div>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="flex justify-between text-slate-300 mb-1">
                                            <span>Manufacturing</span>
                                            <span className="text-brand-warning">-0.5%</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                                            <div className="bg-brand-warning h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Investment Wizard Modal */}
                {selectedCompany && (
                    <InvestmentWizard
                        company={selectedCompany}
                        onClose={() => setSelectedCompany(null)}
                        onComplete={handleInvestment}
                    />
                )}
            </div>
        </div>
    );
};
