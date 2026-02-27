import { supabase } from '../lib/supabase';

export const Header = ({ currentView, session }: { currentView?: string, session?: any }) => {

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="h-20 border-b border-primary/10 bg-white/50 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
                {currentView !== 'library' && <h2 className="text-xl font-bold">Dashboard</h2>}
                <div className={`relative flex-1 ${currentView !== 'library' ? 'ml-8' : ''}`}>
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                    <input className="w-full bg-primary/5 border-none rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/50 text-sm transition-all" placeholder="Buscar resumos, arquivos ou notícias..." type="text" />
                </div>
            </div>
            {currentView !== 'library' && (
                <div className="flex items-center gap-4">
                    <button className="size-10 rounded-full bg-white border border-primary/10 flex items-center justify-center text-slate-600 hover:bg-primary/10 transition-all relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-primary/10">
                        <div className="text-right">
                            <p className="text-sm font-bold leading-none">
                                {session?.user?.user_metadata?.full_name || session?.user?.email || 'Membro'}
                            </p>
                            <button onClick={handleLogout} className="text-[10px] text-red-500 font-bold hover:underline">Sair / Logout</button>
                        </div>
                        <div className="size-10 rounded-full bg-primary/20 overflow-hidden border-2 border-primary/10 flex items-center justify-center text-primary font-bold">
                            {session?.user?.user_metadata?.full_name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </div>

            )}
        </header>
    );
};
