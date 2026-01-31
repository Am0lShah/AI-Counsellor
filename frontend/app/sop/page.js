'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FaMagic, FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaCopy, FaUndo, FaTrophy } from 'react-icons/fa';
import Link from 'next/link';
import { MotionDiv } from '@/components/MotionWrapper';

export default function SOPPage() {
    return (
        <ProtectedRoute requireOnboarding={true}>
            <SOPGuardian />
        </ProtectedRoute>
    );
}

function SOPGuardian() {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const analyzeSOP = async () => {
        if (!text.trim()) return;
        setLoading(true);

        // Simulate AI Analysis (In real app, call backend)
        setTimeout(() => {
            const words = text.split(/\s+/).length;
            const clicheCount = (text.match(/passion|dream|hardworking|motivated/gi) || []).length;

            setAnalysis({
                score: Math.min(100, Math.max(0, 85 - (clicheCount * 5) + (words > 500 ? 10 : 0))),
                wordCount: words,
                readability: 'College Graduate',
                cliches: clicheCount,
                sentiment: 'Positive (Confidence detected)',
                suggestions: [
                    words < 500 ? 'Your essay is a bit short. Aim for 800-1000 words for most universities.' : 'Good length!',
                    clicheCount > 2 ? `Found ${clicheCount} potential clichés. Try to be more specific.` : 'Good job avoiding common clichés.',
                    'Consider adding more quantifiable achievements in the second paragraph.'
                ]
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-md">
                            <FaMagic />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white">AI SOP Guardian</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Statement of Purpose Analyzer</p>
                        </div>
                    </div>
                    <Link href="/dashboard" className="btn-secondary text-sm py-2">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid lg:grid-cols-2 gap-8">
                {/* Editor Side */}
                <div className="flex flex-col h-[calc(100vh-140px)]">
                    <div className="card dark:bg-slate-900 dark:border-slate-800 flex-1 flex flex-col p-0 overflow-hidden shadow-xl">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Editor</span>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500" title="Copy">
                                    <FaCopy />
                                </button>
                                <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500" title="Reset" onClick={() => setText('')}>
                                    <FaUndo />
                                </button>
                            </div>
                        </div>
                        <textarea
                            className="flex-1 w-full p-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 resize-none outline-none font-serif leading-relaxed text-lg"
                            placeholder="Paste your Statement of Purpose here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={analyzeSOP}
                                disabled={loading || !text.trim()}
                                className="w-full btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/25"
                            >
                                {loading ? 'Analyzing...' : 'Analyze with AI'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Analysis Side */}
                <div className="h-full overflow-y-auto">
                    {!analysis && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                            <FaMagic className="text-6xl text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Ready to Optimize</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                                Paste your essay on the left and hit Analyze to get instant feedback on tone, structure, and impact.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="space-y-4">
                            <div className="card p-6 animate-pulse">
                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
                                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-8"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {analysis && !loading && (
                        <MotionDiv
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Score Card */}
                            <div className="card bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-purple-500/20">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold opacity-90">Impact Score</h3>
                                    <FaTrophy className="text-yellow-300 text-xl" />
                                </div>
                                <div className="text-5xl font-bold mb-2">{analysis.score}/100</div>
                                <div className="w-full bg-black/20 rounded-full h-2">
                                    <div className="bg-white rounded-full h-2 transition-all duration-1000" style={{ width: `${analysis.score}%` }}></div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="card dark:bg-slate-900 dark:border-slate-800 p-4">
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Word Count</div>
                                    <div className="text-xl font-bold text-slate-800 dark:text-white">{analysis.wordCount}</div>
                                </div>
                                <div className="card dark:bg-slate-900 dark:border-slate-800 p-4">
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Cliches Found</div>
                                    <div className={`text-xl font-bold ${analysis.cliches > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {analysis.cliches}
                                    </div>
                                </div>
                                <div className="card dark:bg-slate-900 dark:border-slate-800 p-4">
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Readability</div>
                                    <div className="text-lg font-bold text-slate-800 dark:text-white truncate">{analysis.readability}</div>
                                </div>
                                <div className="card dark:bg-slate-900 dark:border-slate-800 p-4">
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Sentiment</div>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400 truncate">Positive</div>
                                </div>
                            </div>

                            {/* Suggestions */}
                            <div className="card dark:bg-slate-900 dark:border-slate-800">
                                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <FaLightbulb className="text-yellow-500" />
                                    AI Suggestions
                                </h3>
                                <div className="space-y-3">
                                    {analysis.suggestions.map((s, i) => (
                                        <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <FaExclamationTriangle className="text-orange-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800">
                                <div className="flex gap-3">
                                    <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-green-800 dark:text-green-300 text-sm">Strong Points</h4>
                                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                            Good use of action verbs in paragraph 1. Your opening hook is compelling.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>
                    )}
                </div>
            </div>
        </div>
    );
}
