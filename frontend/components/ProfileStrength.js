'use client';

export default function ProfileStrength({ strength }) {
    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getStatusBadge = (status) => {
        const styles = {
            strong: 'bg-green-100 text-green-800',
            average: 'bg-yellow-100 text-yellow-800',
            weak: 'bg-red-100 text-red-800',
            completed: 'bg-green-100 text-green-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            not_started: 'bg-red-100 text-red-800',
            ready: 'bg-green-100 text-green-800',
            draft: 'bg-yellow-100 text-yellow-800',
        };

        return styles[status] || 'bg-slate-100 text-slate-800';
    };

    const formatStatus = (status) => {
        return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Strength</h3>

            {/* Overall Score */}
            <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Overall Score</span>
                    <span className={`text-3xl font-bold ${getScoreColor(strength.overall_score)}`}>
                        {strength.overall_score}
                    </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${strength.overall_score >= 70
                                ? 'bg-green-600'
                                : strength.overall_score >= 40
                                    ? 'bg-yellow-600'
                                    : 'bg-red-600'
                            }`}
                        style={{ width: `${strength.overall_score}%` }}
                    ></div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Academic Strength</span>
                    <span className={`badge ${getStatusBadge(strength.academic)}`}>
                        {formatStatus(strength.academic)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Exam Readiness</span>
                    <span className={`badge ${getStatusBadge(strength.exams)}`}>
                        {formatStatus(strength.exams)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">SOP Status</span>
                    <span className={`badge ${getStatusBadge(strength.sop)}`}>
                        {formatStatus(strength.sop)}
                    </span>
                </div>
            </div>
        </div>
    );
}
