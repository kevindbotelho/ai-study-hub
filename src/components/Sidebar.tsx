interface SidebarProps {
    currentView: string;
    setCurrentView: (view: string) => void;
}

export const Sidebar = ({ currentView, setCurrentView }: SidebarProps) => {
    return (
        <aside className="w-64 border-r border-primary/10 bg-white flex flex-col shrink-0 min-h-screen">
            <div className="p-6 flex items-center gap-3">
                <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    <span className="material-symbols-outlined fill-1">school</span>
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-none">Academy AI</h1>
                    <p className="text-xs text-primary font-medium uppercase tracking-wider">Smart Learning</p>
                </div>
            </div>
            <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
                <button onClick={() => setCurrentView('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-primary/10 hover:text-primary'}`}>
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="font-medium">Dashboard</span>
                </button>
                <button onClick={() => setCurrentView('library')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'library' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-primary/10 hover:text-primary'}`}>
                    <span className="material-symbols-outlined">library_books</span>
                    <span className="font-medium">Library</span>
                </button>
                <button onClick={() => setCurrentView('ai-workspace')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'ai-workspace' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-primary/10 hover:text-primary'}`}>
                    <span className="material-symbols-outlined">psychology</span>
                    <span className="font-medium">AI Workspace</span>
                </button>
                <div className="mt-8 px-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Personal</p>
                </div>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-primary/10 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">history</span>
                    <span className="font-medium">Recent Activity</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-primary/10 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">star</span>
                    <span className="font-medium">Favorites</span>
                </button>
            </nav>
            <div className="p-4 border-t border-primary/10">
                <button onClick={() => setCurrentView('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full ${currentView === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-primary/10 hover:text-primary'}`}>
                    <span className="material-symbols-outlined">settings</span>
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </aside>
    );
};
