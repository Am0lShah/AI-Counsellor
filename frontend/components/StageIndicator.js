import { FaCheck } from 'react-icons/fa';

export default function StageIndicator({ currentStage, stageName, stageDescription }) {
    const stages = [
        { number: 1, name: 'Profile Building', short: 'Profile' },
        { number: 2, name: 'University Discovery', short: 'Discovery' },
        { number: 3, name: 'University Finalization', short: 'Finalization' },
        { number: 4, name: 'Application Preparation', short: 'Application' },
    ];

    return (
        <div className="p-2">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                Your Journey
            </h3>

            {/* Desktop View */}
            <div className="hidden md:flex items-center justify-between mb-8 relative">
                {/* Connecting Line Background */}
                <div className="absolute top-6 left-0 w-full h-1 bg-slate-100 rounded-full -z-10"></div>

                {stages.map((stage, index) => {
                    const isCompleted = stage.number < currentStage;
                    const isCurrent = stage.number === currentStage;

                    return (
                        <div key={stage.number} className="flex flex-col items-center flex-1 relative group">
                            {/* Progress Line Colored */}
                            {index !== 0 && (
                                <div className={`absolute top-6 right-[50%] w-full h-1 -z-10 ${stage.number <= currentStage ? 'bg-primary-500' : 'bg-transparent'
                                    }`} style={{ width: '100%', right: '50%' }}></div>
                            )}

                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-4 ${isCompleted
                                        ? 'bg-primary-500 border-white text-white shadow-lg shadow-primary-500/30'
                                        : isCurrent
                                            ? 'bg-white border-primary-500 text-primary-600 shadow-xl shadow-primary-500/20 scale-110'
                                            : 'bg-white border-slate-200 text-slate-400'
                                    }`}
                            >
                                {isCompleted ? <FaCheck className="text-sm" /> : stage.number}
                            </div>
                            <p
                                className={`mt-3 text-sm font-medium transition-colors duration-300 ${isCurrent ? 'text-primary-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                                    }`}
                            >
                                {stage.short}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex items-center gap-2 mb-6">
                {stages.map((stage) => (
                    <div
                        key={stage.number}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${stage.number <= currentStage ? 'bg-primary-500 shadow-sm' : 'bg-slate-200'
                            }`}
                    ></div>
                ))}
            </div>

            {/* Current Stage Info */}
            <div className="bg-white/50 border border-slate-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                        <span className="font-bold text-xl">{currentStage}</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1 text-lg">
                            {stageName}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{stageDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
