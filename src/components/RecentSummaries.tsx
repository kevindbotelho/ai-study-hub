import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Helper to map the source_type correctly to styles and text
const getSourceStyles = (sourceType: string) => {
    switch (sourceType.toLowerCase()) {
        case 'youtube':
            return {
                bgColor: 'bg-red-50',
                textColor: 'text-red-600',
                fillClass: 'text-red-500',
                icon: 'play_circle',
                type: 'YouTube',
            };
        case 'pdf':
            return {
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-600',
                fillClass: 'text-blue-500',
                icon: 'picture_as_pdf',
                type: 'PDF',
            };
        case 'web':
            return {
                bgColor: 'bg-violet-50',
                textColor: 'text-violet-600',
                fillClass: 'text-violet-500',
                icon: 'language',
                type: 'Web',
            };
        case 'note':
            return {
                bgColor: 'bg-amber-50',
                textColor: 'text-amber-600',
                fillClass: 'text-amber-500',
                icon: 'edit_document',
                type: 'Nota',
            };
        case 'ai':
            return {
                bgColor: 'bg-emerald-50',
                textColor: 'text-emerald-600',
                fillClass: 'text-emerald-500',
                icon: 'auto_awesome',
                type: 'IA',
            };
        default:
            return {
                bgColor: 'bg-slate-50',
                textColor: 'text-slate-600',
                fillClass: 'text-slate-500',
                icon: 'description',
                type: 'Documento',
            };
    }
};

export const RecentSummaries = () => {
    const [summaries, setSummaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummaries = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('summaries')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(6);

            if (error) {
                console.error("Erro ao buscar resumos:", error);
            } else {
                setSummaries(data || []);
            }
            setLoading(false);
        };

        fetchSummaries();
    }, []);

    // Helper for formatting date to something like "14 FEV"
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
    };

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold">Resumos Recentes</h3>
                    <p className="text-slate-500 text-sm">Seus insights gerados por IA de toda a web.</p>
                </div>
                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                    Ver Todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {summaries.map((summary) => {
                        const styles = getSourceStyles(summary.source_type);

                        return (
                            <div key={summary.id} className="bg-white p-5 rounded-2xl shadow-sm border border-primary/5 hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`px-3 py-1 rounded-full ${styles.bgColor} ${styles.textColor} text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider`}>
                                        <span className={`material-symbols-outlined text-sm ${styles.fillClass}`}>{styles.icon}</span> {styles.type}
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400 italic">
                                        {summary.read_time ? `${summary.read_time} • ` : ''}
                                        {formatDate(summary.created_at)}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{summary.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{summary.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                        {summary.category}
                                    </span>
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
