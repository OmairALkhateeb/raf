'use client';

import { useApp } from '@/contexts/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-center gap-3 px-4 py-3 shadow-modal text-white text-sm font-medium pointer-events-auto max-w-xs
              ${toast.type === 'success' ? 'bg-[#2D1F1F]' : ''}
              ${toast.type === 'error' ? 'bg-red-600' : ''}
              ${toast.type === 'info' ? 'bg-blue-600' : ''}
            `}
          >
            {toast.type === 'success' && <CheckCircle size={18} className="text-[#C9A84C] flex-shrink-0" />}
            {toast.type === 'error' && <XCircle size={18} className="flex-shrink-0" />}
            {toast.type === 'info' && <Info size={18} className="flex-shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
