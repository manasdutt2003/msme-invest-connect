import React, { useState } from 'react';
import axios from '../api/axios';

const CreateListing = ({ onListingCreated }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        sector: '',
        fundingGoal: '',
        returnsPercentage: '',
        revenue: '',
        debt: '',
        foundedYear: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const { businessName, description, sector, fundingGoal, returnsPercentage, revenue, debt, foundedYear } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/companies', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token} `
                }
            });
            setMessage('Company profile created successfully!');
            if (onListingCreated) onListingCreated(res.data);
            setFormData({ businessName: '', description: '', sector: '', fundingGoal: '', returnsPercentage: '', revenue: '', debt: '', foundedYear: '' });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error creating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
            <h3 className="text-xl font-bold text-white mb-4">Create New Listing</h3>
            {error && <div className="mb-4 text-red-400 text-sm bg-red-500/10 p-2 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Sector</label>
                        <select
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            required
                        >
                            <option value="">Select...</option>
                            <option value="Technology">Technology</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Returns (%)</label>
                        <input
                            type="number"
                            name="returnsPercentage"
                            value={returnsPercentage}
                            onChange={onChange}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="revenue" className="sr-only">Annual Revenue</label>
                        <input
                            id="revenue"
                            name="revenue"
                            type="number"
                            required
                            value={revenue}
                            onChange={onChange}
                            className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            placeholder="Annual Revenue (₹)"
                        />
                    </div>
                    <div>
                        <label htmlFor="debt" className="sr-only">Total Debt</label>
                        <input
                            id="debt"
                            name="debt"
                            type="number"
                            required
                            value={debt}
                            onChange={onChange}
                            className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            placeholder="Total Debt (₹)"
                        />
                    </div>
                    <div>
                        <label htmlFor="foundedYear" className="sr-only">Founded Year</label>
                        <input
                            id="foundedYear"
                            name="foundedYear"
                            type="number"
                            required
                            value={foundedYear}
                            onChange={onChange}
                            className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            placeholder="Founded Year (YYYY)"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Funding Goal ($)</label>
                    <input
                        type="number"
                        name="fundingGoal"
                        value={fundingGoal}
                        onChange={onChange}
                        className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-lg bg-brand-primary text-white font-bold hover:bg-brand-secondary transition-all disabled:opacity-70 mt-2"
                >
                    {loading ? 'Creating...' : 'List Company'}
                </button>
            </form>
        </div>
    );
};

export default CreateListing;
