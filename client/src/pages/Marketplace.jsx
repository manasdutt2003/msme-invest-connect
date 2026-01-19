import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Marketplace.css';

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
                ? 'Connection Timed Out. Backend is reachable but not responding (Check Terminal).'
                : err.message;
            setError(`Error: ${errorMsg} | ${err.response?.data?.message || ''}`);
            setLoading(false);
        }
    };

    const handleInvest = async (companyId) => {
        if (!token) return navigate('/login');
        if (user.role === 'msme') return alert('Only investors can invest');

        const amount = prompt("Enter amount to invest:");
        if (!amount) return;

        try {
            await axios.post('http://localhost:5000/api/invest',
                { companyId, amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Investment successful!');
            fetchCompanies(); // Refresh to see updated raised amount
        } catch (err) {
            alert(err.response?.data?.message || 'Investment failed');
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container error-alert">{error}</div>;

    return (
        <div className="container marketplace-page">
            <h1>Investment Opportunities</h1>
            {companies.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p>No investment opportunities found.</p>
                    <p>If you are running this locally for the first time, try refreshing the page to trigger the data seeder.</p>
                </div>
            ) : (
                <div className="company-grid">
                    {companies.map(company => (
                        <div key={company._id} className="company-card">
                            <h3>{company.businessName}</h3>
                            <span className="sector-badge">{company.sector}</span>
                            <p>{company.description}</p>
                            <div className="company-stats">
                                <div className="stat">
                                    <span className="label">Raised</span>
                                    <span className="value">₹{company.amountRaised}</span>
                                </div>
                                <div className="stat">
                                    <span className="label">Goal</span>
                                    <span className="value">₹{company.fundingGoal}</span>
                                </div>
                                <div className="stat">
                                    <span className="label">Returns</span>
                                    <span className="value">{company.returnsPercentage}%</span>
                                </div>
                            </div>
                            <button
                                className="btn btn-primary invest-btn"
                                onClick={() => handleInvest(company._id)}
                            >
                                Invest Now
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
