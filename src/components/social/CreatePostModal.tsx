import React, { useState } from 'react';
import { Sparkles, Image, MapPin, Hash, Wand2, RefreshCw } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const CreatePostModal: React.FC = () => {
  const { isCreatePostOpen, setIsCreatePostOpen, addToast, setCurrentView } = useApp();

  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200'
  );
  const [location, setLocation] = useState('Tehran / Innovation Hub');
  const [hashtags, setHashtags] = useState<string[]>(['AmiraExcellence', 'FutureUI']);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const sampleMediaPresets = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
  ];

  const handleAiGenerateCaption = async () => {
    setIsAiLoading(true);
    try {
      const res = await api.generateAiCaption(caption, 'Modern luxury design & AI social innovation');
      setCaption(res.caption);
      addToast('AI Caption generated using Gemini 3.6 Flash!');
    } catch (err) {
      addToast('Failed to generate AI caption', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiSuggestHashtags = async () => {
    if (!caption) {
      addToast('Please write a caption first to suggest hashtags', 'info');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await api.suggestHashtags(caption);
      setHashtags(res.hashtags);
      addToast('Hashtags suggested by Gemini AI!');
    } catch (err) {
      addToast('Failed to suggest hashtags', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiPolishText = async () => {
    if (!caption) return;
    setIsAiLoading(true);
    try {
      const res = await api.rewriteCaption(caption);
      setCaption(res.rewrittenText);
      addToast('Caption polished with AI!');
    } catch (err) {
      addToast('Failed to polish text', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      await api.createPost({
        caption,
        media: [
          {
            id: `media_${Date.now()}`,
            url: mediaUrl,
            type: 'image',
          },
        ],
        location,
        hashtags,
      });

      addToast('Post published on Amira!');
      setIsCreatePostOpen(false);
      setCaption('');
      setCurrentView('home');
    } catch (err) {
      addToast('Error creating post', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Modal
      isOpen={isCreatePostOpen}
      onClose={() => setIsCreatePostOpen(false)}
      title="Create Amira Post"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Media Preview & Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Post Media URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Paste media image URL..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-mono">Presets:</span>
            {sampleMediaPresets.map((preset, idx) => (
              <img
                key={idx}
                src={preset}
                alt="preset"
                onClick={() => setMediaUrl(preset)}
                className={`w-10 h-10 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                  mediaUrl === preset ? 'border-amber-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mt-2">
            <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Caption Input & AI Toolbar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Caption
            </label>

            {/* Gemini AI Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAiGenerateCaption}
                disabled={isAiLoading}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Generate</span>
              </button>

              <button
                type="button"
                onClick={handleAiPolishText}
                disabled={isAiLoading || !caption}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-medium transition-colors flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3 text-amber-500" />
                <span>AI Polish</span>
              </button>
            </div>
          </div>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Share your thoughts, story, or project details..."
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Location & Hashtags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Location
            </label>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Hashtags
              </label>
              <button
                type="button"
                onClick={handleAiSuggestHashtags}
                className="text-[10px] text-amber-500 font-bold hover:underline"
              >
                Auto-Suggest AI Tags
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
              <Hash className="w-4 h-4 text-amber-500" />
              <input
                type="text"
                value={hashtags.join(', ')}
                onChange={(e) =>
                  setHashtags(
                    e.target.value
                      .split(',')
                      .map((t) => t.trim().replace(/^#/, ''))
                      .filter(Boolean)
                  )
                }
                placeholder="Comma separated"
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsCreatePostOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            isLoading={isPublishing}
          >
            Publish Post
          </Button>
        </div>
      </form>
    </Modal>
  );
};
