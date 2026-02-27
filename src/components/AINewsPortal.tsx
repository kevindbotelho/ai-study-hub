import { weeklyInsights } from '../data/mockData';

export const AINewsPortal = () => {
    return (
        <aside className="w-80 border-l border-primary/10 bg-white flex flex-col shrink-0 overflow-hidden">
            <div className="p-6 border-b border-primary/10 flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined font-bold">newspaper</span>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em]">AI News Portal</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-6">

                {/* Flash News */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Flash News</p>
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-primary/10 rounded-2xl scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        <div className="relative bg-white rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
                            <div className="h-32 w-full relative">
                                <img alt="AI Neural Network" className="w-full h-full object-cover" data-alt="Abstract glowing neural network visualization" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSJaJnuH8iIMCer8HV5OSGLv5gYqKo4ZDtypoNMYIivsUJPB7iBRbfJ1dJE6x8bJ-nQ7hVaUDOpwOKi_4HLtnOo-FrOeq_cfCwatxJ6pClso_31masfQxDnwbr_wM1kDO5gp8-w3sJZ7nCT2SUN6ruAoRJRfzb5Kq4HmyS4n2YblPCzWbEhz-M67p10PimUtdEC_LxQACgnFZbMCWABd-tVXjVu4sRyAYARReqvqhbWgGtFkTjLCZWMXRj7jmKx99aKrZQHpHVEU0" />
                                <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-widest">Hot</div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">New LLM architecture released: 'O1' focuses on reasoning.</h4>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-3">OpenAI introduces a new class of models designed to spend more time thinking before they respond.</p>
                                <button className="w-full py-2.5 bg-slate-100 hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all">
                                    Read Full Article
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Insights */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Top Weekly Insights</p>
                    <div className="flex flex-col gap-4">
                        {weeklyInsights.map((insight) => (
                            <div key={insight.id} className="flex gap-4 group cursor-pointer">
                                <div className="size-16 shrink-0 rounded-xl overflow-hidden border border-primary/10">
                                    <img alt={insight.category} className="w-full h-full object-cover" src={insight.image} />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        <span className="text-primary">{insight.category}</span> • {insight.time}
                                    </div>
                                    <h5 className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-2">{insight.title}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newsletter Card */}
                <div className="mt-4 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                    <h5 className="font-bold text-sm mb-2 text-primary">Daily Briefing</h5>
                    <p className="text-xs text-slate-500 mb-4">Get the top AI breakthroughs delivered to your inbox every morning.</p>
                    <div className="flex gap-2">
                        <input className="flex-1 bg-white border-primary/10 rounded-lg text-[10px] focus:ring-primary focus:border-primary" placeholder="Email address" type="email" />
                        <button className="size-8 bg-primary text-white rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </div>

            </div>
        </aside>
    );
};
