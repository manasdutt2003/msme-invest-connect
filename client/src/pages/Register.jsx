import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'investor' // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/auth/register', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-10 px-4">
            {/* Background Decor */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-secondary opacity-20 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-slate-400">Join the next generation of investing</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                placeholder="Create a strong password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">I am a...</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`cursor-pointer text-center p-3 rounded-xl border transition-all ${formData.role === 'investor' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-slate-900/50 text-slate-400 border-white/10 hover:bg-slate-800'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="investor"
                                        checked={formData.role === 'investor'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="font-semibold">Investor</span>
                                </label>
                                <label className={`cursor-pointer text-center p-3 rounded-xl border transition-all ${formData.role === 'msme' ? 'bg-brand-secondary text-white border-brand-secondary' : 'bg-slate-900/50 text-slate-400 border-white/10 hover:bg-slate-800'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="msme"
                                        checked={formData.role === 'msme'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="font-semibold">Business Owner</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/25 hover:-translate-y-0.5 transition-all duration-200 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-accent hover:text-white font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
