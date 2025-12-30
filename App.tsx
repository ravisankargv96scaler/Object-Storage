import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Layers, 
  Tags, 
  Terminal, 
  ShieldCheck, 
  GraduationCap, 
  Moon, 
  Sun,
  Cloud
} from 'lucide-react';
import { TabConfig, TabId } from './types';
import CoreConcept from './components/CoreConcept';
import StructureComparison from './components/StructureComparison';
import MetadataInspector from './components/MetadataInspector';
import ApiConsole from './components/ApiConsole';
import DurabilitySimulator from './components/DurabilitySimulator';
import SummaryQuiz from './components/SummaryQuiz';

const TABS: TabConfig[] = [
  { id: 'concept', label: 'The Concept', icon: Box },
  { id: 'structure', label: 'Structure', icon: Layers },
  { id: 'metadata', label: 'Metadata', icon: Tags },
  { id: 'api', label: 'API Access', icon: Terminal },
  { id: 'durability', label: 'Durability', icon: ShieldCheck },
  { id: 'quiz', label: 'Quiz', icon: GraduationCap },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('concept');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderContent = () => {
    switch (activeTab) {
      case 'concept': return <CoreConcept />;
      case 'structure': return <StructureComparison />;
      case 'metadata': return <MetadataInspector />;
      case 'api': return <ApiConsole />;
      case 'durability': return <DurabilitySimulator />;
      case 'quiz': return <SummaryQuiz />;
      default: return <CoreConcept />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans`}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-cloud-500 p-2 rounded-lg text-white shadow-lg shadow-cloud-500/30">
              <Cloud size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              ObjectStorage<span className="text-cloud-500">.EDU</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Sidebar (Desktop) / Topbar (Mobile) */}
          <nav className="lg:w-64 flex-shrink-0">
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 lg:sticky lg:top-24 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${isActive 
                        ? 'bg-cloud-50 text-cloud-700 dark:bg-cloud-900/20 dark:text-cloud-400 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-cloud-500' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cloud-500 hidden lg:block"></div>}
                  </button>
                );
              })}
             </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} ObjectStorage.EDU - Built with React & Tailwind</p>
      </footer>
    </div>
  );
};

export default App;