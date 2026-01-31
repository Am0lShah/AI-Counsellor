'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { onboardingAPI } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaGraduationCap, FaPlaneDeparture, FaMoneyBillWave, FaFileAlt } from 'react-icons/fa';
import { MotionDiv } from '@/components/MotionWrapper';

export default function ProfilePage() {
    return (
        <ProtectedRoute requireOnboarding={true}>
            <Profile />
        </ProtectedRoute>
    );
}

function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState(null);
    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Singapore', 'Spain'];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await onboardingAPI.get();
            setFormData(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCountryToggle = (country) => {
        setFormData((prev) => ({
            ...prev,
            preferred_countries: prev.preferred_countries.includes(country)
                ? prev.preferred_countries.filter((c) => c !== country)
                : [...prev.preferred_countries, country],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);

        try {
            const submitData = {
                ...formData,
                gpa: formData.gpa ? parseFloat(formData.gpa) : null,
                ielts_score: formData.ielts_score ? parseFloat(formData.ielts_score) : null,
                toefl_score: formData.toefl_score ? parseInt(formData.toefl_score) : null,
                gre_score: formData.gre_score ? parseInt(formData.gre_score) : null,
                gmat_score: formData.gmat_score ? parseInt(formData.gmat_score) : null,
            };

            await onboardingAPI.submit(submitData);
            setSuccess(true);

            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                            <FaUserCircle className="text-4xl text-slate-400 dark:text-slate-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Edit Profile</h1>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">Refine your academic profile for better predictions</p>
                        </div>
                    </div>
                    <Link href="/dashboard" className="btn-secondary">
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Alerts */}
                {error && (
                    <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        ⚠️ {error}
                    </MotionDiv>
                )}

                {success && (
                    <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                        ✅ Profile updated successfully! Redirecting...
                    </MotionDiv>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Academic Background */}
                    <div className="card dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <FaGraduationCap className="text-xl text-primary-500" />
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Academic Background</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">GPA (out of 4.0)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData?.gpa || ''}
                                        onChange={(e) => handleChange('gpa', e.target.value)}
                                        className="input-field"
                                        placeholder="3.5"
                                        min="0"
                                        max="4"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Graduation Year</label>
                                    <input
                                        type="number"
                                        value={formData?.graduation_year || ''}
                                        onChange={(e) => handleChange('graduation_year', parseInt(e.target.value))}
                                        className="input-field"
                                        min="2000"
                                        max="2030"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Study Goals */}
                    <div className="card dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <FaPlaneDeparture className="text-xl text-blue-500" />
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Study Goals</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Field of Study</label>
                                <input
                                    type="text"
                                    value={formData?.field_of_study || ''}
                                    onChange={(e) => handleChange('field_of_study', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g. Computer Science, Data Science"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Preferred Countries</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {countries.map((country) => (
                                        <button
                                            key={country}
                                            type="button"
                                            onClick={() => handleCountryToggle(country)}
                                            className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${formData?.preferred_countries?.includes(country)
                                                ? 'bg-primary-600 border-primary-500 text-white shadow-md'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-700'
                                                }`}
                                        >
                                            {country}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Intake Year</label>
                                <input
                                    type="number"
                                    value={formData?.target_intake_year || ''}
                                    onChange={(e) => handleChange('target_intake_year', parseInt(e.target.value))}
                                    className="input-field"
                                    min={new Date().getFullYear()}
                                    max={new Date().getFullYear() + 5}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="card dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <FaMoneyBillWave className="text-xl text-green-500" />
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Budget & Funding</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Min Budget (USD/year)</label>
                                    <input
                                        type="number"
                                        value={formData?.budget_range_min || ''}
                                        onChange={(e) => handleChange('budget_range_min', parseInt(e.target.value))}
                                        className="input-field"
                                        step="1000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Budget (USD/year)</label>
                                    <input
                                        type="number"
                                        value={formData?.budget_range_max || ''}
                                        onChange={(e) => handleChange('budget_range_max', parseInt(e.target.value))}
                                        className="input-field"
                                        step="1000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Funding Type</label>
                                <select
                                    value={formData?.funding_type || 'self_funded'}
                                    onChange={(e) => handleChange('funding_type', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="self_funded">Self Funded</option>
                                    <option value="loan">Education Loan</option>
                                    <option value="scholarship">Scholarship Dependent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Exams */}
                    <div className="card dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <FaFileAlt className="text-xl text-purple-500" />
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Exams & Documents</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">IELTS Status</label>
                                    <select
                                        value={formData?.ielts_status || 'not_started'}
                                        onChange={(e) => handleChange('ielts_status', e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                {formData?.ielts_status === 'completed' && (
                                    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">IELTS Score</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={formData?.ielts_score || ''}
                                            onChange={(e) => handleChange('ielts_score', e.target.value)}
                                            className="input-field"
                                            min="0"
                                            max="9"
                                        />
                                    </MotionDiv>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">GRE Status</label>
                                    <select
                                        value={formData?.gre_status || 'not_started'}
                                        onChange={(e) => handleChange('gre_status', e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                {formData?.gre_status === 'completed' && (
                                    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">GRE Score</label>
                                        <input
                                            type="number"
                                            value={formData?.gre_score || ''}
                                            onChange={(e) => handleChange('gre_score', e.target.value)}
                                            className="input-field"
                                            min="260"
                                            max="340"
                                        />
                                    </MotionDiv>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">SOP Status</label>
                                <select
                                    value={formData?.sop_status || 'not_started'}
                                    onChange={(e) => handleChange('sop_status', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="draft">Draft</option>
                                    <option value="ready">Ready</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/dashboard" className="btn-secondary">
                            Cancel
                        </Link>
                        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50 min-w-[150px]">
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>

                {/* Warning */}
                <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 flex gap-3">
                    <span className="text-yellow-600 dark:text-yellow-500 text-xl">ℹ️</span>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                        <strong>Note:</strong> Updating your profile will trigger a recalculation of university recommendations and acceptance likelihoods. This may take a moment.
                    </p>
                </div>
            </MotionDiv>
        </div>
    );
}
