import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User as UserIcon, Hash, Home, Compass, MessageSquare, Bell, Settings, X, Sparkles } from 'lucide-react';
import { useApp, ViewType } from '../../context/AppContext';
import { api } from '../../services/api';
import { User, Post } from '../../types';
import { Avatar } from '../ui/Avatar';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setCurrentView, navigateToProfile } = useApp();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setPosts([]);
      setHashtags([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query);
        setUsers(res.users);
        setPosts(res.posts);
        setHashtags(res.hashtags);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  const handleSelectUser = (username: string) => {
    navigateToProfile(username);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-amber-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search creators, posts, hashtags or commands..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
                autoFocus
              />
              <button
                onClick={() => setIsCommandPaletteOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
              {!query.trim() && (
                <div className="space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigateTo('home')}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                    >
                      <Home className="w-4 h-4 text-amber-500" />
                      <span>Home Feed</span>
                    </button>
                    <button
                      onClick={() => navigateTo('explore')}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                    >
                      <Compass className="w-4 h-4 text-amber-500" />
                      <span>Explore & Trends</span>
                    </button>
                    <button
                      onClick={() => navigateTo('messages')}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      <span>Direct DMs</span>
                    </button>
                    <button
                      onClick={() => navigateTo('settings')}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4 text-amber-500" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {loading && (
                <div className="py-8 text-center text-slate-400 text-sm">Searching Amira network...</div>
              )}

              {/* Users Results */}
              {users.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
                    Creators & Profiles
                  </div>
                  {users.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => handleSelectUser(u.username)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatarUrl} size="sm" isVerified={u.isVerified} />
                        <div>
                          <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                            {u.displayName}
                          </span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            @{u.username}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-amber-500 font-medium">View Profile</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hashtags Results */}
              {hashtags.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
                    Hashtags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => navigateTo('explore')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-semibold hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                      >
                        <Hash className="w-3.5 h-3.5" />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts Results */}
              {posts.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
                    Matching Posts
                  </div>
                  {posts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => navigateTo('home')}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar src={p.author.avatarUrl} size="xs" />
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {p.author.displayName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {p.caption}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
