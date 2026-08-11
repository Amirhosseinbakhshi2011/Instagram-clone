import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Repeat2,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Pin,
  Flag,
  Trash2,
  Send,
  Sparkles,
} from 'lucide-react';
import { Post, Comment } from '../../types';
import { Avatar } from '../ui/Avatar';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface PostCardProps {
  post: Post;
  onPostUpdated?: (updated: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const { navigateToProfile, addToast, setActiveMediaUrl } = useApp();
  const { user } = useAuth();

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [savesCount, setSavesCount] = useState(post.savesCount);
  const [isReposted, setIsReposted] = useState(post.isReposted || false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount);
  const [isPinned, setIsPinned] = useState(post.isPinned || false);

  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : prev - 1));
    try {
      await api.toggleLikePost(post.id);
    } catch (err) {
      console.error('Like toggle error:', err);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 900);
  };

  const handleSave = async () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    setSavesCount((prev) => (nextState ? prev + 1 : prev - 1));
    addToast(nextState ? 'Post saved to collection' : 'Post removed from saved');
    try {
      await api.toggleSavePost(post.id);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleRepost = async () => {
    const nextState = !isReposted;
    setIsReposted(nextState);
    setRepostsCount((prev) => (nextState ? prev + 1 : prev - 1));
    addToast(nextState ? 'Reposted on your profile' : 'Repost undone');
    try {
      await api.toggleRepost(post.id);
    } catch (err) {
      console.error('Repost error:', err);
    }
  };

  const handleTogglePin = async () => {
    setIsPinned(!isPinned);
    setIsMenuOpen(false);
    addToast(!isPinned ? 'Post pinned to top' : 'Post unpinned');
    try {
      await api.togglePinPost(post.id);
    } catch (err) {
      console.error('Pin error:', err);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Post link copied to clipboard!');
    }
  };

  const handleReport = async () => {
    setIsMenuOpen(false);
    try {
      await api.reportPost(post.id, 'Inappropriate content');
      addToast('Report submitted to moderation queue', 'info');
    } catch (err) {
      addToast('Error submitting report', 'error');
    }
  };

  const loadComments = async () => {
    if (!isCommentsOpen && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await api.getComments(post.id);
        setComments(res.comments);
      } catch (err) {
        console.error('Comments error:', err);
      } finally {
        setLoadingComments(false);
      }
    }
    setIsCommentsOpen(!isCommentsOpen);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const text = commentInput.trim();
    setCommentInput('');

    try {
      const res = await api.addComment(post.id, text);
      if (res.comment) {
        setComments((prev) => [res.comment, ...prev]);
        addToast('Comment posted!');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Pinned Badge Header if applicable */}
      {isPinned && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 text-amber-500 text-xs font-semibold border-b border-amber-500/20">
          <Pin className="w-3.5 h-3.5" />
          <span>Pinned Post</span>
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div
          onClick={() => navigateToProfile(post.author.username)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Avatar src={post.author.avatarUrl} size="md" isVerified={post.author.isVerified} />
          <div>
            <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
              {post.author.displayName}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>@{post.author.username}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-1.5 text-xs font-medium space-y-1">
              <button
                onClick={handleTogglePin}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Pin className="w-4 h-4 text-amber-500" />
                <span>{isPinned ? 'Unpin from Top' : 'Pin to Top'}</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Share2 className="w-4 h-4 text-sky-500" />
                <span>Copy Share Link</span>
              </button>
              <button
                onClick={handleReport}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10"
              >
                <Flag className="w-4 h-4" />
                <span>Report Post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media View (Single or Carousel) */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative aspect-square sm:aspect-[4/3] w-full bg-slate-950 overflow-hidden cursor-pointer select-none group"
      >
        <img
          src={post.media[currentMediaIndex]?.url}
          alt={post.media[currentMediaIndex]?.altText || post.caption}
          onClick={() => setActiveMediaUrl(post.media[currentMediaIndex]?.url)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Heart Burst Overlay Animation */}
        <AnimatePresence>
          {showHeartOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Arrow Controls */}
        {post.media.length > 1 && (
          <>
            {currentMediaIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex((prev) => prev - 1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentMediaIndex < post.media.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex((prev) => prev + 1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Dots Indicator */}
            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
              {post.media.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentMediaIndex ? 'bg-amber-400 w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Post Actions Bar */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-125 ${
                isLiked ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>

            {/* Comments */}
            <button
              onClick={loadComments}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{post.commentsCount}</span>
            </button>

            {/* Repost */}
            <button
              onClick={handleRepost}
              className={`flex items-center gap-1.5 text-xs font-bold ${
                isReposted ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Repeat2 className="w-6 h-6" />
              <span>{repostsCount}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Save */}
            <button
              onClick={handleSave}
              className={`p-1 text-slate-600 dark:text-slate-400 ${
                isSaved ? 'text-amber-500' : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Caption & Hashtags */}
        <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
          <p className="whitespace-pre-line">
            <span
              onClick={() => navigateToProfile(post.author.username)}
              className="font-bold text-slate-900 dark:text-white hover:text-amber-500 cursor-pointer mr-2"
            >
              {post.author.username}
            </span>
            {post.caption}
          </p>

          {/* Hashtag Badges */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-amber-500 hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Drawer / Section */}
        {isCommentsOpen && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            {loadingComments ? (
              <div className="text-xs text-slate-400">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-xs text-slate-400">No comments yet. Be the first!</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                    <Avatar src={comment.author.avatarUrl} size="xs" />
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="font-bold text-slate-900 dark:text-white mr-2">
                        {comment.author.username}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{comment.content}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment to Amira..."
                className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};
