'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileStrength from '@/components/ProfileStrength';
import StageIndicator from '@/components/StageIndicator';
import TodoList from '@/components/TodoList';
import { dashboardAPI } from '@/lib/api';
import Link from 'next/link';
import { FaRobot, FaUniversity, FaTasks, FaUser, FaSignOutAlt, FaRocket, FaArrowRight, FaMagic } from 'react-icons/fa';
import { useAuth } from '@/components/AuthProvider';
import Gamification from '@/components/Gamification';
import ApplicationGuidance from '@/components/ApplicationGuidance';

export default function DashboardPage() {
    return (
        <ProtectedRoute requireOnboarding={true}>
            <Dashboard />
        </ProtectedRoute>
    );
}

function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await dashboardAPI.get();
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-96 bg-slate-900 -z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-slate-900"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 text-white pt-8 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold font-display tracking-tight text-white">Student Dashboard</h1>
                            <p className="text-slate-400 dark:text-slate-300 mt-1">Manage your applications and track progress</p>
                        </div>
                        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-sm font-medium transition-all">
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16">
                {/* Navigation Pills */}
                <div className="glass-panel rounded-2xl p-2 mb-8 inline-flex gap-2 mx-auto sm:mx-0 overflow-x-auto max-w-full">
                    {[
                        { name: 'Dashboard', icon: FaTasks, href: '/dashboard', active: true },
                        { name: 'AI Counsellor', icon: FaRobot, href: '/counsellor' },
                        { name: 'Universities', icon: FaUniversity, href: '/universities' },
                        { name: 'Profile', icon: FaUser, href: '/profile' }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-2 transition-all ${item.active
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className={item.active ? 'text-white' : 'text-slate-400'} />
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8 pb-12">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stage Indicator */}
                        <div className="card border-0 shadow-lg shadow-slate-200/50">
                            <StageIndicator
                                currentStage={data?.stage_info.current_stage}
                                stageName={data?.stage_info.stage_name}
                                stageDescription={data?.stage_info.stage_description}
                            />
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="card hover:border-primary-200 group">
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">{data?.shortlisted_count || 0}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Shortlisted Unis</div>
                            </div>
                            <div className="card hover:border-green-200 group">
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-green-600 transition-colors">{data?.locked_count || 0}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Locked Unis</div>
                            </div>
                            <div className="card hover:border-blue-200 group">
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                                    {data?.todos?.filter(t => !t.is_complete).length || 0}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pending Tasks</div>
                            </div>
                        </div>

                        {/* Next Action */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-blue-700 p-8 text-white shadow-xl shadow-primary-900/20">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FaRocket className="text-9xl" />
                            </div>
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-4 backdrop-blur-sm border border-white/20">Recommended Step</span>
                                <h3 className="text-2xl font-bold mb-2">Next Priority Action</h3>
                                <p className="text-blue-100 mb-6 max-w-lg text-lg leading-relaxed">{data?.stage_info.next_action}</p>
                                <Link href="/counsellor" className="btn-primary bg-white text-primary-700 hover:bg-slate-50 border-0 shadow-none">
                                    Start Action <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Application Guidance (Stage 4 only) */}
                        {data?.stage_info.current_stage === 4 && (
                            <div className="mb-6">
                                <ApplicationGuidance />
                            </div>
                        )}

                        {/* Todos */}
                        <div className="card dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <FaTasks />
                                    </div>
                                    Your Tasks
                                </h3>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {data?.todos?.filter(t => !t.is_complete).length} remaining
                                </span>
                            </div>
                            <TodoList todos={data?.todos || []} onUpdate={fetchDashboard} />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Gamification */}
                        <div className="mb-6">
                            <Gamification actionsCompleted={(data?.shortlisted_count || 0) + (data?.locked_count || 0) * 2 + (data?.todos?.filter(t => t.is_complete).length || 0)} />
                        </div>

                        {/* Profile Strength */}
                        {data?.profile_strength && <ProfileStrength strength={data.profile_strength} />}

                        {/* Quick Actions */}
                        <div className="card dark:bg-slate-900 dark:border-slate-800">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 px-2">Quick Shortcuts</h3>
                            <div className="space-y-3">
                                <Link href="/sop" className="group flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl hover:shadow-md hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 border border-purple-100 dark:border-purple-800/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm group-hover:scale-110 transition-transform">
                                            <FaMagic />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 block">AI SOP Guardian</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Analyze your essay instantly</span>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-purple-300 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all" />
                                </Link>

                                <Link href="/counsellor" className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-slate-100 dark:border-slate-700 hover:border-primary-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm group-hover:scale-110 transition-transform">
                                            <FaRobot />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-700 dark:group-hover:text-primary-300">Chat with AI</span>
                                    </div>
                                    <FaArrowRight className="text-slate-300 group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/universities" className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-100 dark:border-slate-700 hover:border-blue-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform">
                                            <FaUniversity />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">Explore Unis</span>
                                    </div>
                                    <FaArrowRight className="text-slate-300 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                                </Link>
                                <Link href="/profile" className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 border border-slate-100 dark:border-slate-700 hover:border-green-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm group-hover:scale-110 transition-transform">
                                            <FaUser />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-green-700 dark:group-hover:text-green-300">Edit Profile</span>
                                    </div>
                                    <FaArrowRight className="text-slate-300 group-hover:text-green-400 transform group-hover:translate-x-1 transition-all" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
