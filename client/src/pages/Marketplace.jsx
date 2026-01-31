import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Marketplace = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await api.get('/companies');
            setCompanies(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            const errorMsg = err.code === 'ECONNABORTED'
                ? 'Connection Timed Out. Backend is reachable but not responding.'
                : err.message;
            setError(`Error: ${errorMsg}`);
            setLoading(false);
        }
    };

    const handleInvest = async (companyId) => {
        if (!token) return navigate('/login');
        if (user.role === 'msme') return alert('Only investors can invest');

        const amount = prompt("Enter amount to invest:");
        if (!amount) return;

        try {
            // Using direct full URL or configured api
            await api.post('/invest', { companyId, amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Investment successful!');
            fetchCompanies();
        } catch (err) {
            alert(err.response?.data?.message || 'Investment failed');
        }
    };

    if (loading) return <div className="min-h-screen pt-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error) return <div className="container mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Investment Opportunities</h1>
            {companies.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500 text-lg">No investment opportunities found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map(company => (
                        <div key={company._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">{company.businessName}</h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">{company.sector}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">{company.description}</p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="block text-xs text-gray-500 uppercase tracking-wide">Raised</span>
                                        <span className="block text-lg font-semibold text-gray-900">₹{company.amountRaised.toLocaleString()}</span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="block text-xs text-gray-500 uppercase tracking-wide">Goal</span>
                                        <span className="block text-lg font-semibold text-gray-900">₹{company.fundingGoal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center">
                                    <span className="text-sm font-medium text-green-800">Projected Returns</span>
                                    <span className="text-lg font-bold text-green-700">{company.returnsPercentage}%</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <button
                                    className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    onClick={() => handleInvest(company._id)}
                                >
                                    Invest Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
