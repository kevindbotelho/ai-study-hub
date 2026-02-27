import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginProps {
    onLoginSuccess?: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // session exists now, parent component will detect auth state change
                if (onLoginSuccess) onLoginSuccess();

            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });
                if (error) throw error;
                alert('Verifique seu e-mail para o link de confirmação!');
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro na autenticação.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Erro ao logar com o Google.');
        }
    }

    return (
        <div className="flex w-full h-screen bg-white font-display overflow-hidden">
            {/* Left Column: Background Image */}
            <div className="relative hidden lg:flex flex-col w-[45%] h-full">
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
                    alt="Estudantes interagindo"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 blend-multiply"></div>

                {/* Content over Image */}
                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-2">
                        <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-white">neurology</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight">AI Study Hub</span>
                    </div>

                    <div className="max-w-md">
                        <p className="text-3xl font-bold leading-tight mb-4">
                            "Transforme sua maneira de aprender com o poder da Inteligência Artificial."
                        </p>
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg">Ana Silva</span>
                            <span className="text-white/70 text-sm">Pesquisadora e Membro Premium</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex flex-col items-center justify-center w-full lg:w-[55%] h-full p-4 sm:p-6 md:p-8 lg:p-10 no-scrollbar overflow-y-auto">
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500 my-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
                        </h1>
                        <p className="text-slate-500">
                            {isLogin ? 'Bem-vindo de volta ao AI Study Hub' : 'Junte-se a nós e revolucione seus estudos'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400">person</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={!isLogin}
                                        placeholder="Seu nome"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400">mail</span>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="seu.email@exemplo.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Senha</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400">lock</span>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-primary">
                                    <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">visibility</span>
                                </div>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex justify-end pt-1">
                                <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                                    Esqueceu a senha?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:shadow-md transition-all flex justify-center items-center gap-2 mt-4"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                            ) : null}
                            {isLogin ? 'Entrar' : 'Cadastrar'}
                        </button>
                    </form>

                    <div className="my-6 flex items-center justify-center gap-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">OU</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full py-2.5 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-100 shadow-sm hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar com o Google
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'} {' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary font-bold hover:underline"
                            >
                                {isLogin ? 'Cadastre-se' : 'Faça login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
