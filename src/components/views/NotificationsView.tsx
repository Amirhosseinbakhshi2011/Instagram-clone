import React, { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Repeat2, CheckCheck } from 'lucide-react';
import { api } from '../../services/api';
import { Notification } from '../../types';
import { Avatar } from '../ui/Avatar';
import { useApp } from '../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { navigateToProfile } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getNotifications();
        setNotifications(res.notifications);
      } catch (err) {
        console.error('Notif load error:', err);
      }
    }
    load();
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.markNotificationsRead();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'likes') return n.type === 'like';
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'follows') return n.type === 'follow';
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Notifications
          </h2>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'likes', 'comments', 'follows'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800/50 shadow-sm overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">No notifications found.</div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                !n.isRead ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar src={n.actor.avatarUrl} size="md" isVerified={n.actor.isVerified} />
                <div className="text-xs space-y-0.5">
                  <p className="text-slate-900 dark:text-white leading-relaxed">
                    <span
                      onClick={() => navigateToProfile(n.actor.username)}
                      className="font-bold hover:underline cursor-pointer mr-1"
                    >
                      {n.actor.displayName}
                    </span>
                    {n.type === 'like' && 'liked your post.'}
                    {n.type === 'comment' && `commented: "${n.commentContent}"`}
                    {n.type === 'follow' && 'started following you.'}
                    {n.type === 'repost' && 'reposted your creation.'}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">10m ago</span>
                </div>
              </div>

              {/* Action Preview */}
              {n.postMediaUrl ? (
                <img
                  src={n.postMediaUrl}
                  alt="post media"
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                n.type === 'follow' && (
                  <button
                    onClick={() => navigateToProfile(n.actor.username)}
                    className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                  >
                    View
                  </button>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
