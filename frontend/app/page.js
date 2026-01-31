import Link from 'next/link';
import Image from 'next/image';
import { FaGraduationCap, FaRocket, FaChartLine, FaBrain, FaArrowRight, FaCheckCircle, FaGlobeAmericas } from 'react-icons/fa';
import { MotionDiv, MotionH1, MotionP } from '@/components/MotionWrapper';

export default function HomePage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <main className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 border-b border-white/5">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-bg.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-60 dark:opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-primary-900/40 dark:from-slate-950/95 dark:via-slate-900/80 dark:to-primary-950/60" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                    <MotionDiv
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="flex flex-col items-center"
                    >
                        <MotionDiv variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 bg-white/5 text-blue-200 mb-8 backdrop-blur-md">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            <span className="text-sm font-medium tracking-wide uppercase">AI-Powered Study Abroad Application</span>
                        </MotionDiv>

                        <MotionH1 variants={fadeIn} className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                            Your Dream University <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
                                Just a Prediction Away
                            </span>
                        </MotionH1>

                        <MotionP variants={fadeIn} className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                            A guided, stage-based intelligence system that transforms your profile into an acceptance letter. Stop guessing, start planning.
                        </MotionP>

                        <MotionDiv variants={fadeIn} className="flex flex-col sm:flex-row gap-5">
                            <Link
                                href="/signup"
                                className="group btn-primary text-lg px-8 py-4 rounded-full shadow-lg shadow-primary-500/25 dark:shadow-primary-900/40"
                            >
                                Start Your Journey
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/login"
                                className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 text-lg px-8 py-4 rounded-full backdrop-blur-md shadow-lg"
                            >
                                Existing Student
                            </Link>
                        </MotionDiv>
                    </MotionDiv>
                </div>
            </div>

            {/* Stats/Trust Section */}
            <div className="glass-panel border border-white/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 relative z-20 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 backdrop-blur-xl">
                {[
                    { label: 'Universities', value: '500+', icon: FaGlobeAmericas },
                    { label: 'Accuracy', value: '98%', icon: FaBrain },
                    { label: 'Students', value: '10k+', icon: FaGraduationCap },
                    { label: 'Success Rate', value: '95%', icon: FaCheckCircle },
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <stat.icon className="text-3xl text-primary-500 mb-2" />
                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Features Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                            Intelligent Guidance at Every Step
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Our AI breaks down the complex medical application process into manageable stages, ensuring you never miss a deadline or opportunity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Profile Analysis',
                                desc: 'We analyze your academic background, scores, and interests to build a comprehensive student profile.',
                                color: 'from-blue-500 to-blue-600',
                            },
                            {
                                step: '02',
                                title: 'Smart Match',
                                desc: 'Our algorithm categorizes universities into Dream, Target, and Safe options tailored specifically to you.',
                                color: 'from-purple-500 to-purple-600',
                            },
                            {
                                step: '03',
                                title: 'Application Lock',
                                desc: 'Finalize your university list with deep-dive insights on acceptance probabilities and ROI.',
                                color: 'from-pink-500 to-pink-600',
                            },
                            {
                                step: '04',
                                title: 'Action Plan',
                                desc: 'Get a personalized roadmap with deadlines, document checklists, and essay guidance.',
                                color: 'from-emerald-500 to-emerald-600',
                            },
                        ].map((feature, i) => (
                            <MotionDiv
                                key={i}
                                whileHover={{ y: -8 }}
                                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {feature.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </MotionDiv>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl opacity-20 blur-2xl transform rotate-3"></div>
                            <div className="relative bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
                                {/* Mock UI Card */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <FaBrain />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">Harvard University</div>
                                                <div className="text-slate-400 text-sm">Cambridge, MA</div>
                                            </div>
                                        </div>
                                        <span className="badge bg-green-500/20 text-green-400 border-green-500/30">Target Match</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Acceptance Probability</span>
                                            <span className="text-white font-medium">42%</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[42%]"></div>
                                        </div>
                                    </div>
                                    <div className="pt-2 text-sm text-slate-400">
                                        Strong academic fit, but consider boosting GRE Quant score by 5 points.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">
                                Why <span className="text-primary-600 dark:text-primary-400">AI Counsellor</span>?
                            </h2>
                            <div className="space-y-8">
                                {[
                                    {
                                        title: 'Data-Driven methodology',
                                        desc: 'We use historical admission data from over 500 universities to provide realistic predictions.',
                                        icon: FaChartLine
                                    },
                                    {
                                        title: 'Unbiased Recommendations',
                                        desc: 'Our AI has no university tie-ups. We recommend what is truly best for your profile and career goals.',
                                        icon: FaBrain
                                    },
                                    {
                                        title: 'End-to-End Support',
                                        desc: 'From the first day of planning to the day you fly, we have a structured module for everything.',
                                        icon: FaRocket
                                    },
                                ].map((item, i) => (
                                    <MotionDiv
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-5"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl">
                                            <item.icon />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </MotionDiv>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-slate-950 text-white pt-20 pb-10 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <FaGraduationCap className="text-2xl text-primary-400" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight">AI Counsellor</span>
                            </div>
                            <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
                                Democratizing study abroad counselling with advanced artificial intelligence. Making premium guidance accessible to everyone.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Platform</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li><Link href="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
                                <li><Link href="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
                                <li><Link href="/signup" className="hover:text-primary-400 transition-colors">Sign Up</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Legal</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                        <p>© 2026 AI Counsellor. All rights reserved.</p>
                        <p>Built with Next.js & AI</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
