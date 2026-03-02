import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RecentSummaries } from './components/RecentSummaries';
import { ActiveWorkspaceTeaser } from './components/ActiveWorkspaceTeaser';
import { AINewsPortal } from './components/AINewsPortal';
import { Library } from './components/Library';
import { AIWorkspace } from './components/AIWorkspace';
import { Settings } from './components/Settings';
import { About } from './components/About';
import Login from './pages/Login';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-background-light">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light font-display text-slate-900">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView !== 'ai-workspace' && currentView !== 'settings' && currentView !== 'about' && <Header currentView={currentView} session={session} />}

        <section className={`flex-1 overflow-y-auto custom-scrollbar ${currentView === 'ai-workspace' || currentView === 'settings' ? 'p-6' : 'p-8'}`}>
          <div className="mx-auto w-full min-h-full max-w-7xl">
            {currentView === 'dashboard' && (
              <div className="flex flex-col gap-8">
                <RecentSummaries />
                <ActiveWorkspaceTeaser />
              </div>
            )}
            {currentView === 'library' && (
              <Library />
            )}
            {currentView === 'ai-workspace' && (
              <AIWorkspace />
            )}
            {currentView === 'settings' && (
              <Settings />
            )}
            {currentView === 'about' && (
              <About />
            )}
          </div>
        </section>
      </main>

      {currentView === 'dashboard' && <AINewsPortal />}
    </div>
  );
}

export default App;
