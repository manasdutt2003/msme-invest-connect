import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const KYCVerification = () => {
    const [status, setStatus] = useState('unverified');
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('pan');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/verification/status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus(res.data.verificationStatus);
        } catch (err) {
            console.error("Error fetching KYC status", err);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('document', file);
        formData.append('docType', docType);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/verification/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(res.data.message);
            setStatus(res.data.status);
            // Poll for status update or rely on mock timeout on server side
            // For better UX, we could set a timeout to re-fetch status in 6s
            setTimeout(fetchStatus, 6000);

        } catch (err) {
            setMessage(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        switch (status) {
            case 'verified':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">Verified</span>;
            case 'pending':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending Review</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">Rejected</span>;
            default:
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">Unverified</span>;
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Identity Verification</h2>
                    <p className="text-slate-400 text-sm mt-1">Complete KYC to unlock full platform access.</p>
                </div>
                {getStatusBadge()}
            </div>

            {status === 'unverified' || status === 'rejected' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {message && <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{message}</div>}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Document Type</label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="pan">PAN Card</option>
                            <option value="udyam">Udyam Registration</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Upload Document</label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-brand-primary/10 file:text-brand-primary
                                hover:file:bg-brand-primary/20
                                cursor-pointer"
                        />
                        <p className="text-xs text-slate-500 mt-1">Supported: JPG, PNG, PDF (Max 5MB)</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 rounded-lg bg-brand-primary text-white font-bold hover:bg-brand-secondary transition-all disabled:opacity-70 mt-2 flex justify-center items-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : 'Submit for Verification'}
                    </button>
                </form>
            ) : (
                <div className="text-slate-300 text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                    {status === 'verified' && (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <p className="font-bold text-white">Account Verified</p>
                                <p className="text-xs">You have full access to all features.</p>
                            </div>
                        </div>
                    )}
                    {status === 'pending' && (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="font-bold text-white">Verification in Progress</p>
                                <p className="text-xs">We are reviewing your documents. This usually takes 24-48 hours.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KYCVerification;
