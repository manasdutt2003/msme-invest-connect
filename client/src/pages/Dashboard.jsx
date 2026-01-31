import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CreateListing from '../components/CreateListing';

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [myInvestments, setInvestments] = useState([]);
    const [myCompany, setMyCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchData(parsedUser);
        }
    }, [navigate]);

    const fetchData = async (userData) => {
        try {
            if (userData.role === 'investor') {
                const res = await api.get('/invest/my-investments');
                setInvestments(res.data);
            } else if (userData.role === 'msme') {
                try {
                    const res = await api.get('/companies/my-company');
                    setMyCompany(res.data);
                } catch (err) {
                    if (err.response && err.response.status === 404) {
                        setMyCompany(null);
                    } else {
                        console.error('Error fetching company:', err);
                    }
                }
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div className="min-h-screen pt-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'investor' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role}
                    </span>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-medium transition-colors text-sm">
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                {user.role === 'investor' && (
                    <div className="investor-section">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Investment Portfolio</h2>
                        {myInvestments.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                                <p className="text-gray-500 mb-4">You haven't made any investments yet.</p>
                                <a href="/marketplace" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors">Explore Marketplace</a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myInvestments.map(inv => (
                                    <div key={inv._id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{inv.company.businessName}</h3>
                                        <div className="space-y-2 mt-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Invested</span>
                                                <span className="font-semibold">₹{inv.amount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Expected Returns</span>
                                                <span className="font-semibold text-green-600">+{inv.company.returnsPercentage}%</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Sector</span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs">{inv.company.sector}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {user.role === 'msme' && (
                    <div className="msme-section">
                        {myCompany ? (
                            <div className="my-company-details">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Your Business Listing</h2>
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-3xl mx-auto">
                                    <div className="grid md:grid-cols-3">
                                        <div className="p-6 md:col-span-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-bold text-gray-900">{myCompany.businessName}</h3>
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">{myCompany.sector}</span>
                                            </div>
                                            <p className="text-gray-600 mb-6">{myCompany.description}</p>

                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                                                <span className="font-medium text-green-900">Status</span>
                                                <span className={`font-bold ${myCompany.amountRaised >= myCompany.fundingGoal ? 'text-green-600' : 'text-blue-600'}`}>
                                                    {myCompany.amountRaised >= myCompany.fundingGoal ? 'Fully Funded' : 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-6 space-y-4 border-l border-gray-100">
                                            <div>
                                                <span className="block text-xs text-gray-500 uppercase">Funding Goal</span>
                                                <span className="block text-xl font-bold text-gray-900">₹{myCompany.fundingGoal.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-500 uppercase">Raised</span>
                                                <span className="block text-xl font-bold text-blue-600">₹{myCompany.amountRaised.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-500 uppercase">Returns Offered</span>
                                                <span className="block text-xl font-bold text-green-600">{myCompany.returnsPercentage}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2">
                                        <div
                                            className="bg-primary h-2 transition-all duration-500"
                                            style={{ width: `${Math.min((myCompany.amountRaised / myCompany.fundingGoal) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <CreateListing onListingCreated={setMyCompany} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
