import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertTriangle, Zap, Brain, ArrowRight, GripVertical, Target, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const urgencyConfig = {
  URGENT: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', label: 'URGENT', icon: <AlertTriangle size={16} /> },
  NORMAL: { color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', label: 'NORMAL', icon: <Clock size={16} /> },
  LOW: { color: '#6B7280', bg: 'rgba(107,114,128,0.06)', label: 'LOW', icon: <Clock size={16} /> },
};

interface XPBurstProps { amount: number; onDone: () => void; }
const XPBurst: React.FC<XPBurstProps> = ({ amount, onDone }) => (
  <motion.div
    initial={{ opacity: 1, y: 0, scale: 1 }}
    animate={{ opacity: 0, y: -60, scale: 1.4 }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    onAnimationComplete={onDone}
    className="absolute top-2 right-2 z-50 pointer-events-none"
  >
    <span className="text-lg font-black" style={{ color: '#10B981', textShadow: '0 0 20px rgba(16,185,129,0.8)' }}>
      +{amount} XP
    </span>
  </motion.div>
);

export const TaskEngine: React.FC = () => {
  const { tasks, courses, toggleTask, addXP, pushToast, incrementCompletedToday } = useStore();
  const navigate = useNavigate();
  const [bursts, setBursts] = useState<{ id: string; amount: number }[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [orderedTasks, setOrderedTasks] = useState(() =>
    [...tasks]
      .filter(t => !t.completed)
      .sort((a, b) => {
        const urgencyScore = { URGENT: 3, NORMAL: 2, LOW: 1 };
        const daysA = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
        const daysB = Math.ceil((new Date(b.dueDate).getTime() - Date.now()) / 86400000);
        const scoreA = (urgencyScore[a.urgency] * 10) + (10 - Math.min(daysA, 10)) + (a.priority === 1 ? 5 : 0);
        const scoreB = (urgencyScore[b.urgency] * 10) + (10 - Math.min(daysB, 10)) + (b.priority === 1 ? 5 : 0);
        return scoreB - scoreA;
      })
  );

  // Sync when tasks change
  useEffect(() => {
    setOrderedTasks(prev => {
      const activePrev = prev.filter(p => tasks.find(t => t.id === p.id && !t.completed));
      const newTasks = tasks.filter(t => !t.completed && !prev.find(p => p.id === t.id));
      return [...activePrev, ...newTasks];
    });
  }, [tasks]);

  const handleComplete = (taskId: string, xpValue: number) => {
    if (completedIds.has(taskId)) return;
    setCompletedIds(prev => new Set([...prev, taskId]));
    setTimeout(() => {
      toggleTask(taskId);
      addXP(xpValue);
      incrementCompletedToday();
      pushToast({ type: 'xp', title: 'Task Complete!', body: `+${xpValue} XP earned`, xpAmount: xpValue });
      setBursts(prev => [...prev, { id: taskId, amount: xpValue }]);
    }, 400);
  };

  const dragRef = useRef<number | null>(null);

  const handleDragStart = (i: number) => { dragRef.current = i; setDragIdx(i); };
  const handleDragOver = (i: number) => {
    if (dragRef.current === null || dragRef.current === i) return;
    const next = [...orderedTasks];
    const [moved] = next.splice(dragRef.current, 1);
    next.splice(i, 0, moved);
    dragRef.current = i;
    setOrderedTasks(next);
  };
  const handleDragEnd = () => { dragRef.current = null; setDragIdx(null); };

  const visibleTasks = orderedTasks.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Target size={16} style={{ color: '#7C3AED' }} />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">High-Impact Tasks</h3>
            <p className="text-[10px] text-muted-foreground font-medium">AI-prioritized by urgency & exam proximity</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest gap-1.5 h-8" onClick={() => navigate('/tasks')}>
          View All <ArrowRight size={12} />
        </Button>
      </div>

      <AnimatePresence>
        {visibleTasks.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center space-y-3">
            <Sparkles size={32} className="mx-auto" style={{ color: '#10B981' }} />
            <p className="text-sm font-black text-foreground">All tasks complete!</p>
            <p className="text-xs text-muted-foreground">AI is preparing your next mission set.</p>
            <Button size="sm" className="mt-2 text-[10px] font-black uppercase tracking-widest" onClick={() => navigate('/tasks')}>Add New Task</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {visibleTasks.map((task, i) => {
          const cfg = urgencyConfig[task.urgency];
          const course = courses.find(c => c.id === task.courseId);
          const daysLeft = Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / 86400000);
          const isCompleting = completedIds.has(task.id);
          const burst = bursts.find(b => b.id === task.id);

          return (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isCompleting ? 0 : 1, x: 0, scale: isCompleting ? 0.95 : 1 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => { e.preventDefault(); handleDragOver(i); }}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative group rounded-xl p-4 border transition-all duration-200 cursor-grab active:cursor-grabbing",
                dragIdx === i ? "opacity-50 scale-95" : "hover:border-primary/30"
              )}
              style={{ background: cfg.bg, borderColor: `${cfg.color}20` }}
            >
              {burst && <XPBurst amount={burst.amount} onDone={() => setBursts(p => p.filter(b => b.id !== task.id))} />}

              <div className="flex items-start gap-3">
                {/* Drag handle */}
                <div className="mt-0.5 opacity-0 group-hover:opacity-40 transition-opacity text-muted-foreground">
                  <GripVertical size={14} />
                </div>

                {/* Priority rank */}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                  style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-black text-foreground truncate">{task.title}</span>
                    {task.aiSuggested && (
                      <Badge className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0 h-4 shrink-0"
                        style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' }}>
                        <Brain size={8} className="mr-0.5" /> AI
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="font-bold text-muted-foreground">{course?.code ?? '—'}</span>
                    <span className="font-black" style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="text-muted-foreground">{daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ duration: 1, ease: 'circOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${cfg.color}80, ${cfg.color})` }}
                      />
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground">{task.progress}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => handleComplete(task.id, task.xpValue)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    title={`Complete (+${task.xpValue} XP)`}
                  >
                    <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                  </button>
                  <button
                    onClick={() => navigate('/focus')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
                    title="Start Focus Session"
                  >
                    <Zap size={14} style={{ color: '#7C3AED' }} />
                  </button>
                </div>
              </div>

              {/* XP badge */}
              <div className="absolute top-3 right-14">
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#10B981' }}>+{task.xpValue} XP</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
