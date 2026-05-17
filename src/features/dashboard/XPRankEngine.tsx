import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Zap, TrendingUp, Star, Shield, Flame } from 'lucide-react';

const RANK_TITLES: Record<number, string> = {
  1: 'Novice Scholar', 2: 'Curious Mind', 3: 'Knowledge Seeker',
  4: 'Academic Apprentice', 5: 'Neural Cadet', 6: 'Focus Specialist',
  7: 'Cognitive Engineer', 8: 'Scholar Elite', 9: 'Neural Commander', 10: 'Apex Intellect',
};

const AnimatedNumber: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const unsub = rounded.on('change', v => setDisplay(v));
    const ctrl = animate(mv, value, { duration: 1.2, ease: 'easeOut' });
    return () => { unsub(); ctrl.stop(); };
  }, [value]);

  return <span className={className}>{display}</span>;
};

export const XPRankEngine: React.FC = () => {
  const { xp, level, streak, totalFocusTime, addXP, weeklyProgress } = useStore();
  const navigate = useNavigate();
  const nextLevelXP = level * 1000;
  const xpPercent = Math.min(100, Math.round((xp / nextLevelXP) * 100));
  const rankTitle = RANK_TITLES[Math.min(level, 10)] ?? `Neural Master ${level}`;
  const streakAtRisk = streak > 0 && new Date().getHours() >= 22;
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="space-y-5">
      {/* Rank Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl relative overflow-hidden" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(124,58,237,0.4), transparent 60%)' }} />
        
        {/* Level badge */}
        <div
          className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 relative z-10 cursor-pointer hover:scale-105 transition-transform"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
          onClick={() => navigate('/achievements')}
        >
          <span className="text-white text-[10px] font-black uppercase tracking-wider">LVL</span>
          <span className="text-white text-2xl font-black leading-none">{level}</span>
        </div>

        <div className="flex-1 min-w-0 relative z-10">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-black text-foreground uppercase tracking-widest truncate">{rankTitle}</span>
            <span className="text-[10px] font-black text-muted-foreground shrink-0 ml-2">{xpPercent}%</span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">
            <AnimatedNumber value={xp} className="font-black text-primary" /> / {nextLevelXP.toLocaleString()} XP
          </p>
          {/* XP Bar */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1.5, ease: 'circOut' }}
              className="h-full rounded-full relative"
              style={{ background: 'linear-gradient(90deg, #7C3AED, #A78BFA, #06B6D4)' }}
            >
              {/* Shimmer */}
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-1/3"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Flame size={16} style={{ color: '#F59E0B' }} />, value: streak, label: 'Streak', unit: 'days', color: '#F59E0B', onClick: () => navigate('/achievements') },
          { icon: <Zap size={16} style={{ color: '#7C3AED' }} />, value: totalFocusTime, label: 'Focus', unit: 'min', color: '#7C3AED', onClick: () => navigate('/analytics') },
          { icon: <Star size={16} style={{ color: '#10B981' }} />, value: xp, label: 'Total XP', unit: 'pts', color: '#10B981', onClick: () => navigate('/leaderboards') },
        ].map(stat => (
          <button
            key={stat.label}
            onClick={stat.onClick}
            className="p-3 rounded-xl text-center transition-all hover:scale-105 active:scale-95 group"
            style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}20` }}
          >
            <div className="flex justify-center mb-1 group-hover:scale-110 transition-transform">{stat.icon}</div>
            <div className="text-lg font-black text-foreground tabular-nums leading-none">
              <AnimatedNumber value={stat.value} />
            </div>
            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Streak warning */}
      {streakAtRisk && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}
        >
          <Shield size={16} />
          <span>Streak at risk! Complete a task before midnight to protect it.</span>
        </motion.div>
      )}

      {/* Weekly sparkline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weekly Progress</span>
          <span className="text-[10px] font-black" style={{ color: '#10B981' }}>
            <TrendingUp size={10} className="inline mr-1" />
            Trending Up
          </span>
        </div>
        <div className="flex items-end gap-1 h-10">
          {weeklyProgress.map((val, i) => {
            const max = Math.max(...weeklyProgress, 1);
            const pct = (val / max) * 100;
            const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: 1, delay: i * 0.08, ease: 'circOut' }}
                  className="w-full rounded-sm"
                  style={{
                    background: isToday ? 'linear-gradient(180deg, #7C3AED, #A78BFA)' : 'rgba(124,58,237,0.25)',
                    boxShadow: isToday ? '0 0 8px rgba(124,58,237,0.4)' : 'none',
                    minHeight: 3,
                  }}
                />
                <span className="text-[8px] text-muted-foreground/60 font-bold">{weekDays[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick XP gain button */}
      <button
        onClick={() => { addXP(10); }}
        className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#10B981' }}
      >
        <Zap size={12} /> Daily Check-In (+10 XP)
      </button>
    </div>
  );
};
