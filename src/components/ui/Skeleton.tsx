import React from 'react';

export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-1.5 flex-1">
          <div className="w-32 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-20 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded" />
        </div>
      </div>
      <div className="w-full h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="space-y-2">
        <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-1/2 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>
    </div>
  );
};

export const UserCardSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-1.5 flex-1">
        <div className="w-28 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-20 h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>
      <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
  );
};
