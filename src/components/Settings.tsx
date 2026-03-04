import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export function Settings() {
    const [activeTab, setActiveTab] = useState('Perfil');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Estudante');
    const [email, setEmail] = useState('');
    const [session, setSession] = useState<Session | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const tabs = ['Perfil', 'Conta', 'Aparência', 'Integrações'];

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session);
                setName(session.user.user_metadata?.full_name || '');
                setRole(session.user.user_metadata?.role || 'Estudante');
                setEmail(session.user.email || '');
            }
        });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage('');

        if (session) {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name, role: role }
            });

            if (error) {
                console.error("Erro ao atualizar o perfil:", error);
                setSaveMessage('Erro ao atualizar as configurações. Tente novamente.');
            } else {
                setSaveMessage('Configurações atualizadas com sucesso!');
            }
        }

        setIsSaving(false);
        setTimeout(() => setSaveMessage(''), 3000);
    };

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-slate-900 rounded-2xl border border-primary/10 overflow-hidden shadow-sm">

            {/* Header */}
            <header className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-primary/10">
                <div>
                    <h1 className="text-xl font-bold leading-tight">Configurações</h1>
                    <p className="text-sm text-slate-500">Gerencie seu perfil e preferências</p>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

                {/* Navigation Tabs (Sidebar on desktop, horizontal on mobile) */}
                <nav className="flex md:flex-col overflow-x-auto md:overflow-y-auto border-b md:border-b-0 md:border-r border-primary/10 md:w-64 shrink-0 bg-white/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-none py-4 px-6 text-sm font-semibold border-b-2 md:border-b-0 md:border-l-2 text-left transition-colors ${activeTab === tab
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-white relative">
                    {/* Success Toast */}
                    {saveMessage && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span className="text-sm font-medium">{saveMessage}</span>
                        </div>
                    )}

                    <div className="max-w-xl mx-auto w-full mt-8 md:mt-0">

                        {activeTab === 'Perfil' && (
                            <div className="animate-in fade-in duration-300">
                                {/* Profile Picture Section */}
                                <section className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 pb-10 border-b border-slate-100">
                                    <div className="relative">
                                        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-md text-primary text-3xl font-bold">
                                            {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm block">edit</span>
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center md:items-start justify-center pt-2">
                                        <h2 className="text-lg font-bold">Foto de Perfil</h2>
                                        <p className="text-sm text-slate-500 mb-3 text-center md:text-left">Use uma imagem quadrada, de preferência 400x400px.</p>
                                        <button className="px-5 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full hover:bg-primary/20 transition-colors">
                                            Alterar Foto
                                        </button>
                                    </div>
                                </section>

                                {/* Form Fields */}
                                <form className="space-y-6" onSubmit={handleSave}>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo</label>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                            type="text"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Endereço de E-mail</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed shadow-inner"
                                            disabled
                                            type="email"
                                            value={email}
                                        />
                                        <p className="text-xs text-slate-400 ml-1">O e-mail não pode ser alterado após verificado.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 ml-1">Profissão / Cargo</label>
                                        <div className="relative">
                                            <select
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full appearance-none px-4 py-3 rounded-xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm pr-10"
                                            >
                                                <option value="Estudante">Estudante</option>
                                                <option value="Pesquisador">Pesquisador</option>
                                                <option value="Cientista de Dados">Cientista de Dados</option>
                                                <option value="Professor Acadêmico">Professor Acadêmico</option>
                                                <option value="Profissional Autônomo">Profissional Autônomo</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-400">expand_more</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex flex-col sm:flex-row-reverse gap-3 items-center">
                                        <button disabled={isSaving} className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-full shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-70 disabled:hover:shadow-md transition-all flex items-center justify-center gap-2" type="submit">
                                            {isSaving ? (
                                                <>
                                                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                                    Salvando...
                                                </>
                                            ) : (
                                                'Salvar Alterações'
                                            )}
                                        </button>
                                        <button className="w-full sm:w-auto px-8 py-3 text-slate-500 font-semibold hover:bg-slate-100 rounded-full transition-colors" type="button">
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab !== 'Perfil' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                                    <span className="material-symbols-outlined text-4xl">build</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-700 mb-2">Configurações de {activeTab}</h2>
                                <p className="text-slate-500 max-w-sm">Esta seção ainda está em desenvolvimento. Ela será integrada ao backend em breve.</p>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}
