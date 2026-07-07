import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const InvestmentWizard = ({ company, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [equity, setEquity] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNext = async (status) => {
        setLoading(true);
        // Simulate API call for each step
        try {
            // Call parent function to update backend status
            await onComplete(status, { amount, equity });

            if (step < 3) {
                setStep(step + 1);
            } else {
                onClose(); // Finished
            }
        } catch (error) {
            console.error("Step failed", error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Invest in {company.businessName}</h2>
                        <div className="flex space-x-2 mt-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1 w-8 rounded-full ${step >= i ? 'bg-brand-primary' : 'bg-slate-700'}`}></div>
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-brand-primary/10 rounded-xl border border-brand-primary/20 text-brand-primary">
                                    <h4 className="font-bold mb-1">Step 1: Express Interest</h4>
                                    <p className="text-sm">Signaling interest alerts the founder and locks your intent to evaluate this opportunity.</p>
                                </div>
                                <button
                                    onClick={() => handleNext('INTERESTED')}
                                    disabled={loading}
                                    className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition-all"
                                >
                                    {loading ? 'Processing...' : 'Confirm Interest'}
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                                    <h4 className="font-bold mb-1">Step 2: Due Diligence</h4>
                                    <p className="text-sm">Request access to the Document Vault and private financial records.</p>
                                </div>
                                <p className="text-slate-400 text-sm">By proceeding, you agree to the Non-Disclosure Agreement (NDA).</p>
                                <button
                                    onClick={() => handleNext('DUE_DILIGENCE')}
                                    disabled={loading}
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all"
                                >
                                    {loading ? 'Processing...' : 'Request Documents'}
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 text-green-400">
                                    <h4 className="font-bold mb-1">Step 3: Term Sheet</h4>
                                    <p className="text-sm">Propose your investment terms.</p>
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Investment Amount ($)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                                        placeholder="50000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Equity or Interest (%)</label>
                                    <input
                                        type="number"
                                        value={equity}
                                        onChange={(e) => setEquity(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                                        placeholder="5.0"
                                    />
                                </div>

                                <button
                                    onClick={() => handleNext('TERM_SHEET')}
                                    disabled={loading || !amount || !equity}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Term Sheet'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default InvestmentWizard;
