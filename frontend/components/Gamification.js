'use client';

import { useState, useEffect } from 'react';
import { FaMedal, FaStar, FaTrophy, FaFire } from 'react-icons/fa';
import { MotionDiv } from '@/components/MotionWrapper';

export default function Gamification({ actionsCompleted = 0 }) {
    // Simple logic: 1 action = 100 XP
    const xp = actionsCompleted * 100;
    const levels = [
        { name: 'Novice Scholar', minXp: 0, icon: FaStar, color: 'text-slate-400' },
        { name: 'Aspirant', minXp: 500, icon: FaFire, color: 'text-orange-500' },
        { name: 'Achiever', minXp: 1500, icon: FaMedal, color: 'text-blue-500' },
        { name: 'Elite Scholar', minXp: 3000, icon: FaTrophy, color: 'text-yellow-500' }
    ];

    // Determine current level
    const currentLevelIndex = levels.slice().reverse().findIndex(l => xp >= l.minXp);
    const levelIndex = currentLevelIndex === -1 ? 0 : levels.length - 1 - currentLevelIndex;
    const currentLevel = levels[levelIndex];
    const nextLevel = levels[levelIndex + 1];

    // Calculate progress to next level
    let progress = 100;
    if (nextLevel) {
        const xpInLevel = xp - currentLevel.minXp;
        const xpNeeded = nextLevel.minXp - currentLevel.minXp;
        progress = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));
    }

    return (
        <div className="card bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <currentLevel.icon className="text-8xl" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" />
                        Scholar Level
                    </h3>
                    <span className="text-xs font-bold px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                        {xp} XP
                    </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm border border-slate-200 dark:border-slate-700 ${currentLevel.color}`}>
                        <currentLevel.icon />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                            {currentLevel.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {nextLevel
                                ? `${nextLevel.minXp - xp} XP to ${nextLevel.name}`
                                : 'Max Level Reached!'}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <MotionDiv
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500`}
                    />
                </div>
            </div>
        </div>
    );
}
