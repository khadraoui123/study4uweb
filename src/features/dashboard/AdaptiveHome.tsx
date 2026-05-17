import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Brain, Zap, Activity, ArrowRight, TrendingUp,
  Target, BarChart3, Clock, Calendar, BookOpen,
  Cpu, ShieldCheck, BarChart2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { StatusTicker } from './StatusTicker';
import { TaskEngine } from './TaskEngine';
import { NeuralInsightPanel } from './NeuralInsightPanel';
import { CognitiveHeatmap } from './CognitiveHeatmap';
import { XPRankEngine } from './XPRankEngine';
import { ToastSystem } from './ToastSystem';

// ─── Animated panel wrapper ─────────────────────────────────────────────────
const Panel: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    className={cn('rounded-2xl p-5 relative overflow-hidden', className)}
    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}
  >
    {children}
  </motion.div>
);

// ─── Daily Forecast ─────────────────────────────────────────────────────────
const productivityMessages: Record<string, { headline: string; sub: string; duration: string; period: string }> = {
  PEAK: { headline: 'Peak Cognitive State', sub: 'Your neural pathways are fully optimized. This is your highest-performance window.', duration: '3–4 hours', period: '7PM – 10PM' },
  NORMAL: { headline: 'Steady Progress Detected', sub: 'Good baseline energy. Recommended for moderate-difficulty material and review.', duration: '2–3 hours', period: '10AM – 12PM' },
  BURNOUT_RISK: { headline: 'Burnout Risk Elevated', sub: 'Mental fatigue detected. Prioritize rest intervals and lighter review tasks.', duration: '1–2 hours', period: '10AM – 11AM' },
  RECOVERING: { headline: 'Recovery Protocol Active', sub: 'Energy rebuilding. Light revision and spaced repetition are ideal now.', duration: '1–1.5 hours', period: '2PM – 3:30PM' },
};

const urgencyColors: Record<string, string> = { PEAK: '#10B981', NORMAL: '#7C3AED', BURNOUT_RISK: '#F59E0B', RECOVERING: '#06B6D4' };

const DailyForecast: React.FC = React.memo(() => {
  const productivityState = useStore(state => state.productivityState);
  const focusScore = useStore(state => state.focusScore);
  const tasks = useStore(state => state.tasks);
  const exams = useStore(state => state.exams);
  const startFocusSession = useStore(state => state.startFocusSession);
  const pushToast = useStore(state => state.pushToast);

  const navigate = useNavigate();
  const msg = productivityMessages[productivityState] ?? productivityMessages.NORMAL;
  const color = urgencyColors[productivityState] ?? '#7C3AED';
  
  const pendingTasks = React.useMemo(() => tasks.filter(t => !t.completed).length, [tasks]);
  const nearestExam = React.useMemo(() => [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0], [exams]);
  const daysToExam = React.useMemo(() => nearestExam ? Math.ceil((new Date(nearestExam.date).getTime() - Date.now()) / 86400000) : null, [nearestExam]);

  const handleAccept = React.useCallback(() => {
    navigate('/planner');
    pushToast({ type: 'success', title: 'Schedule Synced', body: 'Neural schedule added to your planner.' });
  }, [navigate, pushToast]);

  const handleFocus = React.useCallback(() => {
    startFocusSession();
    navigate('/focus');
    pushToast({ type: 'focus', title: 'Focus Session Started', body: 'Neural protocols active.' });
  }, [startFocusSession, navigate, pushToast]);

  // Arc gauge
  const gaugePercent = focusScore;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (gaugePercent / 100) * circumference;

  return (
    <div className="flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Main content */}
      <div className="flex-1 p-6 space-y-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2">
          <Badge className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
            AI Forecast
          </Badge>
          {daysToExam !== null && daysToExam <= 10 && (
            <Badge className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}>
              Exam in {daysToExam}d
            </Badge>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tight mb-1.5">{msg.headline}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{msg.sub}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Clock size={14} />, label: 'Recommended', val: msg.duration },
            { icon: <Calendar size={14} />, label: 'Best Window', val: msg.period },
            { icon: <Target size={14} />, label: 'Open Tasks', val: `${pendingTasks} pending` },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-1.5 mb-1 text-muted-foreground">{item.icon}<span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span></div>
              <p className="text-xs font-black text-foreground">{item.val}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={handleAccept} className="h-10 px-6 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg" style={{ boxShadow: `0 8px 24px ${color}25` }}>
            Accept Schedule <ArrowRight size={14} className="ml-2" />
          </Button>
          <Button variant="outline" onClick={handleFocus} className="h-10 px-5 font-black uppercase text-[10px] tracking-widest rounded-xl border-border/50 gap-2">
            <Zap size={14} /> Start Focus
          </Button>
        </div>
      </div>

      {/* Gauge sidebar */}
      <div className="w-full md:w-52 p-6 flex flex-col items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.015)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Focus Score</p>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="36"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'circOut' }}
              transform="rotate(-90 50 50)"
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
            <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20" fontWeight="900" fontFamily="Outfit">{gaugePercent}</text>
          </svg>
        </div>

        <div className="space-y-3 w-full">
          {[
            { label: 'XP Velocity', val: 85, color: '#10B981', note: '+450' },
            { label: 'Mastery Index', val: 60, color: '#7C3AED', note: '+12%' },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between mb-1">
                <span className="text-[9px] font-bold text-foreground">{s.label}</span>
                <span className="text-[9px] font-black" style={{ color: s.color }}>{s.note}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.val}%` }}
                  transition={{ duration: 1, ease: 'circOut' }}
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500">
          <TrendingUp size={12} /> Trending Up
        </div>
      </div>
    </div>
  );
});

// ─── Cognitive Matrix ────────────────────────────────────────────────────────
const CognitiveMatrix: React.FC = React.memo(() => {
  const courses = useStore(state => state.courses);
  const dailyGoals = useStore(state => state.dailyGoals);
  const navigate = useNavigate();

  const stats = [
    { label: 'Deep Work', val: 82, icon: <Target size={15} />, route: '/focus', status: 'Optimal' },
    { label: 'Persistence', val: 94, icon: <Zap size={15} />, route: '/analytics', status: 'Peak' },
    { label: 'Retention', val: 78, icon: <Brain size={15} />, route: '/courses', status: 'Stable' },
  ];

  const goalsPercent = React.useMemo(() => Math.round((dailyGoals.completed / Math.max(dailyGoals.total, 1)) * 100), [dailyGoals]);

  return (
    <div className="space-y-5">
      {/* Daily goals */}
      <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Daily Goals</span>
          <span className="text-sm font-black" style={{ color: '#10B981' }}>{dailyGoals.completed}/{dailyGoals.total}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalsPercent}%` }}
            transition={{ duration: 1, ease: 'circOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #10B981, #06B6D4)' }}
          />
        </div>
      </div>

      {/* Stat rows */}
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => navigate(stat.route)}
          className="flex flex-col gap-2.5 cursor-pointer group"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{stat.label}</p>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{stat.status}</p>
              </div>
            </div>
            <span className="text-xl font-black tabular-nums" style={{ color: '#7C3AED' }}>{stat.val}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stat.val}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: 'circOut' }}
              className="h-full rounded-full group-hover:opacity-100 opacity-60 transition-opacity"
              style={{ background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }}
            />
          </div>
        </motion.div>
      ))}

      {/* Course mastery */}
      <div className="pt-2 border-t border-white/5 space-y-3">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Course Mastery</span>
        {courses.slice(0, 2).map(c => (
          <div key={c.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/courses')}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' }}>
              {c.code.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{c.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.percentage}%` }}
                    transition={{ duration: 1, ease: 'circOut' }}
                    className="h-full rounded-full"
                    style={{ background: c.percentage >= 90 ? '#10B981' : c.percentage >= 75 ? '#7C3AED' : '#F59E0B' }}
                  />
                </div>
                <span className="text-[9px] font-black shrink-0" style={{ color: '#A78BFA' }}>{c.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Quick Actions ──────────────────────────────────────────────────────────
const QuickActions: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const startFocusSession = useStore(state => state.startFocusSession);
  const pushToast = useStore(state => state.pushToast);

  const actions = React.useMemo(() => [
    { icon: <Zap size={18} />, label: 'Focus Room', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', route: '/focus', fn: () => { startFocusSession(); pushToast({ type: 'focus', title: 'Focus Session Started' }); } },
    { icon: <Brain size={18} />, label: 'AI Tutor', color: '#06B6D4', bg: 'rgba(6,182,212,0.12)', route: '/tutor' },
    { icon: <BarChart3 size={18} />, label: 'Analytics', color: '#10B981', bg: 'rgba(16,185,129,0.12)', route: '/analytics' },
    { icon: <BookOpen size={18} />, label: 'Courses', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', route: '/courses' },
    { icon: <Calendar size={18} />, label: 'Planner', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', route: '/planner' },
    { icon: <BarChart2 size={18} />, label: 'Exams', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', route: '/exams' },
  ], [startFocusSession, pushToast]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.map((a, i) => (
        <motion.button
          key={a.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          onClick={() => { a.fn?.(); navigate(a.route); }}
          className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 active:scale-95 group"
          style={{ background: a.bg, border: `1px solid ${a.color}20` }}
        >
          <span style={{ color: a.color }} className="group-hover:scale-110 transition-transform">{a.icon}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{a.label}</span>
        </motion.button>
      ))}
    </div>
  );
});

// ─── System Health Bar ───────────────────────────────────────────────────────
const SystemHealthBar: React.FC = React.memo(() => {
  const productivityState = useStore(state => state.productivityState);
  const aiActivityStatus = useStore(state => state.aiActivityStatus);
  const activeFocusSession = useStore(state => state.activeFocusSession);
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const stateColor = React.useMemo(() => ({ PEAK: '#10B981', NORMAL: '#7C3AED', BURNOUT_RISK: '#F59E0B', RECOVERING: '#06B6D4' }[productivityState] ?? '#7C3AED'), [productivityState]);
  const stateLabel = React.useMemo(() => ({ PEAK: 'Peak Mode', NORMAL: 'Nominal', BURNOUT_RISK: 'Risk Detected', RECOVERING: 'Recovering' }[productivityState] ?? 'Nominal'), [productivityState]);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-1">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: stateColor, boxShadow: `0 0 8px ${stateColor}` }} />
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: stateColor }}>{stateLabel}</span>
      </div>
      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
        <span className="flex items-center gap-1.5"><Cpu size={11} /> {aiActivityStatus === 'active' ? 'AI Online' : 'AI Processing...'}</span>
        <span className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-emerald-500" /> Integrity OK</span>
        <span className="flex items-center gap-1.5"><Activity size={11} />{activeFocusSession ? 'Focus Active' : 'Standby'}</span>
        <span className="text-muted-foreground/40 tabular-nums">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
    </div>
  );
});

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export const AdaptiveDashboard: React.FC = () => {
  const aiMemory = useStore(state => state.aiMemory);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="max-w-[1600px] mx-auto pb-24 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <ToastSystem />

      {/* Live Status Ticker */}
      <StatusTicker />

      {/* System Health Bar */}
      <SystemHealthBar />

      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge className="px-3 py-1 text-[10px] font-black uppercase tracking-widest gap-2"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Brain size={12} className="animate-pulse" /> OS Command Center
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black heading-os tracking-tight text-foreground leading-[1.1]">
            {aiMemory.burnoutRisk > 40 ? 'Rest & Recover,' : 'Mission Control,'}{' '}
            <span style={{ background: 'linear-gradient(90deg, #7C3AED, #A78BFA, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tareq
            </span>
          </h1>
          <p className="text-muted-foreground text-base font-medium max-w-xl leading-relaxed">
            AI Efficiency at <span className="font-black text-primary">{aiMemory.productivityScore}%</span>. Your academic systems are synchronized and active.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="w-full sm:w-auto">
          <QuickActions />
        </div>
      </motion.div>

      {/* Daily Forecast */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <DailyForecast />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column — 8 wide */}
        <div className="col-span-12 xl:col-span-8 space-y-5">
          {/* Cognitive Heatmap */}
          <Panel delay={0.1}>
            <CognitiveHeatmap />
          </Panel>

          {/* High-Impact Task Engine */}
          <Panel delay={0.15}>
            <TaskEngine />
          </Panel>
        </div>

        {/* Right Column — 4 wide */}
        <div className="col-span-12 xl:col-span-4 space-y-5">
          {/* XP Rank Engine */}
          <Panel delay={0.1}>
            <XPRankEngine />
          </Panel>

          {/* Neural Insights */}
          <Panel delay={0.2}>
            <NeuralInsightPanel />
          </Panel>

          {/* Cognitive Matrix */}
          <Panel delay={0.25}>
            <CognitiveMatrix />
          </Panel>
        </div>
      </div>
    </div>
  );
};
