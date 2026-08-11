import React from 'react';
import {
  Home,
  Compass,
  MessageSquare,
  Bell,
  PlusSquare,
  User as UserIcon,
  Settings,
  Shield,
  Sparkles,
  Sun,
  Moon,
  Search,
} from 'lucide-react';
import { useApp, ViewType } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';

export const LeftSidebar: React.FC = () => {
  const { currentView, setCurrentView, setIsCreatePostOpen, setIsCommandPaletteOpen, navigateToProfile } = useApp();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" />, badge: 1 },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: 2 },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  if (user?.role === 'ADMIN' || user?.role === 'MODERATOR') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: <Shield className="w-5 h-5 text-amber-500" /> });
  }

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 xl:p-6 z-30 select-none">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl font-black tracking-tighter">A</span>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-slate-900 via-slate-800 to-amber-500 dark:from-white dark:via-slate-200 dark:to-amber-400 bg-clip-text text-transparent">
              AMIRA
            </span>
            <span className="block text-[10px] font-mono font-medium tracking-wider text-amber-500 uppercase">
              NEXT GEN SOCIAL
            </span>
          </div>
        </div>

        {/* Quick Search Launcher */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-amber-500" />
            <span>Search Amira...</span>
          </div>
          <kbd className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile' && user) {
                    navigateToProfile(user.username);
                  } else {
                    setCurrentView(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={isActive ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Create Post Button */}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
        >
          <PlusSquare className="w-5 h-5" />
          <span>New Amira Post</span>
        </button>
      </div>

      {/* Bottom Section: Theme & Creator Profile */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{theme === 'dark' ? 'Obsidian Dark' : 'Crystal Light'}</span>
          </div>
          <span className="text-[10px] text-amber-500 font-mono uppercase">Theme</span>
        </button>

        {/* User Profile Mini Card */}
        {user && (
          <div
            onClick={() => navigateToProfile(user.username)}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Avatar src={user.avatarUrl} size="md" isVerified={user.isVerified} />
              <div className="truncate">
                <span className="block text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user.displayName}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                  @{user.username}
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
          </div>
        )}

        {/* Creator Attribution */}
        <div className="text-[11px] text-slate-400 dark:text-slate-600 px-3 text-center">
          Designed & Created by{' '}
          <a
            href="https://github.com/Amirhosseinbakhshi2011"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:underline font-medium"
          >
            Amirhossein Bakhshi
          </a>
        </div>
      </div>
    </aside>
  );
};
