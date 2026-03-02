export const About = () => {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Sobre o Projeto
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-slate-900">AI Study Hub</h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Uma plataforma inteligente dedicada à curadoria e ao estudo de Inteligência Artificial, 
          onde a própria tecnologia auxilia no processo de aprendizado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-all group">
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Estudar IA com IA</h3>
          <p className="text-slate-500 leading-relaxed">
            O objetivo central deste hub é utilizar o poder das IAs modernas para filtrar o excesso de informação 
            e focar no que realmente importa. Aqui, os resumos não são apenas textos, são sínteses inteligentes.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-all group">
          <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Automação Inteligente</h3>
          <p className="text-slate-500 leading-relaxed">
            Utilizamos fluxos no <strong>n8n</strong> e scripts em <strong>Python</strong> para buscar as notícias 
            mais recentes. O processamento é feito por modelos de linguagem de ponta para garantir qualidade.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 text-white overflow-hidden relative group">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4">Parceria com Antigravity</h3>
          <p className="text-slate-300 leading-relaxed max-w-2xl mb-6">
            Este projeto é um laboratório vivo desenvolvido com o apoio direto do <strong>Google Antigravity</strong>. 
            Cada linha de código, design e funcionalidade foi refinada através dessa colaboração única entre humano e máquina.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="size-8 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">GB</div>
              <div className="size-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">AG</div>
            </div>
            <span className="text-xs font-medium text-slate-400 italic">Uma nova era de produtividade assistida</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
      </div>

      <div className="text-center pt-8 border-t border-primary/5">
        <p className="text-sm text-slate-400">
          Desenvolvido com ❤️ por <a href="https://github.com/kevindbotelho" className="text-primary font-bold hover:underline" target="_blank" rel="noreferrer">Kevin Botelho</a>
        </p>
      </div>
    </div>
  );
};
