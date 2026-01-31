'use client';

import { FaUniversity, FaGlobeAmericas, FaDollarSign, FaChartLine } from 'react-icons/fa';

export default function UniversityCard({ university, userUniversity, onShortlist, onLock, onRemove }) {
    const isShortlisted = !!userUniversity;
    const isLocked = userUniversity?.status === 'locked';

    // Map likelihood to percentage for the visual
    const getProbability = (likelihood) => {
        const map = {
            high: 85,
            medium: 55,
            low: 25,
        };
        return map[likelihood] || 40; // Default
    };

    const probability = userUniversity ? getProbability(userUniversity.acceptance_likelihood) : 0;

    // Color based on probability
    const getProbabilityColor = (prob) => {
        if (prob >= 75) return 'text-emerald-500';
        if (prob >= 40) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getProbabilityBg = (prob) => {
        if (prob >= 75) return 'text-emerald-500/20';
        if (prob >= 40) return 'text-amber-500/20';
        return 'text-rose-500/20';
    }

    const getCategoryStyles = (category) => {
        const styles = {
            dream: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
            target: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
            safe: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
        };
        return styles[category] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    };

    const getCostDisplay = () => {
        if (university.estimated_cost_min && university.estimated_cost_max) {
            return `$${(university.estimated_cost_min / 1000).toFixed(0)}k - $${(university.estimated_cost_max / 1000).toFixed(0)}k`;
        }
        return 'Cost varies';
    };

    return (
        <div className={`card relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isLocked ? 'ring-2 ring-emerald-500/50' : ''}`}>
            {/* Top accent */}
            {userUniversity && (
                <div className={`absolute top-0 left-0 right-0 h-1 ${userUniversity.category === 'dream' ? 'bg-purple-500' :
                        userUniversity.category === 'target' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`} />
            )}

            <div className="p-6">
                {/* Header & Badges */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {userUniversity && (
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getCategoryStyles(userUniversity.category)}`}>
                                    {userUniversity.category}
                                </span>
                            )}
                            {university.ranking && (
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                                    #{university.ranking} Ranked
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">{university.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <FaGlobeAmericas size={12} />
                            <span>{university.country}</span>
                            <span>•</span>
                            <span>{university.degree_type}</span>
                        </div>
                    </div>

                    {/* AI Probability Score Visual */}
                    {userUniversity && (
                        <div className="flex flex-col items-center ml-4">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                                {/* Background Circle */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        className={getProbabilityBg(probability)}
                                    />
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="24"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        strokeDasharray={151} // 2 * pi * 24
                                        strokeDashoffset={151 - (151 * probability) / 100}
                                        className={`${getProbabilityColor(probability)} transition-all duration-1000 ease-out`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className={`text-sm font-bold ${getProbabilityColor(probability)}`}>
                                        {probability}%
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 mt-1">Chance</span>
                        </div>
                    )}
                </div>

                {/* Info Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 dark:border-slate-800">
                            <FaDollarSign size={12} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wide">Tuition</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{getCostDisplay()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-slate-800">
                            <FaChartLine size={12} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wide">Competition</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{university.competitiveness || 'Moderate'}</span>
                        </div>
                    </div>
                </div>

                {/* AI Insights - Compact */}
                {userUniversity && (userUniversity.fit_reason || userUniversity.risk_factors) && (
                    <div className="text-xs space-y-2 mb-5">
                        {userUniversity.fit_reason && (
                            <div className="flex gap-2 text-slate-600 dark:text-slate-400">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span className="line-clamp-2">{userUniversity.fit_reason}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="pt-2">
                    {!isShortlisted && onShortlist && (
                        <button onClick={() => onShortlist(university)} className="btn-primary w-full shadow-lg shadow-primary-500/20">
                            Add to Shortlist
                        </button>
                    )}

                    {isShortlisted && !isLocked && onLock && (
                        <button onClick={() => onLock(userUniversity.university_id)} className="w-full group/btn relative overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-xl shadow-slate-900/10 active:scale-[0.98]">
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                <span className="group-hover/btn:hidden">Lock & Apply</span>
                                <span className="hidden group-hover/btn:inline-flex items-center gap-2">Start Journey →</span>
                            </div>
                        </button>
                    )}

                    {isLocked && (
                        <div className="w-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-center font-bold text-sm border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2">
                            ✓ University Locked
                        </div>
                    )}

                    {isShortlisted && !isLocked && onRemove && (
                        <div className="mt-3 text-center">
                            <button
                                onClick={() => onRemove(userUniversity.university_id)}
                                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                            >
                                Remove from list
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
