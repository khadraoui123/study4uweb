import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Brain, X, Zap, Calendar, Target, AlertTriangle, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NeuralInsight } from '../../store/slices/dashboardSlice';

const typeConfig = {
  warning: { color: '#F59E0B', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', icon: <AlertTriangle size={16} /> },
  tip: { color: '#06B6D4', bg: 'rgba(6,182,212,0.06)', border: 'rgba(6,182,212,0.2)', icon: <Lightbulb size={16} /> },
  achievement: { color: '#10B981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', icon: <TrendingUp size={16} /> },
  urgent: { color: '#EF4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', icon: <AlertTriangle size={16} /> },
};

const actionIcons: Record<string, React.ReactNode> = {
  brain: <Brain size={12} />,
  zap: <Zap size={12} />,
  calendar: <Calendar size={12} />,
  target: <Target size={12} />,
};

const InsightCard: React.FC<{ insight: NeuralInsight; onDismiss: (id: string) => void }> = ({ insight, onDismiss }) => {
  const navigate = useNavigate();
  const cfg = typeConfig[insight.type];
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, height: 0 }}
      className="rounded-xl p-4 relative overflow-hidden group"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {/* Glow accent */}
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: cfg.color }} />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span style={{ color: cfg.color }}>{cfg.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>
              {insight.type}
            </span>
          </div>
          <button
            onClick={() => onDismiss(insight.id)}
            className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-sm font-black text-foreground leading-snug mb-1">{insight.title}</p>
        
        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-xs text-muted-foreground leading-relaxed mb-3 overflow-hidden"
            >
              {insight.body}
            </motion.p>
          )}
        </AnimatePresence>

        {!expanded && (
          <button onClick={() => setExpanded(true)} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors mb-2">
            Show details →
          </button>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {insight.actions.map((action, i) => (
            <button
              key={i}
              onClick={() => action.route && navigate(action.route)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
              style={{
                background: i === 0 ? cfg.color : 'rgba(255,255,255,0.05)',
                color: i === 0 ? '#fff' : cfg.color,
                border: `1px solid ${i === 0 ? cfg.color : cfg.border}`,
              }}
            >
              {actionIcons[action.icon] ?? <ArrowRight size={12} />}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const NeuralInsightPanel: React.FC = React.memo(() => {
  const neuralInsights = useStore(state => state.neuralInsights);
  const dismissInsight = useStore(state => state.dismissInsight);
  const aiActivityStatus = useStore(state => state.aiActivityStatus);
  const setAIStatus = useStore(state => state.setAIStatus);

  const active = React.useMemo(() => neuralInsights.filter(i => !i.dismissed), [neuralInsights]);

  const handleRefresh = React.useCallback(() => {
    setAIStatus('analyzing');
    setTimeout(() => setAIStatus('active'), 2000);
  }, [setAIStatus]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center relative" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <Brain size={16} style={{ color: '#7C3AED' }} />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Neural Insight</h3>
            <p className="text-[10px] text-muted-foreground">
              {aiActivityStatus === 'analyzing' ? 'Analyzing your patterns...' : `${active.length} active insights`}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={aiActivityStatus === 'analyzing'}
          className="text-[10px] font-black uppercase tracking-widest gap-1.5 h-8"
          style={{ color: '#7C3AED' }}
        >
          {aiActivityStatus === 'analyzing' ? (
            <span className="animate-pulse">Analyzing...</span>
          ) : (
            <>Refresh <Zap size={12} /></>
          )}
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {active.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center space-y-2"
          >
            <Brain size={28} className="mx-auto text-muted-foreground/40" />
            <p className="text-sm font-bold text-muted-foreground">All insights addressed.</p>
            <p className="text-xs text-muted-foreground/60">The AI is monitoring your activity.</p>
          </motion.div>
        ) : (
          active.slice(0, 4).map(insight => (
            <InsightCard key={insight.id} insight={insight} onDismiss={dismissInsight} />
          ))
        )}
      </AnimatePresence>
    </div>
  );
});
