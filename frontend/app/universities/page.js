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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-slate-900 border-b border-white/10 text-white pt-8 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3">
                                <FaUniversity className="text-primary-400" />
                                University Discovery
                            </h1>
                            <p className="text-slate-400 dark:text-slate-300 mt-2 max-w-xl">
                                Explore AI-curated recommendations based on your profile, shortlist your favorites, and lock them to begin your application journey.
                            </p>
                        </div>
                        <Link href="/dashboard" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-md self-start md:self-center">
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <button
                            onClick={() => setTab('recommendations')}
                            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all border ${tab === 'recommendations'
                                ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/50'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            AI Recommendations
                        </button>
                        <button
                            onClick={() => setTab('shortlisted')}
                            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all border ${tab === 'shortlisted'
                                ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/50'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Shortlisted ({shortlisted.length})
                        </button>
                        <button
                            onClick={() => setTab('locked')}
                            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all border ${tab === 'locked'
                                ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/50'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Locked ({locked.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
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
                                <div className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 backdrop-blur-sm">
                                    <FaChartLine className="text-primary-500" />
                                    <p className="text-sm">
                                        Categorized into <span className="font-bold text-purple-600 dark:text-purple-300">Dream</span> (reach), <span className="font-bold text-blue-600 dark:text-blue-300">Target</span> (match), and <span className="font-bold text-emerald-600 dark:text-emerald-300">Safe</span> (likely) based on your profile stats.
                                    </p>
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
                                    <div className="grid md:grid-cols-2 gap-6">
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
                                <div className="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 backdrop-blur-sm">
                                    <FaLock className="text-primary-500" />
                                    <p className="text-sm">
                                        Lock a university to unlock its tailored <span className="font-semibold text-slate-900 dark:text-slate-200">Application Action Plan</span> and guidance.
                                    </p>
                                </div>

                                {shortlisted.length === 0 ? (
                                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full mb-6 text-4xl">📝</div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your Shortlist is Empty</h3>
                                        <p className="text-slate-500 dark:text-slate-300 mb-6">
                                            Browse recommendations and save the ones you like.
                                        </p>
                                        <button onClick={() => setTab('recommendations')} className="btn-primary">
                                            Browse Recommendations
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
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
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 flex items-start gap-3">
                                            <div className="text-emerald-600 dark:text-emerald-400 mt-0.5 text-lg">✓</div>
                                            <div>
                                                <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Application Guidance Active</h4>
                                                <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">
                                                    Check your <Link href="/dashboard" className="underline font-medium hover:text-emerald-800 dark:hover:text-emerald-200">Dashboard</Link> for personalized tasks, deadlines, and essay topics for these universities.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
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
                                                            className="w-full mt-3 px-4 py-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-800 text-xs font-medium uppercase tracking-wide flex items-center justify-center gap-2"
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
