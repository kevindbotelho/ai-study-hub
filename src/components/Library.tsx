import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const categories = ["Todos", "Resumos do YouTube", "Discussões no Reddit", "Textos em PDF", "Notas Pessoais"];

// Helper to map the source_type correctly to styles and text (similar to Dashboard, but adapted for Library cards)
const getIconAndColors = (type: string) => {
    switch (type.toLowerCase()) {
        case 'youtube':
            return { icon: 'play_circle', bg: 'bg-red-50', text: 'text-red-500' };
        case 'article':
        case 'pdf':
            return { icon: 'picture_as_pdf', bg: 'bg-blue-50', text: 'text-blue-500' };
        case 'reddit':
            return { icon: 'forum', bg: 'bg-orange-50', text: 'text-orange-500' };
        case 'ai':
        case 'web':
        default:
            return { icon: 'language', bg: 'bg-primary/10', text: 'text-primary' };
    }
};

export function Library() {
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [libraryData, setLibraryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibraryData = async () => {
            const { data, error } = await supabase
                .from('summaries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Erro ao buscar biblioteca:", error);
            } else {
                setLibraryData(data || []);
            }
            setLoading(false);
        };

        fetchLibraryData();
    }, []);

    const getFilteredData = () => {
        if (activeCategory === "Todos") return libraryData;
        if (activeCategory === "Resumos do YouTube") return libraryData.filter(item => item.source_type === 'youtube');
        if (activeCategory === "Discussões no Reddit") return libraryData.filter(item => item.source_type === 'reddit');
        if (activeCategory === "Textos em PDF") return libraryData.filter(item => item.source_type === 'article' || item.source_type === 'pdf');
        if (activeCategory === "Notas Pessoais") return libraryData.filter(item => item.source_type === 'note');
        return libraryData;
    };

    // Helper for formatting date
    const formatTimeAgo = (dateString: string) => {
        const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
        if (diff < 1) return 'Agora mesmo';
        if (diff < 24) return `Há ${diff}h`;
        return `Há ${Math.floor(diff / 24)}d`;
    };

    return (
        <div className="flex flex-col w-full h-full pb-10">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold">Sua Biblioteca</h2>
                    <p className="text-slate-500 text-sm">Pesquise, filtre e acesse todos os seus resumos.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 pb-6 w-full border-b border-primary/5 mb-6">
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

            {/* Content */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {getFilteredData().map((item) => {
                        const { icon, bg, text } = getIconAndColors(item.source_type);

                        // Parse tags if it's a string, or use the array directly
                        let displayTags = [];
                        if (Array.isArray(item.tags)) {
                            displayTags = item.tags;
                        } else if (typeof item.tags === 'string') {
                            try {
                                displayTags = JSON.parse(item.tags);
                            } catch (e) {
                                displayTags = [];
                            }
                        }

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
                                    {displayTags && displayTags.length > 0 ? (
                                        displayTags.map((tag: string, idx: number) => (
                                            <span key={idx} className="px-2.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="px-2.5 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            #{item.category}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        <span className="text-[11px] font-medium">{item.read_time || '5 MIN READ'}</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">{formatTimeAgo(item.created_at)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && getFilteredData().length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 mt-10">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50">search_off</span>
                    <p>Nenhum resumo encontrado nesta categoria.</p>
                </div>
            )}
        </div>
    );
}
