'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { FaGraduationCap, FaArrowRight, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { MotionDiv } from '@/components/MotionWrapper';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(fullName, email, password);
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">

            {/* Left Side - Visual & Testimony */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-900 via-primary-900 to-purple-900 text-white relative overflow-hidden order-last">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 w-full flex justify-end">
                    <div className="flex items-center gap-3 text-2xl font-bold font-display tracking-tight">
                        <FaGraduationCap className="text-indigo-300" />
                        AI Counsellor
                    </div>
                </div>

                <div className="relative z-10 max-w-lg mx-auto text-center">
                    <h2 className="text-4xl font-bold leading-tight mb-6">
                        "Your dream university is just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">few clicks away</span>."
                    </h2>
                    <p className="text-lg text-indigo-100/80 mb-8 leading-relaxed">
                        Create your free profile today and get an AI-powered roadmap to your target schools.
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">95% Acceptance Rate for our users</span>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-indigo-200/50 text-right">
                    © 2027 AI Counsellor Inc.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
                <div className="absolute inset-0 bg-white dark:bg-slate-950"></div>

                <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Join us to start your free counselling session.
                        </p>
                    </div>



                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <FaUser />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm"
                                    placeholder="Create a strong password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg shadow-primary-900/20 hover:shadow-primary-900/30 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Get Started'} <FaArrowRight />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </MotionDiv>
            </div>
        </div>
    );
}
