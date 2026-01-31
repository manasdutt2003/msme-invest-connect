import React, { useState } from 'react';
import api from '../api/axios';

const CreateListing = ({ onListingCreated }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        sector: '',
        fundingGoal: '',
        returnsPercentage: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { businessName, description, sector, fundingGoal, returnsPercentage } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/companies', formData);
            if (onListingCreated) onListingCreated(res.data);
            alert('Business Listed Successfully!');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create Your Business Listing</h3>
            {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm mb-6">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        value={businessName}
                        onChange={onChange}
                        required
                        className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        required
                        className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow shadow-sm"
                        rows="3"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                    <select
                        name="sector"
                        value={sector}
                        onChange={onChange}
                        required
                        className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow shadow-sm"
                    >
                        <option value="">Select Sector</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Energy">Energy</option>
                        <option value="Automotive">Automotive</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal (sw)</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                            type="number"
                            name="fundingGoal"
                            value={fundingGoal}
                            onChange={onChange}
                            required
                            className="appearance-none rounded-lg block w-full pl-7 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow shadow-sm"
                            min="10000"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Returns Percentage (%)</label>
                    <input
                        type="number"
                        name="returnsPercentage"
                        value={returnsPercentage}
                        onChange={onChange}
                        required
                        className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-shadow shadow-sm"
                        min="1"
                        max="100"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'List Business'}
                </button>
            </form>
        </div>
    );
};

export default CreateListing;
