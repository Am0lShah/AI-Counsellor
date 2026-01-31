import { FaFileAlt, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

export default function ApplicationGuidance() {
    return (
        <div className="card border-l-4 border-l-green-500 shadow-lg dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <FaFileAlt className="text-xl" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Application Guide</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Checklist & Timeline for Fall 2027</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Documents Checklist */}
                <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" /> Required Documents
                    </h4>
                    <ul className="space-y-3">
                        {[
                            'Statement of Purpose (SOP)',
                            'Letters of Recommendation (3 LORs)',
                            'Official Transcripts',
                            'CV / Resume',
                            'GRE/TOEFL Official Reports',
                            'Financial Proof'
                        ].map((doc, i) => (
                            <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                {doc}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Timeline */}
                <div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" /> Typical Timeline
                    </h4>
                    <div className="space-y-4 relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
                        {[
                            { time: 'Sep - Oct', task: 'Shortlist Universities & Draft SOP' },
                            { time: 'Nov - Dec', task: 'Finalize SOP, LORs & Take Tests' },
                            { time: 'Dec - Jan', task: 'Submit Applications (Priority)' },
                            { time: 'Mar - Apr', task: 'Receive Decisions & Financial Aid' },
                            { time: 'May - Jul', task: 'Visa Process & Pre-departure' }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900"></div>
                                <span className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{item.time}</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.task}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
