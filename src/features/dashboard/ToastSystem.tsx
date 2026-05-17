import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { X, Zap, CheckCircle2, AlertTriangle, Lightbulb, Focus } from 'lucide-react';
import type { ToastNotification } from '../../store/slices/dashboardSlice';

const toastConfig = {
  xp: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: <Zap size={16} /> },
  streak: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: <Zap size={16} /> },
  insight: { color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.25)', icon: <Lightbulb size={16} /> },
  focus: { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', icon: <Focus size={16} /> },
  success: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: <CheckCircle2 size={16} /> },
  warning: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: <AlertTriangle size={16} /> },
};

const Toast: React.FC<{ toast: ToastNotification; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const cfg = toastConfig[toast.type];

  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex items-start gap-3 p-3.5 rounded-xl min-w-[260px] max-w-xs relative overflow-hidden"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, backdropFilter: 'blur(20px)' }}
    >
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (toast.duration ?? 4000) / 1000, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-full"
        style={{ background: cfg.color }}
      />

      <span style={{ color: cfg.color }} className="shrink-0 mt-0.5">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-foreground">{toast.title}</p>
        {toast.body && <p className="text-[10px] text-muted-foreground mt-0.5">{toast.body}</p>}
        {toast.xpAmount && (
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.4 }}
            className="text-sm font-black mt-0.5"
            style={{ color: '#10B981' }}
          >
            +{toast.xpAmount} XP
          </motion.p>
        )}
      </div>
      <button onClick={() => onRemove(toast.id)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
        <X size={13} />
      </button>
    </motion.div>
  );
};

export const ToastSystem: React.FC = () => {
  const { toastQueue, removeToast } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toastQueue.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
