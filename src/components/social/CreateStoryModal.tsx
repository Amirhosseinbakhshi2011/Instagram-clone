import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const CreateStoryModal: React.FC = () => {
  const { isCreateStoryOpen, setIsCreateStoryOpen, addToast } = useApp();
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
  );
  const [caption, setCaption] = useState('New update live on Amira! ✨');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.createStory({ mediaUrl, mediaType: 'image', caption });
      addToast('Story created! Active for 24 hours.');
      setIsCreateStoryOpen(false);
    } catch (err) {
      addToast('Error publishing story', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isCreateStoryOpen}
      onClose={() => setIsCreateStoryOpen(false)}
      title="Create Story"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Story Media URL
          </label>
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="relative aspect-[9/16] max-h-72 w-full rounded-2xl overflow-hidden bg-slate-950 mx-auto border border-slate-800">
          <img src={mediaUrl} alt="Story preview" className="w-full h-full object-cover" />
          {caption && (
            <div className="absolute bottom-4 inset-x-4 text-center">
              <span className="inline-block px-3 py-1.5 rounded-xl bg-slate-950/80 text-white text-xs font-medium">
                {caption}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Caption Overlay
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add story text..."
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={() => setIsCreateStoryOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" isLoading={isLoading}>
            Share to Story
          </Button>
        </div>
      </form>
    </Modal>
  );
};
