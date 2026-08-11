import React from 'react';
import { Home, Compass, PlusSquare, MessageSquare, Bell, User as UserIcon } from 'lucide-react';
import { useApp, ViewType } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, setIsCreatePostOpen, navigateToProfile } = useApp();
  const { user } = useAuth();

  const items: { id: ViewType | 'create'; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'create', label: 'Create', icon: <PlusSquare className="w-6 h-6 text-amber-500" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2 flex items-center justify-around select-none">
      {items.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'create') {
                setIsCreatePostOpen(true);
              } else if (item.id === 'profile' && user) {
                navigateToProfile(user.username);
              } else {
                setCurrentView(item.id as ViewType);
              }
            }}
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              isActive
                ? 'text-amber-500 dark:text-amber-400 font-semibold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
