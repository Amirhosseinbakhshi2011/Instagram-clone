import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Story, User } from '../../types';
import { Avatar } from '../ui/Avatar';

export const StoryBar: React.FC = () => {
  const { setActiveStoryGroup, setIsCreateStoryOpen } = useApp();
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await api.getStories();
        setStories(res.stories);
      } catch (err) {
        console.error('Error loading stories:', err);
      }
    }
    loadStories();
  }, []);

  // Group stories by author
  const groupedStories: { [authorId: string]: { author: User; stories: Story[]; hasUnseen: boolean } } = {};

  stories.forEach((story) => {
    if (!groupedStories[story.author.id]) {
      groupedStories[story.author.id] = {
        author: story.author,
        stories: [],
        hasUnseen: false,
      };
    }
    groupedStories[story.author.id].stories.push(story);
    if (!story.hasViewed) {
      groupedStories[story.author.id].hasUnseen = true;
    }
  });

  const storyGroups = Object.values(groupedStories);

  return (
    <div className="flex items-center gap-4 overflow-x-auto py-3 px-1 no-scrollbar select-none">
      {/* Create Story Button */}
      {user && (
        <div
          onClick={() => setIsCreateStoryOpen(true)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-amber-500/60 p-0.5 flex items-center justify-center bg-slate-100 dark:bg-slate-900 group-hover:scale-105 transition-transform">
            <Avatar src={user.avatarUrl} size="lg" />
            <div className="absolute bottom-0 right-0 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            Your Story
          </span>
        </div>
      )}

      {/* Story Items */}
      {storyGroups.map((group) => (
        <div
          key={group.author.id}
          onClick={() => setActiveStoryGroup(group.stories)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
        >
          <div className="group-hover:scale-105 transition-transform">
            <Avatar
              src={group.author.avatarUrl}
              size="lg"
              hasStory={true}
              storyViewed={!group.hasUnseen}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate max-w-[68px]">
            {group.author.displayName.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
};
