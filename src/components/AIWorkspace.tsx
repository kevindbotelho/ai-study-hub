import { useState } from 'react';

export function AIWorkspace() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            text: 'Good afternoon, Alex. How can I help you with your research material today?',
        }
    ]);

    const [input, setInput] = useState('');

    const attachments = [
        { id: 1, name: 'Lecture_Notes.pdf', icon: 'description' },
        { id: 2, name: 'Research_Paper.pdf', icon: 'article' },
    ];

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages([...messages, { id: Date.now(), role: 'user', text: input }]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    role: 'ai',
                    text: 'I can certainly help with that! However, this is a static demo for now. In a real app, I would process that request.'
                }
            ]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-background-light font-display text-slate-900 rounded-2xl border border-primary/10 overflow-hidden shadow-sm">

            {/* Header inside the workspace area */}
            <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-primary/10">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                    <h1 className="text-xl font-bold tracking-tight">AI Workspace</h1>
                </div>
                <button
                    onClick={() => setMessages([{ id: Date.now(), role: 'ai', text: 'Good afternoon! How can I help you today?' }])}
                    className="bg-primary text-white px-5 py-2 rounded-full font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Chat
                </button>
            </header>

            <main className="flex flex-1 overflow-hidden">

                {/* Left Pane: Context */}
                <aside className="hidden lg:flex w-72 border-r border-primary/10 bg-white p-6 flex-col gap-6 overflow-y-auto">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Context</h3>
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
                                <span className="text-sm">Add Material</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-primary/5 pt-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Quick Links</h3>
                        <nav className="space-y-1">
                            <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-slate-600 transition-colors">
                                <span className="material-symbols-outlined text-slate-400">history</span>
                                <span className="text-sm font-medium">Recent Activity</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/5 text-slate-600 transition-colors">
                                <span className="material-symbols-outlined text-slate-400">folder</span>
                                <span className="text-sm font-medium">Saved Projects</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Right Pane: Main Chat Interface */}
                <section className="flex-1 flex flex-col relative bg-white overflow-hidden">

                    {/* Chat Feed */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 flex flex-col">

                        {messages.length === 1 && (
                            <div className="flex flex-col items-center justify-center text-center pt-[10vh] pb-8 space-y-6">
                                <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-4xl">smart_toy</span>
                                </div>
                                <div className="max-w-md">
                                    <h2 className="text-2xl font-bold mb-2">Good afternoon</h2>
                                    <p className="text-slate-500 text-sm">How can I help you with your research material today?</p>
                                </div>

                                {/* Quick Action Pills */}
                                <div className="flex flex-wrap justify-center gap-3 max-w-lg mt-4">
                                    <button
                                        onClick={() => setInput("Summarize a Video")}
                                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-primary/20 rounded-full text-slate-700 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg text-primary">video_library</span>
                                        Summarize a Video
                                    </button>
                                    <button
                                        onClick={() => setInput("Create Flashcards")}
                                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-primary/20 rounded-full text-slate-700 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg text-primary">style</span>
                                        Create Flashcards
                                    </button>
                                    <button
                                        onClick={() => setInput("Explain a Concept")}
                                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-primary/20 rounded-full text-slate-700 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg text-primary">lightbulb</span>
                                        Explain a Concept
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6 flex-1 flex flex-col justify-end">
                            {messages.map((msg, index) => {
                                if (index === 0 && messages.length === 1) return null; // Hide welcome message if it's the only one (handled by empty state)

                                return (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'ai' ? (
                                            <div className="flex gap-3 max-w-[85%]">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                                                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                                </div>
                                                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-sm text-slate-700 shadow-sm">
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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
                        </div>
                    </div>

                    {/* Chat Input Wrapper */}
                    <div className="p-4 bg-white border-t border-primary/5">
                        <div className="max-w-4xl mx-auto relative flex items-center">
                            <button className="absolute left-4 text-slate-400 hover:text-primary transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">attach_file</span>
                            </button>

                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="w-full bg-background-light border-none rounded-full py-4 pl-12 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm shadow-inner transition-all placeholder:text-slate-400"
                                placeholder="Ask anything about your files..."
                                type="text"
                            />

                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="absolute right-2 bg-primary disabled:bg-primary/50 text-white size-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg disabled:hover:shadow-md transition-all"
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
