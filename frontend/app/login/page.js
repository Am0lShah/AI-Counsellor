'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { FaGraduationCap, FaArrowRight, FaEnvelope, FaLock } from 'react-icons/fa';
import { MotionDiv } from '@/components/MotionWrapper';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">

            {/* Left Side - Visual & Testimony */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-2xl font-bold font-display tracking-tight">
                        <FaGraduationCap className="text-primary-300" />
                        AI Counsellor
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold leading-tight mb-6">
                        "The smartest way to plan your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-blue-200">study abroad journey</span>."
                    </h2>
                    <p className="text-lg text-blue-100/80 mb-8 leading-relaxed">
                        Join thousands of students who have found their dream university using our AI-driven guidance platform.
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-900 bg-slate-700 overflow-hidden">
                                    {/* Placeholder avatars (colored divs) */}
                                    <div className={`w-full h-full bg-gradient-to-br from-indigo-${i}00 to-purple-${i}00 opacity-80`}></div>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-medium text-white">
                            <span className="font-bold">2,000+</span> students joined
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-blue-200/50">
                    © 2027 AI Counsellor Inc.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
                <div className="absolute inset-0 bg-white dark:bg-slate-950"></div>

                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Please enter your details to sign in.
                        </p>
                    </div>



                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                ⚠️ {error}
                            </div>
                        )}

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
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all sm:text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg shadow-primary-900/20 hover:shadow-primary-900/30 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'} <FaArrowRight />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Create free account
                        </Link>
                    </p>
                </MotionDiv>
            </div>
        </div>
    );
}
