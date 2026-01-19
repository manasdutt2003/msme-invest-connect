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
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h3>Create Your Business Listing</h3>
            {error && <div className="error-alert" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        value={businessName}
                        onChange={onChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        required
                        className="form-control"
                        rows="3"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Sector</label>
                    <select name="sector" value={sector} onChange={onChange} required className="form-control">
                        <option value="">Select Sector</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Energy">Energy</option>
                        <option value="Automotive">Automotive</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Funding Goal (₹)</label>
                    <input
                        type="number"
                        name="fundingGoal"
                        value={fundingGoal}
                        onChange={onChange}
                        required
                        className="form-control"
                        min="10000"
                    />
                </div>
                <div className="form-group">
                    <label>Returns Percentage (%)</label>
                    <input
                        type="number"
                        name="returnsPercentage"
                        value={returnsPercentage}
                        onChange={onChange}
                        required
                        className="form-control"
                        min="1"
                        max="100"
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
                    {loading ? 'Creating...' : 'List Business'}
                </button>
            </form>
        </div>
    );
};

export default CreateListing;
