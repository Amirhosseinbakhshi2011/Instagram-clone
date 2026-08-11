import React, { useState, useEffect } from 'react';
import { Search, Compass, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { Post, User } from '../../types';
import { Avatar } from '../ui/Avatar';
import { useApp } from '../../context/AppContext';

export const ExploreView: React.FC = () => {
  const { navigateToProfile, setActiveMediaUrl } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<{ name: string; postsCount: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExploreData() {
      setIsLoading(true);
      try {
        const res = await api.getExplore();
        setPosts(res.trendingPosts);
        setUsers(res.trendingUsers);
        setCategories(['All', ...res.categories]);
        setHashtags(res.hashtags);
      } catch (err) {
        console.error('Explore error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadExploreData();
  }, []);

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.caption.toLowerCase().includes(q) ||
      p.author.displayName.toLowerCase().includes(q) ||
      p.hashtags.some((h) => h.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Explore Amira
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators, topics, hashtags, location..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Creators Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Top Spotlight Creators
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => navigateToProfile(u.username)}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer hover:border-amber-500/50 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <Avatar src={u.avatarUrl} size="lg" isVerified={u.isVerified} />
              <span className="block text-xs font-bold text-slate-900 dark:text-white mt-2 truncate w-full">
                {u.displayName}
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate w-full">
                @{u.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Media Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Curated Visual Gallery
          </h3>
          <span className="text-xs text-amber-500 font-medium">{filteredPosts.length} posts</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setActiveMediaUrl(post.media[0]?.url)}
                className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 group cursor-pointer border border-slate-200/60 dark:border-slate-800/60"
              >
                <img
                  src={post.media[0]?.url}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover Dark Overlay */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
