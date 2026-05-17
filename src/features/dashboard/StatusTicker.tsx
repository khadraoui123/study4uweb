import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { Activity, Zap, Flame, Brain, ShieldCheck, AlertTriangle, Clock, Cpu } from 'lucide-react';

const productivityLabels: Record<string, { label: string; color: string }> = {
  PEAK: { label: 'Peak Productivity Detected', color: '#10B981' },
  NORMAL: { label: 'Steady Progress Mode', color: '#7C3AED' },
  BURNOUT_RISK: { label: 'Burnout Risk Rising', color: '#F59E0B' },
  RECOVERING: { label: 'Recovery Protocol Active', color: '#06B6D4' },
};

const aiStatusLabels: Record<string, { label: string; color: string }> = {
  idle: { label: 'AI Standby', color: '#6B7280' },
  analyzing: { label: 'AI Analyzing...', color: '#F59E0B' },
  generating: { label: 'AI Generating...', color: '#7C3AED' },
  active: { label: 'AI Active', color: '#10B981' },
};

export const StatusTicker: React.FC = () => {
  const { xp, level, streak, productivityState, aiActivityStatus, focusScore, exams, completedTasksToday } = useStore();
  const [displayXP, setDisplayXP] = useState(xp);

  useEffect(() => {
    const timeout = setTimeout(() => setDisplayXP(xp), 300);
    return () => clearTimeout(timeout);
  }, [xp]);

  const nextLevelXP = level * 1000;
  const xpPercent = Math.round((xp / nextLevelXP) * 100);
  const prodInfo = productivityLabels[productivityState] ?? productivityLabels.NORMAL;
  const aiInfo = aiStatusLabels[aiActivityStatus] ?? aiStatusLabels.idle;

  const nearestExam = exams
    .map(e => ({ ...e, daysLeft: Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000) }))
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];

  const tickerItems = [
    { icon: <Zap size={11} />, label: `XP: ${displayXP.toLocaleString()}`, color: '#7C3AED' },
    { icon: <Brain size={11} />, label: `Level ${level} · ${xpPercent}% to Next`, color: '#A78BFA' },
    { icon: <Flame size={11} />, label: `Streak: ${streak} days`, color: '#F59E0B' },
    { icon: <Activity size={11} />, label: `Focus Score: ${focusScore}%`, color: '#10B981' },
    { icon: <Cpu size={11} />, label: prodInfo.label, color: prodInfo.color },
    { icon: <Brain size={11} />, label: aiInfo.label, color: aiInfo.color },
    ...(nearestExam ? [{ icon: <AlertTriangle size={11} />, label: `${nearestExam.title} in ${nearestExam.daysLeft}d`, color: nearestExam.daysLeft <= 5 ? '#EF4444' : '#F59E0B' }] : []),
    { icon: <ShieldCheck size={11} />, label: 'System Integrity: Optimal', color: '#10B981' },
    { icon: <Clock size={11} />, label: `Tasks Today: ${completedTasksToday} completed`, color: '#06B6D4' },
  ];

  const repeated = [...tickerItems, ...tickerItems, ...tickerItems];
  const totalWidth = tickerItems.length * 220;

  return (
    <div className="w-full relative overflow-hidden" style={{ background: 'rgba(124,58,237,0.04)', borderTop: '1px solid rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #020205, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #020205, transparent)' }} />

      <motion.div
        animate={{ x: [0, -totalWidth] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex items-center py-2 gap-0 whitespace-nowrap"
      >
        {repeated.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 px-6 text-[10px] font-black uppercase tracking-[0.18em]"
            style={{ color: item.color, minWidth: 220 }}
          >
            <span style={{ color: item.color, opacity: 0.9 }}>{item.icon}</span>
            <span>{item.label}</span>
            <span className="ml-4 opacity-20 text-white">◆</span>
          </div>
        ))}
      </motion.div>

      {/* Pulsing status dot */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: prodInfo.color, boxShadow: `0 0 6px ${prodInfo.color}` }} />
        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: prodInfo.color }}>LIVE</span>
      </div>
    </div>
  );
};
