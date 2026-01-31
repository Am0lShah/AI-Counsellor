'use client';

import { FaUniversity, FaGlobeAmericas, FaDollarSign, FaChartLine } from 'react-icons/fa';

export default function UniversityCard({ university, userUniversity, onShortlist, onLock, onRemove }) {
    const isShortlisted = !!userUniversity;
    const isLocked = userUniversity?.status === 'locked';

    const getCategoryBadge = (category) => {
        const styles = {
            dream: 'badge-dream',
            target: 'badge-target',
            safe: 'badge-safe',
        };
        return styles[category] || '';
    };

    const getAcceptanceBadge = (likelihood) => {
        const styles = {
            high: 'badge-high',
            medium: 'badge-medium',
            low: 'badge-low',
        };
        return styles[likelihood] || '';
    };

    const getCostDisplay = () => {
        if (university.estimated_cost_min && university.estimated_cost_max) {
            return `$${(university.estimated_cost_min / 1000).toFixed(0)}k - $${(university.estimated_cost_max / 1000).toFixed(0)}k/year`;
        }
        return 'Cost varies';
    };

    return (
        <div className="card p-6 hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{university.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FaGlobeAmericas />
                        <span>{university.country}</span>
                        <span className="text-slate-400">•</span>
                        <span>{university.degree_type}</span>
                    </div>
                </div>
                {university.ranking && (
                    <div className="text-center bg-primary-50 rounded-lg px-3 py-2">
                        <div className="text-xs text-primary-600 font-medium">Rank</div>
                        <div className="text-lg font-bold text-primary-700">#{university.ranking}</div>
                    </div>
                )}
            </div>

            {/* Badges */}
            {userUniversity && (
                <div className="flex gap-2 mb-4">
                    <span className={`badge ${getCategoryBadge(userUniversity.category)}`}>
                        {userUniversity.category?.toUpperCase()}
                    </span>
                    <span className={`badge ${getAcceptanceBadge(userUniversity.acceptance_likelihood)}`}>
                        {userUniversity.acceptance_likelihood} acceptance
                    </span>
                </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <FaDollarSign className="text-primary-600" />
                    <span className="text-slate-700">{getCostDisplay()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <FaChartLine className="text-primary-600" />
                    <span className="text-slate-700 capitalize">{university.competitiveness} competitive</span>
                </div>
            </div>

            {/* Description */}
            {university.description && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{university.description}</p>
            )}

            {/* AI Analysis */}
            {userUniversity && (
                <div className="space-y-2 mb-4 text-sm">
                    {userUniversity.fit_reason && (
                        <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded">
                            <p className="font-medium text-green-900 mb-1">Why it fits:</p>
                            <p className="text-green-700">{userUniversity.fit_reason}</p>
                        </div>
                    )}
                    {userUniversity.risk_factors && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-3 rounded">
                            <p className="font-medium text-yellow-900 mb-1">Risks:</p>
                            <p className="text-yellow-700">{userUniversity.risk_factors}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {!isShortlisted && onShortlist && (
                    <button onClick={() => onShortlist(university)} className="btn-primary flex-1">
                        Shortlist
                    </button>
                )}

                {isShortlisted && !isLocked && onLock && (
                    <button onClick={() => onLock(userUniversity.university_id)} className="btn-primary flex-1">
                        Lock University
                    </button>
                )}

                {isLocked && (
                    <div className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
                        ✓ Locked
                    </div>
                )}

                {isShortlisted && !isLocked && onRemove && (
                    <button
                        onClick={() => onRemove(userUniversity.university_id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
}
