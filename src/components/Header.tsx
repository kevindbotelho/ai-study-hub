

export const Header = ({ currentView }: { currentView?: string }) => {
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
                            <p className="text-sm font-bold leading-none">Alex Rivera</p>
                            <p className="text-[10px] text-slate-500 font-medium">Membro Premium</p>
                        </div>
                        <div className="size-10 rounded-full bg-primary/20 overflow-hidden border-2 border-primary/10">
                            <img alt="User Profile" className="w-full h-full object-cover" data-alt="Portrait of a young man with glasses" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6Fs1JE-JeYmQp5HzyVJdt_AJaCcegJIn_WiBWOthO1TN-kTe-Qm6qGCTGJFwevFmXOO8G1yB0X2XfO8iMtQIGr3vYB9Bgdk0wF1L7YNkWOqu7k1jlyN2vHLw2vPNSzTrkO3NskW9bh9vy5Cq_yE0v8WwrlYsR3r5pzYyYT5XlA-dU2hNQ5YzVL7doGYkdMsQQGB462kyaoZjtrK0MCQQvS1v8DjOpEEXYHKDSpMImflChj1-qB8ctgVI9F0YuiOk4wr7eSnaJOok" />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
