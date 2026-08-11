import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';
import { Avatar } from '../ui/Avatar';
import { api } from '../../services/api';

export const StoryViewerModal: React.FC = () => {
  const { activeStoryGroup, setActiveStoryGroup, addToast } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentStory: Story | undefined = activeStoryGroup ? activeStoryGroup[currentIndex] : undefined;

  useEffect(() => {
    if (!activeStoryGroup || !currentStory) return;

    // Mark as viewed
    api.markStoryViewed(currentStory.id).catch(() => {});

    if (isPaused) return;

    const timer = setTimeout(() => {
      if (currentIndex < activeStoryGroup.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setActiveStoryGroup(null);
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeStoryGroup, currentIndex, isPaused, currentStory, setActiveStoryGroup]);

  if (!activeStoryGroup || !currentStory) return null;

  const handleNext = () => {
    if (currentIndex < activeStoryGroup.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setActiveStoryGroup(null);
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addToast(`Reply sent to @${currentStory.author.username}`);
    setReplyText('');
  };

  const handleQuickReaction = (emoji: string) => {
    addToast(`Reacted ${emoji} to story!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl">
        {/* Story Container */}
        <div
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="relative w-full max-w-sm sm:max-w-md h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800"
        >
          {/* Background Media */}
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.caption || 'Story media'}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Top Overlay Gradient */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent p-4 z-10 flex flex-col gap-3">
            {/* Segmented Progress Bars */}
            <div className="flex items-center gap-1.5 w-full">
              {activeStoryGroup.map((story, i) => (
                <div
                  key={story.id}
                  className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-amber-400 transition-all ${
                      i < currentIndex
                        ? 'w-full'
                        : i === currentIndex
                        ? isPaused
                          ? 'w-1/2'
                          : 'w-full duration-[5000ms] linear'
                        : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Author Info Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar src={currentStory.author.avatarUrl} size="sm" isVerified={currentStory.author.isVerified} />
                <div>
                  <span className="block text-xs font-bold text-white leading-none">
                    {currentStory.author.displayName}
                  </span>
                  <span className="block text-[10px] text-slate-300">@{currentStory.author.username}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-mono bg-slate-900/60 px-2 py-0.5 rounded-full">
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>{currentStory.viewsCount}</span>
                </div>
                <button
                  onClick={() => setActiveStoryGroup(null)}
                  className="p-1 rounded-full bg-slate-950/60 text-white hover:bg-slate-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tap Overlay Buttons */}
          <div className="absolute inset-y-0 left-0 w-1/3 z-20" onClick={handlePrev} />
          <div className="absolute inset-y-0 right-0 w-1/3 z-20" onClick={handleNext} />

          {/* Story Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-20 inset-x-0 p-4 z-10 text-center">
              <span className="inline-block px-4 py-2 rounded-2xl bg-slate-950/70 backdrop-blur-md text-white text-sm font-medium border border-white/10 shadow-lg">
                {currentStory.caption}
              </span>
            </div>
          )}

          {/* Bottom Reply Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-30 flex flex-col gap-2">
            {/* Emoji Reactions */}
            <div className="flex items-center justify-around px-2">
              {['❤️', '🔥', '😍', '👏', '🙌', '✨'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleQuickReaction(emoji)}
                  className="text-xl hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Message Reply Form */}
            <form onSubmit={handleSendReply} className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${currentStory.author.displayName}...`}
                className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-full px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
