import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { StoryBar } from '../social/StoryBar';
import { PostCard } from '../social/PostCard';
import { PostSkeleton } from '../ui/Skeleton';
import { api } from '../../services/api';
import { Post } from '../../types';

export const HomeFeedView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'trending'>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPosts(activeTab);
      setPosts(res.posts);
    } catch (err) {
      console.error('Error fetching feed posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Feed Filter Tabs Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md pt-2 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {(['all', 'following', 'trending'] as const).map((tab) => {
            const labels = { all: 'For You', following: 'Following', trending: 'Trending' };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        <button
          onClick={fetchPosts}
          title="Refresh feed"
          className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stories Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-2 shadow-sm">
        <StoryBar />
      </div>

      {/* Post Stream */}
      <div className="space-y-6">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No posts in this feed yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch to "For You" or start following creators to populate your home feed.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};
