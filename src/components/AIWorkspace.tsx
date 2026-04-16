import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type SourceMode = 'geral' | 'youtube' | 'twitter' | 'reddit';

const MODELS = [
    { id: 'gemini-3.1-flash-lite-preview', label: 'Rápido', icon: 'bolt' },
    { id: 'gemini-3.1-pro-preview',        label: 'Raciocínio', icon: 'psychology' },
] as const;

type ModelId = typeof MODELS[number]['id'];

export function AIWorkspace() {
    const [sourceMode, setSourceMode] = useState<SourceMode>('geral');
    const [selectedModel, setSelectedModel] = useState<ModelId>('gemini-3.1-flash-lite-preview');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [approvedCards, setApprovedCards] = useState<string[]>([]); // Track which messages have had their cards approved or ignored

    // Auto-scroll anchor
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const attachments: any[] = []; // Empty for now, will implement real file upload later

    const parseMessageAsCard = (text: string) => {
        try {
            // Nova Estrutura: A IA manda o texto gigante em Markdown livre e insere 
            // no finalzinho um bloco ```json { "summary": "...", "title": "..." } ```
            const jsonBlockRegex = /```json\n([\s\S]*?)\n```/;
            const match = text.match(jsonBlockRegex);

            if (match && match[1]) {
                try {
                    const parsedJson = JSON.parse(match[1]);

                    // Aceita se tiver title e (summary ou key_highlights)
                    if (parsedJson.title && (parsedJson.summary || parsedJson.key_highlights)) {
                        // O full_answer será TODO O TEXTO original (Markdown),
                        // exceto a própria caixa de código JSON do final.
                        const cleanFullAnswer = text.replace(jsonBlockRegex, '').trim();

                        return {
                            full_answer: cleanFullAnswer,
                            summary: parsedJson.summary || null,
                            title: parsedJson.title,
                            key_highlights: parsedJson.key_highlights || null
                        };
                    }
                } catch (err) {
                    // Fallback se o LLM enviar aspas quebradas dentro do bloco JSON
                    const summaryMatch = match[1].match(/"summary"\s*:\s*"(.*?)"(?=\s*,\s*"title"\s*:)/s);
                    const titleMatch = match[1].match(/"title"\s*:\s*"(.*?)"(?=\s*\})/s);

                    if (summaryMatch && titleMatch) {
                        return {
                            full_answer: text.replace(jsonBlockRegex, '').trim(),
                            summary: summaryMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
                            title: titleMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
                        };
                    }
                }
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    const handleApproveCard = async (card: any, messageId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        console.log("Saving card...", card);
        const { error } = await supabase.from('summaries').insert([{
            title: card.title,
            description: card.summary || (card.key_highlights ? `${card.key_highlights.length} destaques principais salvos.` : "Sem descrição curta"),
            content: card.full_answer,
            summary_text: card.full_answer,
            key_highlights: card.key_highlights || [
                { title: "Resumo Rápido", description: card.summary }
            ],
            category: 'IA',
            source_type: 'ai',
            tags: ['ai', 'estudos'],
            read_time: '2 min',
            user_id: user.id
        }]);

        if (error) {
            console.error("Supabase Save Error:", error);
            alert("Erro ao salvar card: " + error.message);
        } else {
            console.log("Card saved successfully!");
            setApprovedCards(prev => [...prev, messageId]);
        }
    };



    useEffect(() => {
        if (!sessionId) {
            setMessages([]);
            return;
        }

        // Fetch existing messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: true });

            if (data && !error) {
                setMessages(data);
            }
        };

        fetchMessages();

        // Subscribe to real-time additions
        const subscription = supabase
            .channel(`chat_messages:session_id=eq.${sessionId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, payload => {
                setMessages(prev => [...prev.filter(m => m.id !== payload.new.id), payload.new]);
                // Só para o loading quando a mensagem da IA chegar, não a do usuário
                if (payload.new.role === 'ai') {
                    setIsThinking(false);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [sessionId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    const handleSend = async (forcedInput?: string) => {
        const textToSend = forcedInput || input;
        if (!textToSend.trim()) return;

        setInput('');
        let currentSessionId = sessionId;

        // If no active session, create one
        if (!currentSessionId) {
            const { data: sessionData, error: sessionError } = await supabase
                .from('chat_sessions')
                .insert([{ title: textToSend.substring(0, 30) }])
                .select('*')
                .single();

            if (sessionError || !sessionData) {
                console.error("Failed to create session", sessionError);
                return;
            }
            currentSessionId = sessionData.id;
            setSessionId(currentSessionId);
        }

        // Optimistically add to UI
        const tempUserMsg = { id: Date.now().toString(), role: 'user', text: textToSend };
        setMessages(prev => [...prev, tempUserMsg]);
        setIsThinking(true);

        // Insert into DB. The N8N webhook should listen to this insert to trigger the generative AI task.
        const { error: insertError } = await supabase
            .from('chat_messages')
            .insert([{ session_id: currentSessionId, role: 'user', text: textToSend }]);

        if (insertError) {
            console.error("Failed to insert message", insertError);
            setIsThinking(false);
        } else {
            try {
                // Dispara o Backend Python Serverless local/Vercel
                const response = await fetch('/api/summarize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: textToSend,
                        platform: sourceMode,
                        model: selectedModel,
                        instructions: "Gere um resumo detalhado contendo o título e a estrutura definida no prompt base."
                    })
                });

                if (!response.ok) {
                    throw new Error(`Erro API: ${response.status}`);
                }

                const data = await response.json();

                const aiText = data.success && data.summary
                    ? data.summary
                    : `Ocorreu um erro na conexão ou extração: **${data.error || 'Erro Desconhecido'}**\n\nVerifique se o link está acessível ou se há proteção de login.`;

                // Garante que a mensagem aparece na tela mesmo se o Realtime falhar
                const aiMsg = { id: Date.now().toString(), role: 'ai', text: aiText };
                setMessages(prev => [...prev, aiMsg]);
                setIsThinking(false);

                // Salva no Supabase (Realtime vai deduplicar pelo id)
                await supabase
                    .from('chat_messages')
                    .insert([{ session_id: currentSessionId, role: 'ai', text: aiText }]);

            } catch (err) {
                console.error("Error triggering automation:", err);

                const errText = `Ocorreu um erro no servidor backend: **${err instanceof Error ? err.message : String(err)}**`;
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: errText }]);
                setIsThinking(false);

                await supabase
                    .from('chat_messages')
                    .insert([{ session_id: currentSessionId, role: 'ai', text: errText }]);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-slate-900 rounded-2xl border border-primary/10 overflow-hidden shadow-sm">

            {/* Header inside the workspace area */}
            <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-primary/10">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                    <h1 className="text-xl font-bold tracking-tight">Estúdio IA</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium hidden sm:block">Modelo:</span>
                    <div className="flex items-center bg-slate-100 rounded-full p-1 gap-0.5">
                        {MODELS.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setSelectedModel(m.id)}
                                title={m.id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                    selectedModel === m.id
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[14px]">{m.icon}</span>
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">

                {/* Left Pane: Context */}
                <aside className="hidden lg:flex w-72 border-r border-primary/10 bg-white p-6 flex-col gap-6 overflow-y-auto">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Contexto</h3>
                        <div className="space-y-3">

                            {attachments.map(att => (
                                <div key={att.id} className="bg-white p-3 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                                            <span className="material-symbols-outlined text-sm">{att.icon}</span>
                                        </div>
                                        <span className="text-sm font-medium truncate">{att.name}</span>
                                    </div>
                                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            ))}

                            <button className="w-full border-2 border-dashed border-primary/20 p-3 rounded-xl flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition-colors font-medium">
                                <span className="material-symbols-outlined">upload_file</span>
                                <span className="text-sm">Adicionar Material</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-primary/5 pt-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Links Rápidos</h3>
                        <nav className="space-y-1">
                            <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-slate-600 transition-colors">
                                <span className="material-symbols-outlined text-slate-400">history</span>
                                <span className="text-sm font-medium">Atividade Recente</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-slate-600 transition-colors">
                                <span className="material-symbols-outlined text-slate-400">folder</span>
                                <span className="text-sm font-medium">Projetos Salvos</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Right Pane: Main Chat Interface */}
                <section className="flex-1 flex flex-col relative bg-white overflow-hidden">

                    {/* Chat Feed */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 flex flex-col">

                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center text-center pt-[5vh] pb-8 space-y-8 w-full max-w-[95%] xl:max-w-[1400px] mx-auto">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl font-bold mb-3 text-slate-800 tracking-tight">O que vamos explorar hoje?</h2>
                                    <p className="text-slate-500 text-base">Escolha a fonte do conteúdo para gerar um resumo otimizado ou faça uma pergunta livre.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
                                   {/* YouTube Card */}
                                   <button 
                                      onClick={() => setSourceMode('youtube')}
                                      className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 ${sourceMode === 'youtube' ? 'border-red-500 bg-red-50 shadow-md ring-1 ring-red-500/20' : 'border-slate-200 bg-white hover:border-red-200 hover:bg-slate-50 hover:shadow-sm'}`}
                                   >
                                      <div className={`size-12 rounded-xl flex items-center justify-center ${sourceMode === 'youtube' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 group-hover:scale-110 transition-transform'}`}>
                                         <span className="material-symbols-outlined text-2xl">video_library</span>
                                      </div>
                                      <div>
                                         <h3 className="font-bold text-slate-900 text-lg">YouTube</h3>
                                         <p className="text-sm text-slate-500 mt-1 leading-relaxed">Resuma qualquer vídeo longo inserindo o seu link.</p>
                                      </div>
                                   </button>
                                   
                                   {/* Twitter Card */}
                                   <button 
                                      onClick={() => setSourceMode('twitter')}
                                      className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 ${sourceMode === 'twitter' ? 'border-slate-800 bg-slate-100 shadow-md ring-1 ring-slate-800/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}
                                   >
                                      <div className={`size-12 rounded-xl flex items-center justify-center ${sourceMode === 'twitter' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800 group-hover:scale-110 transition-transform'}`}>
                                         <span className="material-symbols-outlined text-2xl">tag</span>
                                      </div>
                                      <div>
                                         <h3 className="font-bold text-slate-900 text-lg">X (Twitter)</h3>
                                         <p className="text-sm text-slate-500 mt-1 leading-relaxed">Resuma Threads longas ou grandes discussões.</p>
                                      </div>
                                   </button>

                                   {/* Reddit Card */}
                                   <button 
                                      onClick={() => setSourceMode('reddit')}
                                      className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 ${sourceMode === 'reddit' ? 'border-orange-500 bg-orange-50 shadow-md ring-1 ring-orange-500/20' : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-slate-50 hover:shadow-sm'}`}
                                   >
                                      <div className={`size-12 rounded-xl flex items-center justify-center ${sourceMode === 'reddit' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 group-hover:scale-110 transition-transform'}`}>
                                         <span className="material-symbols-outlined text-2xl">forum</span>
                                      </div>
                                      <div>
                                         <h3 className="font-bold text-slate-900 text-lg">Reddit</h3>
                                         <p className="text-sm text-slate-500 mt-1 leading-relaxed">Transforme debates e Megathreads em resumos úteis.</p>
                                      </div>
                                   </button>

                                   {/* IA Geral Card */}
                                   <button 
                                      onClick={() => setSourceMode('geral')}
                                      className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 ${sourceMode === 'geral' ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20' : 'border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50 hover:shadow-sm'}`}
                                   >
                                      <div className={`size-12 rounded-xl flex items-center justify-center ${sourceMode === 'geral' ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:scale-110 transition-transform'}`}>
                                         <span className="material-symbols-outlined text-2xl">smart_toy</span>
                                      </div>
                                      <div>
                                         <h3 className="font-bold text-slate-900 text-lg">IA Geral</h3>
                                         <p className="text-sm text-slate-500 mt-1 leading-relaxed">Faça perguntas livres ou peça explicações de tópicos.</p>
                                      </div>
                                   </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6 flex-1 flex flex-col justify-end">
                            {messages.map((msg) => {
                                return (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'ai' ? (
                                            <div className="flex gap-3 max-w-[85%]">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                </div>
                                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-sm text-slate-700 shadow-sm w-full">
                                                    {(() => {
                                                        const card = parseMessageAsCard(msg.text);
                                                        if (card) {
                                                            const isHandled = approvedCards.includes(msg.id);
                                                            return (
                                                                <div className="space-y-6 w-full">

                                                                    {/* Resposta Completa */}
                                                                    <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 md:p-6 shadow-sm">
                                                                        <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                                            <span className="material-symbols-outlined text-[18px]">menu_book</span>
                                                                            Explicação Detalhada
                                                                        </h4>
                                                                        <div className="text-sm leading-relaxed text-slate-700 markdown-body">
                                                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                                {card.full_answer}
                                                                            </ReactMarkdown>
                                                                        </div>
                                                                    </div>

                                                                    {/* Resumo Card */}
                                                                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
                                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                                                        <h4 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2 relative z-10">
                                                                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                                                                            {card.key_highlights ? "Destaques Rápidos" : "Resumo Rápido (Card)"}
                                                                        </h4>
                                                                        <div className="text-[15px] text-slate-800 leading-relaxed font-medium relative z-10 w-full">
                                                                            {card.key_highlights ? (
                                                                                <ul className="space-y-3">
                                                                                    {card.key_highlights.map((h: any, i: number) => (
                                                                                        <li key={i}>
                                                                                            <b className="text-slate-900">{h.title}:</b> <span className="text-slate-600 font-normal">{h.description}</span>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            ) : (
                                                                                card.summary
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {!isHandled ? (
                                                                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                                                                            <div className="flex-1">
                                                                                <p className="text-sm font-semibold text-slate-800">Deseja salvar um Resumo?</p>
                                                                                <p className="text-xs text-slate-500 mt-1">Transforme esse tópico em um Card rápido na sua Biblioteca.</p>
                                                                            </div>
                                                                            <div className="flex gap-2 w-full sm:w-auto">
                                                                                <button
                                                                                    onClick={() => setApprovedCards(prev => [...prev, msg.id])} // Ignora visualmente
                                                                                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors text-slate-600 flex-1 sm:flex-none shadow-sm"
                                                                                >
                                                                                    Ignorar
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleApproveCard(card, msg.id)}
                                                                                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
                                                                                >
                                                                                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                                                                    Aprovar Card
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 mt-4 text-sm font-medium">
                                                                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                                            Decisão registrada na Biblioteca!
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <div className="text-sm leading-relaxed text-slate-700 markdown-body">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {msg.text}
                                                                </ReactMarkdown>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md shadow-primary/20">
                                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Loading Indicator */}
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="flex gap-3 max-w-[85%]">
                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                                            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-sm text-slate-700 shadow-sm flex items-center gap-1">
                                            <span className="size-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                            <span className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            <span className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Chat Input Wrapper */}
                    <div className="p-4 bg-white border-t border-primary/5">
                        <div className="w-full max-w-5xl mx-auto relative flex items-center transition-all duration-300">
                            <button className="absolute left-4 text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                                <span className={`material-symbols-outlined text-xl transition-colors ${
                                    sourceMode === 'youtube' ? 'text-red-500 hover:text-red-600' :
                                    sourceMode === 'twitter' ? 'text-slate-800 hover:text-black' :
                                    sourceMode === 'reddit' ? 'text-orange-500 hover:text-orange-600' :
                                    'text-slate-400 hover:text-primary'
                                }`}>
                                    {sourceMode === 'youtube' ? 'video_library' :
                                     sourceMode === 'twitter' ? 'tag' :
                                     sourceMode === 'reddit' ? 'forum' :
                                     'attach_file'}
                                </span>
                            </button>

                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className={`w-full bg-background-light border-none rounded-full py-4 pl-12 pr-16 focus:outline-none focus:ring-2 text-sm shadow-inner transition-all placeholder:text-slate-400 ${
                                    sourceMode === 'youtube' ? 'focus:ring-red-500/30' :
                                    sourceMode === 'twitter' ? 'focus:ring-slate-800/30' :
                                    sourceMode === 'reddit' ? 'focus:ring-orange-500/30' :
                                    'focus:ring-primary/30'
                                }`}
                                placeholder={
                                    sourceMode === 'youtube' ? "Cole a URL do vídeo do YouTube aqui..." :
                                    sourceMode === 'twitter' ? "Cole o link da Thread ou Tweet longo do X aqui..." :
                                    sourceMode === 'reddit' ? "Cole o link da página contendo o Post do Reddit aqui..." :
                                    "Pergunte qualquer coisa ou explique um conceito..."
                                }
                                type="text"
                                disabled={isThinking}
                            />

                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isThinking}
                                className={`absolute right-2 text-white size-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 transition-all ${
                                    sourceMode === 'youtube' ? 'bg-red-500' :
                                    sourceMode === 'twitter' ? 'bg-slate-800' :
                                    sourceMode === 'reddit' ? 'bg-orange-500' :
                                    'bg-primary'
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">arrow_upward</span>
                            </button>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}
