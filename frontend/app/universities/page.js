'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UniversityCard from '@/components/UniversityCard';
import { universityAPI } from '@/lib/api';
import Link from 'next/link';
import { FaFilter, FaUniversity, FaChartLine, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { MotionDiv } from '@/components/MotionWrapper';

export default function UniversitiesPage() {
    return (
        <ProtectedRoute requireOnboarding={true}>
            <Universities />
        </ProtectedRoute>
    );
}

function Universities() {
    const [tab, setTab] = useState('recommendations'); // recommendations, shortlisted, locked
    const [universities, setUniversities] = useState([]);
    const [shortlisted, setShortlisted] = useState([]);
    const [locked, setLocked] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [tab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (tab === 'recommendations') {
                const response = await universityAPI.getRecommendations();
                setUniversities(response.data);
            } else if (tab === 'shortlisted') {
                const response = await universityAPI.getShortlisted();
                setShortlisted(response.data);
            } else if (tab === 'locked') {
                const response = await universityAPI.getLocked();
                setLocked(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (university, category = 'target') => {
        try {
            await universityAPI.shortlist({ university_id: university.id, category });
            fetchData();
        } catch (error) {
            console.error('Failed to shortlist:', error);
            alert('Failed to shortlist university');
        }
    };

    const handleLock = async (universityId) => {
        if (!confirm('Locking this university will enable application guidance. Are you sure?')) {
            return;
        }

        try {
            await universityAPI.lock({ university_id: universityId });
            fetchData();
            alert('University locked successfully! You can now access application guidance.');
        } catch (error) {
            console.error('Failed to lock:', error);
            alert('Failed to lock university');
        }
    };

    const handleRemove = async (universityId) => {
        if (!confirm('Remove this university from your shortlist?')) {
            return;
        }

        try {
            await universityAPI.remove(universityId);
            fetchData();
        } catch (error) {
            console.error('Failed to remove:', error);
            alert('Failed to remove university');
        }
    };

    const handleUnlock = async (universityId) => {
        if (!confirm('WARNING: Unlocking will reset your application strategy for this university. Continue?')) {
            return;
        }

        try {
            await universityAPI.unlock(universityId);
            fetchData();
        } catch (error) {
            console.error('Failed to unlock:', error);
            alert('Failed to unlock university');
        }
    };

    const stats = {
        dream: shortlisted.filter(u => u.category === 'dream').length,
        target: shortlisted.filter(u => u.category === 'target').length,
        safe: shortlisted.filter(u => u.category === 'safe').length,
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-8 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
                                <FaUniversity className="text-primary-600" />
                                University Discovery
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl text-sm">
                                Explore AI-curated recommendations based on your profile, shortlist your favorites, and lock them to begin your application journey.
                            </p>
                        </div>
                        <Link href="/dashboard" className="btn-secondary text-sm self-start md:self-center">
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {/* Navigation & Stats Bar */}
                    <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                        {/* Tabs */}
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden self-stretch md:self-auto">
                            <button
                                onClick={() => setTab('recommendations')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'recommendations'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                AI Recommendations
                            </button>
                            <button
                                onClick={() => setTab('shortlisted')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === 'shortlisted'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                Shortlist
                                {shortlisted.length > 0 && (
                                    <span className="bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded text-[10px]">{shortlisted.length}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setTab('locked')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === 'locked'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                Locked
                                {locked.length > 0 && (
                                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px]">{locked.length}</span>
                                )}
                            </button>
                        </div>

                        {/* Mini Stats Dashboard */}
                        {tab === 'shortlisted' && shortlisted.length > 0 && (
                            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl hidden md:flex">
                                <div className="px-4 py-2 bg-white dark:bg-slate-700 rounded-lg flex flex-col items-center min-w-[80px]">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Dream</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.dream}</span>
                                </div>
                                <div className="px-4 py-2 bg-white dark:bg-slate-700 rounded-lg flex flex-col items-center min-w-[80px]">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Target</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.target}</span>
                                </div>
                                <div className="px-4 py-2 bg-white dark:bg-slate-700 rounded-lg flex flex-col items-center min-w-[80px]">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Safe</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.safe}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaUniversity className="text-slate-300 dark:text-slate-700 text-xl" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <MotionDiv
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Recommendations Tab */}
                        {tab === 'recommendations' && (
                            <div>
                                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/10 dark:to-indigo-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/20">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">AI-Powered Matches</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            We've analyzed your profile against millions of data points to find your best fit universities.
                                        </p>
                                    </div>
                                    <div className="flex gap-2 text-xs font-medium">
                                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-purple-600 dark:text-purple-400">Dream (Reach)</span>
                                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-blue-600 dark:text-blue-400">Target (Match)</span>
                                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400">Safe (Likely)</span>
                                    </div>
                                </div>

                                {universities.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full mb-6 text-4xl">🎓</div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Recommendations Yet</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                            Our AI needs a bit more info to find your perfect match. Chat with the Counsellor to get started!
                                        </p>
                                        <Link href="/counsellor" className="btn-primary">
                                            Talk to AI Counsellor
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {universities.map((rec, i) => (
                                            <MotionDiv
                                                key={rec.university.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <UniversityCard
                                                    university={rec.university}
                                                    userUniversity={{
                                                        category: rec.category,
                                                        acceptance_likelihood: rec.acceptance_likelihood,
                                                        fit_reason: rec.fit_reason,
                                                        risk_factors: rec.risk_factors,
                                                    }}
                                                    onShortlist={(uni) => handleShortlist(uni, rec.category)}
                                                />
                                            </MotionDiv>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Shortlisted Tab */}
                        {tab === 'shortlisted' && (
                            <div>
                                {shortlisted.length === 0 ? (
                                    <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white dark:bg-slate-800 rounded-full mb-6 shadow-sm">
                                            <FaLock className="text-slate-300 dark:text-slate-600 text-3xl" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your Shortlist is Empty</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
                                            Go to Recommendations and find universities that spark your interest.
                                        </p>
                                        <button onClick={() => setTab('recommendations')} className="btn-primary py-3 px-8 text-lg">
                                            Find Universities
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {shortlisted.map((userUni, i) => (
                                            <MotionDiv
                                                key={userUni.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <UniversityCard
                                                    university={userUni.university}
                                                    userUniversity={userUni}
                                                    onLock={handleLock}
                                                    onRemove={handleRemove}
                                                />
                                            </MotionDiv>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Locked Tab */}
                        {tab === 'locked' && (
                            <div>
                                {locked.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full mb-6 text-4xl">🔐</div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Locked Universities</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                                            Locking a university signals you are ready to apply.
                                        </p>
                                        <button onClick={() => setTab('shortlisted')} className="btn-primary">
                                            Go to Shortlist
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-8 flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-bold text-xl">✓</div>
                                            <div>
                                                <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">Application Mode Active</h4>
                                                <p className="text-emerald-700 dark:text-emerald-400 mt-1 mb-3">
                                                    You have locked {locked.length} universities. Our AI has generated a personalized <span className="font-semibold">Action Plan</span> for each.
                                                </p>
                                                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-200 hover:underline">
                                                    Go to Dashboard to see tasks →
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {locked.map((userUni, i) => (
                                                <MotionDiv
                                                    key={userUni.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="relative group"
                                                >
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur"></div>
                                                    <div className="relative">
                                                        <UniversityCard
                                                            university={userUni.university}
                                                            userUniversity={userUni}
                                                        />
                                                        <button
                                                            onClick={() => handleUnlock(userUni.university_id)}
                                                            className="w-full mt-3 px-4 py-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-800 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2"
                                                        >
                                                            <FaExclamationTriangle /> Unlock (Resets Strategy)
                                                        </button>
                                                    </div>
                                                </MotionDiv>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </MotionDiv>
                )}
            </div>
        </div>
    );
}
