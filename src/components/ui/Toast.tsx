import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            onClick={() => removeToast(toast.id)}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl bg-slate-900/95 dark:bg-slate-800/95 border border-slate-700/80 text-white text-sm backdrop-blur-md cursor-pointer"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />}
            <span className="font-medium text-slate-100">{toast.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
