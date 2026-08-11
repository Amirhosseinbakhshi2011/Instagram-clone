import React, { useState } from 'react';
import { Sparkles, TrendingUp, UserPlus, Check, ExternalLink } from 'lucide-react';
import { INITIAL_USERS } from '../../data/initialData';
import { Avatar } from '../ui/Avatar';
import { useApp } from '../../context/AppContext';

export const RightSidebar: React.FC = () => {
  const { navigateToProfile, setCurrentView } = useApp();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    user_elena: false,
    user_alex: false,
    user_neda: false,
  });

  const toggleFollow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const suggested = INITIAL_USERS.slice(3, 7);

  const trendingHashtags = [
    { tag: 'AmiraExcellence', posts: '14.2K posts', category: 'Platform Trend' },
    { tag: 'FutureUI', posts: '9.8K posts', category: 'Design & UX' },
    { tag: 'DesignSystems', posts: '22.1K posts', category: 'Technology' },
    { tag: 'TehranCreatives', posts: '6.4K posts', category: 'Community' },
    { tag: 'MachineLearning', posts: '31.5K posts', category: 'AI & Research' },
  ];

  return (
    <aside className="hidden lg:block w-80 xl:w-88 h-screen sticky top-0 border-l border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-6 z-20 space-y-6 overflow-y-auto">
      {/* Creator Spotlight Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 p-4 border border-amber-500/30 shadow-xl text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wide uppercase border border-amber-500/30">
            <Sparkles className="w-3 h-3" /> CREATOR SPOTLIGHT
          </span>
          <span className="text-[10px] font-mono text-slate-400">v2.0.0</span>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Amirhossein Bakhshi</h4>
        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          Lead Architect & Designer of Amira Social Platform. Building world-class web applications.
        </p>
        <a
          href="https://github.com/Amirhosseinbakhshi2011"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
        >
          <span>GitHub Profile</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Suggested Accounts */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Suggested Creators</h3>
          <button
            onClick={() => setCurrentView('explore')}
            className="text-xs font-semibold text-amber-500 hover:underline"
          >
            See All
          </button>
        </div>

        <div className="space-y-3">
          {suggested.map((creator) => {
            const isFollowing = followingMap[creator.id];
            return (
              <div
                key={creator.id}
                onClick={() => navigateToProfile(creator.username)}
                className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Avatar src={creator.avatarUrl} size="sm" isVerified={creator.isVerified} />
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {creator.displayName}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      @{creator.username}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => toggleFollow(creator.id, e)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                    isFollowing
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <span>Trending on Amira</span>
        </div>

        <div className="space-y-2.5">
          {trendingHashtags.map((item) => (
            <div
              key={item.tag}
              onClick={() => setCurrentView('explore')}
              className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{item.category}</span>
              </div>
              <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-amber-500 transition-colors">
                #{item.tag}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.posts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-slate-400 dark:text-slate-600 space-y-2 px-2 leading-relaxed">
        <p>© 2026 AMIRA Social Platform. All rights reserved.</p>
        <p>
          Architected & Designed by{' '}
          <a
            href="https://github.com/Amirhosseinbakhshi2011"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:underline font-medium"
          >
            Amirhossein Bakhshi
          </a>
        </p>
      </div>
    </aside>
  );
};
