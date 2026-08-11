import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeaderMobile: React.FC = () => {
  const { setCurrentView, setIsCommandPaletteOpen } = useApp();

  return (
    <header className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between">
      <div
        onClick={() => setCurrentView('home')}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-amber-500/20">
          A
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          AMIRA
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <Search className="w-5 h-5 text-amber-500" />
        </button>
        <button
          onClick={() => setCurrentView('notifications')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
        </button>
      </div>
    </header>
  );
};
