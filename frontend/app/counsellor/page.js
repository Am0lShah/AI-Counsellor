'use client';

import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { aiAPI } from '@/lib/api';
import { FaPaperPlane, FaRobot, FaUser, FaMagic } from 'react-icons/fa';
import Link from 'next/link';
import { MotionDiv } from '@/components/MotionWrapper';

export default function CounsellorPage() {
    return (
        <ProtectedRoute requireOnboarding={true}>
            <Counsellor />
        </ProtectedRoute>
    );
}

function Counsellor() {
    const [messages, setMessages] = useState([]);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, suggestedQuestions]);

    const fetchHistory = async () => {
        try {
            const response = await aiAPI.getHistory(50);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSuggestionClick = (question) => {
        setInput(question);
        handleSend(question);
    };

    const handleSend = async (manualInput = null) => {
        const textToSend = manualInput || input;
        if (!textToSend.trim() || loading) return;

        setInput('');
        setSuggestedQuestions([]); // Clear suggestions while loading
        setLoading(true);

        // Add user message optimistically
        setMessages((prev) => [...prev, { role: 'user', message: textToSend, created_at: new Date() }]);

        try {
            const response = await aiAPI.chat({ message: textToSend });
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', message: response.data.message, created_at: new Date(), actions: response.data.actions },
            ]);
            if (response.data.suggested_questions) {
                setSuggestedQuestions(response.data.suggested_questions);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', message: 'Sorry, I encountered an error. Please try again.', created_at: new Date() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <FaRobot className="text-white text-2xl" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                AI Counsellor <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 px-2 py-0.5 rounded-full border border-primary-200 dark:border-primary-800">Beta</span>
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-300">Always here to help you guide.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={async () => {
                                if (confirm('Are you sure you want to clear your chat history? This cannot be undone.')) {
                                    try {
                                        await aiAPI.clearHistory();
                                        setMessages([]);
                                        setSuggestedQuestions([]);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }
                            }}
                            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium text-sm transition-colors"
                        >
                            Clear Chat
                        </button>
                        <Link href="/dashboard" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium text-sm transition-colors">
                            Exit
                        </Link>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.length === 0 && (
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/20 dark:to-purple-900/20 rounded-full mb-8 shadow-inner">
                                <FaMagic className="text-5xl text-primary-500 dark:text-primary-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Hello, Future Scholar! 👋</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                                I'm your sophisticated AI study abroad assistant. I can help with university matching, profile analysis, or general guidance.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                                {[
                                    { icon: '🎓', title: 'Find Universities', desc: 'Get recommendations based on your scores', query: 'What universities do you recommend for me?' },
                                    { icon: '💪', title: 'Profile Analysis', desc: 'Check your acceptance chances', query: 'How can I strengthen my profile?' },
                                    { icon: '🚀', title: 'Action Plan', desc: 'What should I do this month?', query: 'What should I do next?' },
                                    { icon: '📊', title: 'Category Guide', desc: 'Understanding Dream vs Safe', query: 'Explain Dream, Target, and Safe universities' }
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(item.query)}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-left hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 hover:-translate-y-1 transition-all group"
                                    >
                                        <div className="text-2xl mb-3">{item.icon}</div>
                                        <div className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">{item.title}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-300">{item.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </MotionDiv>
                    )}

                    {messages.map((msg, idx) => (
                        <MotionDiv
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                    <FaRobot className="text-white text-sm" />
                                </div>
                            )}
                            <div
                                className={`max-w-[85%] md:max-w-2xl rounded-2xl px-6 py-4 shadow-sm ${msg.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none'
                                    }`}
                            >
                                <div className="leading-relaxed whitespace-pre-wrap">{msg.message}</div>
                                {msg.actions && msg.actions.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold mb-2 flex items-center gap-1">
                                            <FaMagic /> Actions Performed
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.actions.map((action, i) => (
                                                <span key={i} className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                                                    ✓ {action.type.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FaUser className="text-slate-500 dark:text-slate-300" />
                                </div>
                            )}
                        </MotionDiv>
                    ))}

                    {loading && (
                        <MotionDiv
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                <FaRobot className="text-white text-sm" />
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-bl-none px-6 py-4 shadow-sm flex items-center gap-2">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Thinking</span>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </MotionDiv>
                    )}
                    {/* Suggested Questions */}
                    {suggestedQuestions.length > 0 && !loading && (
                        <div className="flex flex-col items-end gap-2 mt-2 px-4 transition-all duration-500 ease-in-out">
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mr-2">Suggested:</p>
                            <div className="flex flex-wrap justify-end gap-2">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSuggestionClick(q)}
                                        className="text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:-translate-y-0.5"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 z-20">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 input-field py-4 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-primary-500/30"
                        disabled={loading}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={loading || !input.trim()}
                        className="btn-primary px-8 rounded-xl shadow-lg shadow-primary-500/20 disabled:scale-100 disabled:opacity-50"
                    >
                        <FaPaperPlane className="text-lg" />
                    </button>
                </div>
                <div className="text-center mt-3">
                    <p className="text-xs text-slate-400 dark:text-slate-600">
                        AI Counsellor can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    );
}
