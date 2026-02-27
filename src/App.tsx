import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RecentSummaries } from './components/RecentSummaries';
import { ActiveWorkspaceTeaser } from './components/ActiveWorkspaceTeaser';
import { AINewsPortal } from './components/AINewsPortal';
import { Library } from './components/Library';
import { AIWorkspace } from './components/AIWorkspace';
import { Settings } from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-background-light font-display text-slate-900">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView !== 'ai-workspace' && currentView !== 'settings' && <Header />}

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
          </div>
        </section>
      </main>

      {currentView === 'dashboard' && <AINewsPortal />}
    </div>
  );
}

export default App;
