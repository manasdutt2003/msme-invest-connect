import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CreateListing from '../components/CreateListing';
import '../styles/Dashboard.css';

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
            setUser(JSON.parse(storedUser));
            fetchData(JSON.parse(storedUser));
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
                        setMyCompany(null); // No company yet
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

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container dashboard-page">
            <header className="dashboard-header">
                <h1>Welcome, {user.name}</h1>
                <div className="user-info">
                    <span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span>
                    <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                </div>
            </header>

            <div className="dashboard-content">
                {user.role === 'investor' && (
                    <div className="investor-section">
                        <h2>Your Portfolio</h2>
                        {myInvestments.length === 0 ? (
                            <p>You haven't made any investments yet. <a href="/marketplace">Explore Marketplace</a></p>
                        ) : (
                            <div className="investment-list">
                                {myInvestments.map(inv => (
                                    <div key={inv._id} className="investment-card">
                                        <h3>{inv.company.businessName}</h3>
                                        <p>Amount Invested: ₹{inv.amount}</p>
                                        <p>Expected Returns: {inv.company.returnsPercentage}%</p>
                                        <p>Sector: {inv.company.sector}</p>
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
                                <h2>Your Business Listing</h2>
                                <div className="company-card">
                                    <h3>{myCompany.businessName}</h3>
                                    <span className="sector-badge">{myCompany.sector}</span>
                                    <p>{myCompany.description}</p>
                                    <div className="company-stats">
                                        <div className="stat">
                                            <span className="label">Funding Goal</span>
                                            <span className="value">₹{myCompany.fundingGoal}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="label">Raised So Far</span>
                                            <span className="value">₹{myCompany.amountRaised}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="label">Returns Offered</span>
                                            <span className="value">{myCompany.returnsPercentage}%</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                        <strong>Status:</strong> {myCompany.amountRaised >= myCompany.fundingGoal ? 'Fully Funded!' : 'Active & Fundraising'}
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
