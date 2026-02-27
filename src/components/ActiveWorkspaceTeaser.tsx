

export const ActiveWorkspaceTeaser = () => {
    return (
        <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-primary/90 to-primary text-white flex items-center justify-between shadow-xl shadow-primary/30">
            <div className="max-w-lg">
                <h3 className="text-2xl font-bold mb-2">Pronto para expandir seu conhecimento?</h3>
                <p className="text-primary-50 opacity-90 mb-6">Inicie uma nova sessão de estudos no Espaço IA. Faça upload de qualquer arquivo ou link e obtenha análises instantâneas, flashcards e quizzes.</p>
                <button className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span> Criar Nova Sessão
                </button>
            </div>
            <div className="hidden lg:block">
                <span className="material-symbols-outlined text-[120px] opacity-20">psychology_alt</span>
            </div>
        </div>
    );
};
