import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MediaViewerModal: React.FC = () => {
  const { activeMediaUrl, setActiveMediaUrl } = useApp();

  if (!activeMediaUrl) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl"
        >
          <button
            onClick={() => setActiveMediaUrl(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={activeMediaUrl}
            alt="Full resolution media preview"
            className="w-full h-full max-h-[85vh] object-contain"
          />

          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>High-Definition Amira Media View</span>
            <a
              href={activeMediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-500 hover:underline"
            >
              <span>Open Original</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
