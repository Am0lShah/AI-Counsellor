'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { onboardingAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
    return (
        <ProtectedRoute requireOnboarding={false}>
            <OnboardingForm />
        </ProtectedRoute>
    );
}

function OnboardingForm() {
    const router = useRouter();
    const { setOnboardingComplete } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        education_level: '',
        degree: '',
        major: '',
        graduation_year: new Date().getFullYear(),
        gpa: '',
        intended_degree: 'masters',
        field_of_study: '',
        target_intake_year: new Date().getFullYear() + 1,
        preferred_countries: [],
        budget_range_min: 10000,
        budget_range_max: 50000,
        funding_type: 'self_funded',
        ielts_status: 'not_started',
        ielts_score: '',
        toefl_status: 'not_started',
        toefl_score: '',
        gre_status: 'not_started',
        gre_score: '',
        gmat_status: 'not_started',
        gmat_score: '',
        sop_status: 'not_started',
    });

    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Singapore', 'Spain'];

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

    const handleSubmit = async () => {
        if (formData.preferred_countries.length === 0) {
            setError('Please select at least one preferred country');
            return;
        }

        setLoading(true);
        setError('');

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
            setOnboardingComplete(true);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Complete Your Profile</h1>
                    <p className="text-slate-600">This helps us provide personalized recommendations</p>
                </div>

                {/* Progress */}
                <div className="card p-6 mb-6">
                    <div className="flex justify-between mb-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 text-center text-sm font-medium ${s <= step ? 'text-primary-700' : 'text-slate-400'
                                    }`}
                            >
                                Step {s}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-primary-600' : 'bg-slate-200'
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Form Steps */}
                <div className="card p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Academic Background</h2>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Education Level</label>
                                <input
                                    type="text"
                                    value={formData.education_level}
                                    onChange={(e) => handleChange('education_level', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Bachelor's"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Degree</label>
                                    <input
                                        type="text"
                                        value={formData.degree}
                                        onChange={(e) => handleChange('degree', e.target.value)}
                                        className="input-field"
                                        placeholder="e.g., B.Tech"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Major</label>
                                    <input
                                        type="text"
                                        value={formData.major}
                                        onChange={(e) => handleChange('major', e.target.value)}
                                        className="input-field"
                                        placeholder="e.g., Computer Science"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Graduation Year</label>
                                    <input
                                        type="number"
                                        value={formData.graduation_year}
                                        onChange={(e) => handleChange('graduation_year', parseInt(e.target.value))}
                                        className="input-field"
                                        min="2000"
                                        max="2030"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">GPA (Optional)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.gpa}
                                        onChange={(e) => handleChange('gpa', e.target.value)}
                                        className="input-field"
                                        placeholder="e.g., 3.5"
                                        min="0"
                                        max="4"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Study Goals</h2>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Intended Degree</label>
                                <select
                                    value={formData.intended_degree}
                                    onChange={(e) => handleChange('intended_degree', e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="bachelors">Bachelor's</option>
                                    <option value="masters">Master's</option>
                                    <option value="mba">MBA</option>
                                    <option value="phd">PhD</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Field of Study</label>
                                <input
                                    type="text"
                                    value={formData.field_of_study}
                                    onChange={(e) => handleChange('field_of_study', e.target.value)}
                                    className="input-field"
                                    placeholder="e.g., Computer Science"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Target Intake Year</label>
                                <input
                                    type="number"
                                    value={formData.target_intake_year}
                                    onChange={(e) => handleChange('target_intake_year', parseInt(e.target.value))}
                                    className="input-field"
                                    min={new Date().getFullYear()}
                                    max={new Date().getFullYear() + 5}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Preferred Countries</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {countries.map((country) => (
                                        <button
                                            key={country}
                                            type="button"
                                            onClick={() => handleCountryToggle(country)}
                                            className={`px-4 py-2 rounded-lg border-2 transition-all ${formData.preferred_countries.includes(country)
                                                    ? 'bg-primary-600 text-white border-primary-600'
                                                    : 'bg-white text-slate-700 border-slate-300 hover:border-primary-400'
                                                }`}
                                        >
                                            {country}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Budget Planning</h2>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Annual Budget Range (USD)</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="number"
                                            value={formData.budget_range_min}
                                            onChange={(e) => handleChange('budget_range_min', parseInt(e.target.value))}
                                            className="input-field"
                                            placeholder="Min"
                                            step="1000"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            value={formData.budget_range_max}
                                            onChange={(e) => handleChange('budget_range_max', parseInt(e.target.value))}
                                            className="input-field"
                                            placeholder="Max"
                                            step="1000"
                                            required
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">
                                    Budget: ${formData.budget_range_min.toLocaleString()} - $
                                    {formData.budget_range_max.toLocaleString()} per year
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Funding Type</label>
                                <select
                                    value={formData.funding_type}
                                    onChange={(e) => handleChange('funding_type', e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="self_funded">Self Funded</option>
                                    <option value="loan">Education Loan</option>
                                    <option value="scholarship">Scholarship Dependent</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Exams & SOP Readiness</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">IELTS Status</label>
                                    <select
                                        value={formData.ielts_status}
                                        onChange={(e) => handleChange('ielts_status', e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                {formData.ielts_status === 'completed' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">IELTS Score</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={formData.ielts_score}
                                            onChange={(e) => handleChange('ielts_score', e.target.value)}
                                            className="input-field"
                                            placeholder="7.5"
                                            min="0"
                                            max="9"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">GRE Status</label>
                                    <select
                                        value={formData.gre_status}
                                        onChange={(e) => handleChange('gre_status', e.target.value)}
                                        className="input-field"
                                    >
                                        <option value="not_started">Not Started</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>

                                {formData.gre_status === 'completed' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">GRE Score</label>
                                        <input
                                            type="number"
                                            value={formData.gre_score}
                                            onChange={(e) => handleChange('gre_score', e.target.value)}
                                            className="input-field"
                                            placeholder="320"
                                            min="260"
                                            max="340"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">SOP Status</label>
                                <select
                                    value={formData.sop_status}
                                    onChange={(e) => handleChange('sop_status', e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="draft">Draft</option>
                                    <option value="ready">Ready</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        {step > 1 && (
                            <button onClick={prevStep} className="btn-secondary">
                                Previous
                            </button>
                        )}

                        <div className="flex-1"></div>

                        {step < 4 ? (
                            <button onClick={nextStep} className="btn-primary">
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Complete Onboarding'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
