import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Play, Pause, RotateCcw, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, AreaChart, Area, Tooltip } from 'recharts';

const gradeData = [
  { name: 'A+', count: 12 },
  { name: 'A', count: 18 },
  { name: 'B', count: 10 },
  { name: 'C', count: 5 },
  { name: 'D', count: 2 },
  { name: 'F', count: 0 },
];

const focusTrend = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 5.2 },
  { day: 'Wed', hours: 3.8 },
  { day: 'Thu', hours: 6.5 },
  { day: 'Fri', hours: 4.0 },
  { day: 'Sat', hours: 2.5 },
  { day: 'Sun', hours: 3.0 },
];

export const Statistics: React.FC = () => {
  const { pomodoroTime, isTimerRunning, setTimerState, tickTimer, resetTimer } = useStore();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTimerRunning && pomodoroTime > 0) {
      timerRef.current = window.setInterval(() => {
        tickTimer();
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, tickTimer, pomodoroTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-32 pt-8 px-6 flex flex-col gap-8 max-w-lg m-auto"
    >
      <header>
        <h1 className="text-3xl font-extrabold" style={{ color: '#1E293B' }}>Performance</h1>
        <p className="font-medium" style={{ color: '#64748B' }}>Deep-dive into your analytics.</p>
      </header>

      <div className="flex gap-4">
        <fluent-card style={{ padding: '24px', flex: 1 }}>
          <span className="font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#94A3B8' }}>Current CGPA</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="display-stat text-4xl" style={{ color: '#1E293B' }}>3.38</span>
            <span className="font-bold mb-1" style={{ fontSize: '14px', color: '#94A3B8' }}>/ 4.0</span>
          </div>
          <div className="flex items-center gap-1 mt-3 font-bold" style={{ fontSize: '12px', color: '#4ADE80' }}>
            <TrendingUp size={14} />
            <span>+0.12 this sem</span>
          </div>
        </fluent-card>

        <fluent-card style={{ padding: '24px', flex: 1 }}>
          <span className="font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#94A3B8' }}>Study Streak</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="display-stat text-4xl" style={{ color: '#1E293B' }}>12</span>
            <span className="font-bold mb-1" style={{ fontSize: '14px', color: '#94A3B8' }}>days</span>
          </div>
          <div className="flex items-center gap-1 mt-3 font-bold" style={{ fontSize: '12px', color: '#FBBF24' }}>
            <span>🔥 Personal Best</span>
          </div>
        </fluent-card>
      </div>

      <fluent-card style={{ background: '#1E293B', border: 'none', color: 'white', padding: '32px' }}>
        <div className="flex flex-col items-center text-center">
          <span className="font-bold uppercase tracking-[0.2em] mb-4" style={{ fontSize: '10px', color: '#94a3b8' }}>Focus Engine</span>
          <motion.div
            animate={{ scale: isTimerRunning ? [1, 1.02, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl font-extrabold tracking-tighter mb-8 tabular-nums"
          >
            {formatTime(pomodoroTime)}
          </motion.div>
          <div className="flex gap-4">
            <fluent-button
              appearance="accent"
              onClick={() => setTimerState(!isTimerRunning)}
              style={{ '--accent-fill-rest': '#4ADE80', width: '120px' } as any}
            >
              {isTimerRunning ? <Pause size={20} slot="start" /> : <Play size={20} slot="start" />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </fluent-button>
            <fluent-button
              onClick={resetTimer}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', minWidth: '48px' }}
            >
              <RotateCcw size={20} />
            </fluent-button>
          </div>
        </div>
      </fluent-card>

      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-bold" style={{ color: '#1E293B' }}>Grade Distribution</h3>
        <fluent-card style={{ padding: '24px 12px' }}>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} dy={10} />
                <Tooltip cursor={{ fill: '#F8FAF9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={24}>
                  {gradeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index < 2 ? '#4ADE80' : '#CBD5E1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </fluent-card>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-bold" style={{ color: '#1E293B' }}>Weekly Focus Trend</h3>
        <fluent-card style={{ padding: '24px 12px' }}>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusTrend}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip />
                <Area type="monotone" dataKey="hours" stroke="#4ADE80" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </fluent-card>
      </section>
    </motion.div>
  );
};
