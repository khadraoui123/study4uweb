import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HOUR_LABELS = ['12a','1','2','3','4','5','6a','7','8','9','10','11','12p','1','2','3','4','5','6p','7','8','9','10','11'];

function getWindowColor(value: number): string {
  if (value >= 85) return '#7C3AED';
  if (value >= 65) return '#A78BFA';
  if (value >= 45) return '#06B6D4';
  if (value >= 25) return '#1E40AF';
  return '#1F2937';
}
function getGlowIntensity(value: number): string {
  if (value >= 85) return `0 0 16px rgba(124,58,237,0.7)`;
  if (value >= 65) return `0 0 10px rgba(167,139,250,0.4)`;
  if (value >= 45) return `0 0 8px rgba(6,182,212,0.3)`;
  return 'none';
}

const SUBJECT_OPTIONS = ['Circuit Design', 'Physics', 'Discrete Math', 'Deep Reading', 'Practice Problems', 'Revision'];

export const CognitiveHeatmap: React.FC = React.memo(() => {
  const cognitiveWindows = useStore(state => state.cognitiveWindows);
  const addEvent = useStore(state => state.addEvent);
  const pushToast = useStore(state => state.pushToast);
  
  const navigate = useNavigate();
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0]);

  const currentHour = new Date().getHours();

  const handleSchedule = React.useCallback(() => {
    if (selectedHour === null) return;
    const today = new Date();
    today.setHours(selectedHour, 0, 0, 0);
    const end = new Date(today);
    end.setHours(selectedHour + 2);

    addEvent({
      id: `cog-${Date.now()}`,
      title: `${selectedSubject} Study Block`,
      start: today.toISOString(),
      end: end.toISOString(),
      type: 'study',
    });
    pushToast({ type: 'success', title: 'Session Scheduled', body: `${selectedSubject} at ${HOUR_LABELS[selectedHour]}` });
    setSelectedHour(null);
  }, [selectedHour, selectedSubject, addEvent, pushToast]);

  const peakWindows = React.useMemo(() => cognitiveWindows
    .map((v, i) => ({ hour: i, value: v }))
    .filter(w => w.value >= 75)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3), [cognitiveWindows]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}>
            <Clock size={16} style={{ color: '#06B6D4' }} />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Peak Cognitive Windows</h3>
            <p className="text-[10px] text-muted-foreground">Click a time block to schedule a study session</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/planner')} className="text-[10px] font-black uppercase tracking-widest gap-1.5 h-8" style={{ color: '#06B6D4' }}>
          Planner <Plus size={12} />
        </Button>
      </div>

      {/* Peak window chips */}
      <div className="flex gap-2 flex-wrap">
        {peakWindows.map(w => (
          <button
            key={w.hour}
            onClick={() => setSelectedHour(w.hour)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
            style={{ background: 'rgba(124,58,237,0.12)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.25)' }}
          >
            <Zap size={10} />
            {HOUR_LABELS[w.hour]}:00 — {w.value}%
          </button>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="relative">
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
          {cognitiveWindows.map((value, hour) => (
            <div key={hour} className="relative group/cell" onMouseEnter={() => setHoveredHour(hour)} onMouseLeave={() => setHoveredHour(null)}>
              <button
                onClick={() => setSelectedHour(hour === selectedHour ? null : hour)}
                className={cn(
                  "w-full rounded-md transition-all duration-300 hover:scale-y-110",
                  selectedHour === hour ? "ring-1 ring-white/50 scale-y-110" : "",
                  currentHour === hour ? "ring-1 ring-white/30" : ""
                )}
                style={{
                  height: Math.max(24, Math.round((value / 100) * 64)),
                  background: getWindowColor(value),
                  boxShadow: hoveredHour === hour || selectedHour === hour ? getGlowIntensity(value) : 'none',
                  opacity: hoveredHour !== null && hoveredHour !== hour ? 0.3 : 1,
                  willChange: 'transform, height'
                }}
              />
              {/* Current time marker */}
              {currentHour === hour && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Hour labels - show every 3 hours */}
        <div className="grid mt-1.5 text-[8px] text-muted-foreground/60 font-bold" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
          {HOUR_LABELS.map((label, i) => (
            <span key={i} className={cn("text-center truncate", i % 3 !== 0 ? "opacity-0" : "")}>
              {i % 3 === 0 ? label : ''}
            </span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 justify-end">
          {[
            { color: '#1F2937', label: 'Low' },
            { color: '#1E40AF', label: 'Moderate' },
            { color: '#06B6D4', label: 'Good' },
            { color: '#A78BFA', label: 'High' },
            { color: '#7C3AED', label: 'Peak' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
              <span className="text-[9px] text-muted-foreground/60 font-medium">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredHour !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs font-bold text-foreground"
          >
            {HOUR_LABELS[hoveredHour]}:00 — Energy: <span style={{ color: getWindowColor(cognitiveWindows[hoveredHour]) }}>{cognitiveWindows[hoveredHour]}%</span>
            {cognitiveWindows[hoveredHour] >= 75 && <span className="ml-2 text-[10px]" style={{ color: '#7C3AED' }}>✦ Peak Window</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule popover */}
      <AnimatePresence>
        {selectedHour !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            className="rounded-xl p-4 space-y-3"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-foreground">
                Schedule for <span style={{ color: '#A78BFA' }}>{HOUR_LABELS[selectedHour]}:00</span>
                <span className="ml-2 text-muted-foreground font-medium">({cognitiveWindows[selectedHour]}% energy)</span>
              </p>
              <button onClick={() => setSelectedHour(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                  style={{
                    background: selectedSubject === s ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.04)',
                    color: selectedSubject === s ? '#A78BFA' : '#6B7280',
                    border: `1px solid ${selectedSubject === s ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 text-[10px] font-black uppercase tracking-widest h-8" onClick={handleSchedule}>
                <Plus size={12} className="mr-1.5" /> Add to Planner
              </Button>
              <Button size="sm" variant="outline" className="text-[10px] font-black uppercase tracking-widest h-8 border-border/50" onClick={() => navigate('/focus')}>
                <Zap size={12} className="mr-1.5" /> Focus Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
