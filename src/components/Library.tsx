import { useState } from 'react';

const libraryData = [
    {
        id: "1",
        title: "Quantum Computing Basics",
        description: "Understanding qubits, entanglement, and how quantum interference allows us to solve complex problems...",
        type: "youtube",
        readTime: "12m read",
        date: "Today, 10:23 AM",
        tags: ["#Tech", "#Science"]
    },
    {
        id: "2",
        title: "Thesis_Final_Draft.pdf",
        description: "Final review of the cognitive architecture chapter, focusing on the integration of neural symbolic layers...",
        type: "article",
        readTime: "25m read",
        date: "Yesterday, 4:45 PM",
        tags: ["#Education", "#PDF"]
    },
    {
        id: "3",
        title: "Latest ML Papers",
        description: "Summary of the Top 5 papers from NeurIPS 2024 concerning efficient transformer fine-tuning...",
        type: "ai",
        readTime: "10m read",
        date: "Oct 12, 2:30 PM",
        tags: ["#AI"]
    },
    {
        id: "4",
        title: "UX Design Trends 2024",
        description: "Aggregated insights from the r/UXDesign community discussions.",
        type: "reddit",
        readTime: "8m read",
        date: "5h ago",
        tags: ["#Design"]
    },
    {
        id: "5",
        title: "The Future of Neural Networks",
        description: "AI-generated summary of the latest research paper from DeepMind.",
        type: "ai",
        readTime: "15m read",
        date: "Yesterday",
        tags: ["#Research"]
    },
    {
        id: "6",
        title: "Tailwind CSS Best Practices",
        description: "Key takeaways from the official documentary and developer guides.",
        type: "youtube",
        readTime: "5m read",
        date: "1 week ago",
        tags: ["#Dev"]
    }
];

const categories = ["All", "YouTube Summaries", "Reddit Cases", "AI Requests"];

export function Library() {
    const [activeCategory, setActiveCategory] = useState("All");

    const getFilteredData = () => {
        if (activeCategory === "All") return libraryData;
        if (activeCategory === "YouTube Summaries") return libraryData.filter(item => item.type === 'youtube');
        if (activeCategory === "Reddit Cases") return libraryData.filter(item => item.type === 'reddit');
        if (activeCategory === "AI Requests") return libraryData.filter(item => item.type === 'ai');
        return libraryData;
    };

    const getIconAndColors = (type: string) => {
        switch (type) {
            case 'youtube':
                return { icon: 'play_circle', bg: 'bg-red-50', text: 'text-red-500' };
            case 'article':
                return { icon: 'description', bg: 'bg-blue-50', text: 'text-blue-500' };
            case 'reddit':
                return { icon: 'forum', bg: 'bg-orange-50', text: 'text-orange-500' };
            case 'ai':
                return { icon: 'auto_awesome', bg: 'bg-primary/10', text: 'text-primary' };
            default:
                return { icon: 'note', bg: 'bg-slate-100', text: 'text-slate-500' };
        }
    };

    return (
        <div className="flex flex-col w-full">
            {/* Filters */}
            <div className="flex gap-2 pb-6 overflow-x-auto no-scrollbar w-full border-b border-primary/5 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors ${activeCategory === cat
                            ? 'bg-primary text-white shadow-sm shadow-primary/20'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {getFilteredData().map((item) => {
                    const { icon, bg, text } = getIconAndColors(item.type);
                    return (
                        <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-primary/5 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <div className={`size-10 rounded-xl ${bg} flex items-center justify-center ${text}`}>
                                    <span className="material-symbols-outlined">{icon}</span>
                                </div>
                                <button className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50 p-1 rounded-md">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {item.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2.5 py-0.5 bg-background-light text-slate-600 border border-slate-200 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    <span className="text-[11px] font-medium">{item.readTime}</span>
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
