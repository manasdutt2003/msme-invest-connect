import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const DocumentVault = ({ user }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedLogs, setSelectedLogs] = useState(null); // For showing logs modal
    const [shareModalDoc, setShareModalDoc] = useState(null); // For showing share modal
    const [investorIdToShare, setInvestorIdToShare] = useState('');

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/documents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', 'Uploaded via Vault');

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            fetchDocuments(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (docId, filename) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/documents/${docId}/download`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob' // Important
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Download failed or access denied');
        }
    };

    const handleShare = async () => {
        // Mock share - simply taking an input ID for now. 
        // In real app, we would have a dropdown of investors.
        if (!investorIdToShare) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('/documents/share', {
                documentId: shareModalDoc._id,
                investorId: investorIdToShare
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShareModalDoc(null);
            setInvestorIdToShare('');
            alert('Document Shared Successfully');
        } catch (err) {
            console.error(err);
            alert('Share failed');
        }
    };

    const handleViewLogs = async (doc) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/documents/${doc._id}/logs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedLogs({ docName: doc.originalName, logs: res.data });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Document Vault 🔐</h2>
                    <p className="text-sm text-slate-400">Securely store and share audit-trailed files.</p>
                </div>
                {user.role === 'msme' && (
                    <div className="relative">
                        <input
                            type="file"
                            id="vault-upload"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="vault-upload"
                            className={`px-4 py-2 bg-brand-primary rounded-lg text-white text-sm font-medium cursor-pointer hover:bg-brand-secondary transition-colors ${uploading ? 'opacity-50' : ''}`}
                        >
                            {uploading ? 'Uploading...' : '+ Upload Document'}
                        </label>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-8">Loading vault...</div>
            ) : documents.length === 0 ? (
                <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-700 rounded-xl">
                    <p>No documents found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {documents.map(doc => (
                        <div key={doc._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
                                    📄
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{doc.originalName}</h4>
                                    <p className="text-xs text-slate-400">
                                        {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}
                                        {user.role !== 'msme' && ` • By ${doc.owner?.name}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                                <button
                                    onClick={() => handleDownload(doc._id, doc.originalName)}
                                    className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white transition-colors"
                                >
                                    Download
                                </button>

                                {user.role === 'msme' && (
                                    <>
                                        <button
                                            onClick={() => setShareModalDoc(doc)}
                                            className="flex-1 sm:flex-none px-3 py-1.5 bg-brand-accent/20 text-brand-accent hover:bg-brand-accent/30 rounded text-xs transition-colors border border-brand-accent/20"
                                        >
                                            Share
                                        </button>
                                        <button
                                            onClick={() => handleViewLogs(doc)}
                                            className="flex-1 sm:flex-none px-3 py-1.5 text-slate-400 hover:text-white text-xs transition-colors"
                                        >
                                            History
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Share Modal */}
            {shareModalDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-white mb-4">Share "{shareModalDoc.originalName}"</h3>
                        <p className="text-sm text-slate-400 mb-4">Enter Investor ID to grant access.</p>
                        <input
                            type="text"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:border-brand-primary"
                            placeholder="Investor User ID"
                            value={investorIdToShare}
                            onChange={(e) => setInvestorIdToShare(e.target.value)}
                        />
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShareModalDoc(null)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
                            <button onClick={handleShare} className="px-4 py-2 bg-brand-primary rounded-lg text-white text-sm">Share Access</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logs Modal */}
            {selectedLogs && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Audit Log: {selectedLogs.docName}</h3>
                            <button onClick={() => setSelectedLogs(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="space-y-4">
                            {selectedLogs.logs.length === 0 ? (
                                <p className="text-slate-500 text-sm">No activity recorded yet.</p>
                            ) : (
                                selectedLogs.logs.map((log, i) => (
                                    <div key={i} className="flex items-start space-x-3 text-sm pb-3 border-b border-white/5 last:border-0">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full ${log.action === 'DOWNLOAD' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="text-white">
                                                <span className="font-bold">{log.viewer?.name || 'Unknown User'}</span>
                                                <span className="text-slate-400"> {log.action.toLowerCase()}ed this file.</span>
                                            </p>
                                            <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                                            {log.details && <p className="text-xs text-slate-500 mt-1 italic">{log.details}</p>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentVault;
