import React from 'react';
import { recentSummaries } from '../data/mockData';

export const RecentSummaries = () => {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold">Recent Summaries</h3>
                    <p className="text-slate-500 text-sm">Your AI-generated insights from across the web.</p>
                </div>
                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                    View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recentSummaries.map((summary) => (
                    <div key={summary.id} className="bg-white p-5 rounded-2xl shadow-sm border border-primary/5 hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`px-3 py-1 rounded-full ${summary.bgColor} ${summary.textColor} text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider`}>
                                <span className={`material-symbols-outlined text-sm ${summary.fillClass}`}>{summary.icon}</span> {summary.type}
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 italic">{summary.time}</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{summary.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{summary.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">{summary.category}</span>
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
