import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const AINewsPortal = () => {
    const [newsList, setNewsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const { data, error } = await supabase
                .from('ai_news')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) {
                console.error("Erro ao buscar notícias:", error);
            } else {
                setNewsList(data || []);
            }
            setLoading(false);
        };

        fetchNews();
    }, []);

    const flashNews = newsList.find(n => n.is_flash_news) || newsList[0];
    const weeklyInsights = newsList.filter(n => n.id !== flashNews?.id).slice(0, 3);

    // Helper formatter
    const formatTimeAgo = (dateString: string) => {
        const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
        if (diff < 24) {
            return `HÁ ${diff}H`;
        }
        return `HÁ ${Math.floor(diff / 24)}D`;
    };

    return (
        <aside className="w-80 border-l border-primary/10 bg-white flex flex-col shrink-0 overflow-hidden">
            <div className="p-6 border-b border-primary/10 flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined font-bold">newspaper</span>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Portal de Notícias de IA</h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-6">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {/* Flash News */}
                        {flashNews && (
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Notícias Rápidas</p>
                                <div className="relative group cursor-pointer">
                                    <div className="absolute inset-0 bg-primary/10 rounded-2xl scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    <div className="relative bg-white rounded-2xl border border-primary/10 overflow-hidden shadow-sm">
                                        <div className="h-32 w-full relative">
                                            <img alt={flashNews.title} className="w-full h-full object-cover" src={flashNews.image_url} />
                                            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-widest">Hot</div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">{flashNews.title}</h4>
                                            <p className="text-xs text-slate-500 mb-4 line-clamp-3">{flashNews.description}</p>
                                            <button className="w-full py-2.5 bg-slate-100 hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all">
                                                Ler Artigo Completo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Weekly Insights */}
                        {weeklyInsights.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Principais Insights da Semana</p>
                                <div className="flex flex-col gap-4">
                                    {weeklyInsights.map((insight) => (
                                        <div key={insight.id} className="flex gap-4 group cursor-pointer">
                                            <div className="size-16 shrink-0 rounded-xl overflow-hidden border border-primary/10">
                                                <img alt={insight.category} className="w-full h-full object-cover" src={insight.image_url} />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                    <span className="text-primary">{insight.category}</span> • {formatTimeAgo(insight.created_at)}
                                                </div>
                                                <h5 className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-2">{insight.title}</h5>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Newsletter Card */}
                <div className="mt-auto p-5 rounded-2xl bg-primary/5 border border-primary/20">
                    <h5 className="font-bold text-sm mb-2 text-primary">Resumo Diário</h5>
                    <p className="text-xs text-slate-500 mb-4">Receba as principais inovações em IA na sua caixa de entrada todas as manhãs.</p>
                    <div className="flex gap-2">
                        <input className="flex-1 bg-white border-primary/10 rounded-lg text-[10px] focus:ring-primary focus:border-primary" placeholder="Endereço de e-mail" type="email" />
                        <button className="size-8 bg-primary text-white rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </div>

            </div>
        </aside>
    );
};
