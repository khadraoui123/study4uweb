import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Calendar as CalendarIcon, Plus, Sparkles, Clock, BookOpen, AlertCircle, Zap, 
  LayoutGrid, List, Target, Activity, History, MousePointer2, Brain, ArrowRight, 
  CheckCircle2, XCircle, RefreshCw, Sliders, TrendingUp, TrendingDown, Flame, 
  ShieldAlert, Play, Pause, FastForward, RotateCcw, HelpCircle, FileText, 
  ChevronDown, ChevronUp, GripVertical, Check, X, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, ReferenceLine 
} from 'recharts';
import type { CalendarEvent } from '../../store/slices/plannerSlice';
import type { Task } from '../../store/slices/taskSlice';

// ─── Time-Drift Monitor Component ───────────────────────────────────────────
const TimeDriftMonitor: React.FC<{
  driftScore: number;
  driftMessage: string;
  alignmentHistory: { date: string; score: number }[];
}> = ({ driftScore, driftMessage, alignmentHistory }) => {
  const isDrifting = driftScore < 0;
  const absScore = Math.abs(driftScore);
  const color = isDrifting ? '#EF4444' : driftScore > 0 ? '#10B981' : '#7C3AED';

  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-xl relative overflow-hidden shadow-2xl group">
      <div className="absolute top-0 left-0 w-1 h-full" style={{ background: color }} />
      <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-2" style={{ color }}>
            <Activity size={16} /> Time-Drift Analysis
          </CardTitle>
          <CardDescription className="text-[11px] font-bold uppercase tracking-widest">
            Behavioral trajectory vs exam goals
          </CardDescription>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Alignment Score</span>
          <span className="text-3xl font-black tabular-nums tracking-tighter" style={{ color }}>
            {driftScore > 0 ? `+${driftScore}` : driftScore}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-0 space-y-6">
        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-background/50 shrink-0 mt-0.5" style={{ color }}>
            {isDrifting ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
          </div>
          <p className="text-xs font-medium leading-relaxed text-muted-foreground">
            {driftMessage}
          </p>
        </div>

        {/* Drift Curve Chart */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span>Weekly Momentum Curve</span>
            <span style={{ color }}>{isDrifting ? 'Action Required' : 'Optimal Trajectory'}</span>
          </div>
          <div className="h-[140px] w-full bg-muted/10 rounded-2xl p-4 border border-border/30">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={alignmentHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="driftGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: 'var(--muted-foreground)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: 'var(--muted-foreground)' }} domain={[-25, 25]} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px' }}
                  labelStyle={{ fontWeight: 900, color: '#fff', fontSize: 10 }}
                  itemStyle={{ color, fontWeight: 900, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="score" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#driftGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick alignment action */}
        {isDrifting && (
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-black uppercase text-[10px] tracking-[0.2em] gap-2 shadow-lg shadow-red-500/5"
            onClick={() => alert('AI has injected 2 recovery revision blocks into your evening queue.')}
          >
            <ShieldAlert size={16} /> Inject Emergency Revision Buffer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// ─── AI Auto-Fill Controls Component ────────────────────────────────────────
const AIAutoFillControls: React.FC<{
  onAutoFill: () => void;
  isAiAnalyzing: boolean;
  courses: any[];
}> = ({ onAutoFill, isAiAnalyzing, courses }) => {
  const [selectedPriority, setSelectedPriority] = useState('weak');
  const [intensity, setIntensity] = useState(80);

  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-xl relative overflow-hidden shadow-2xl group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
        <Brain size={180} className="text-primary" />
      </div>
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className="px-3 py-1 rounded-full bg-primary/10 text-primary border-primary/20 gap-1.5 shadow-lg shadow-primary/5 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} className="fill-current animate-pulse" /> Auto-Fill Engine
          </Badge>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">v2.4 Active</span>
        </div>
        <CardTitle className="text-2xl font-black text-foreground tracking-tight leading-tight">
          Intelligent Temporal Orchestration
        </CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed max-w-sm">
          AI continuously analyzes upcoming exam threats, weak subject retention, and focus burnout limits to synthesize optimal daily execution paths.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4 space-y-6 relative z-10">
        <div className="space-y-4 p-5 rounded-2xl bg-muted/20 border border-border/50">
          <div className="flex justify-between items-center text-xs font-black text-foreground uppercase tracking-widest">
            <span className="flex items-center gap-2"><Sliders size={14} className="text-primary" /> Focus Intensity Target</span>
            <span className="text-primary">{intensity}%</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="100" 
            value={intensity} 
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-primary bg-muted rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            <span>Balanced (50%)</span>
            <span>Overdrive (100%)</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
            Prioritize Subject Focus
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={selectedPriority === 'weak' ? 'default' : 'outline'}
              onClick={() => setSelectedPriority('weak')}
              className={cn("h-10 rounded-xl font-black text-[10px] uppercase tracking-wider", selectedPriority === 'weak' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border-border/50')}
            >
              <AlertTriangle size={14} className="mr-1.5 text-amber-500" /> Weak Subjects
            </Button>
            <Button 
              variant={selectedPriority === 'exams' ? 'default' : 'outline'}
              onClick={() => setSelectedPriority('exams')}
              className={cn("h-10 rounded-xl font-black text-[10px] uppercase tracking-wider", selectedPriority === 'exams' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border-border/50')}
            >
              <Zap size={14} className="mr-1.5 text-cyan-400" /> Exam Proximity
            </Button>
          </div>
        </div>

        <Button 
          onClick={onAutoFill}
          disabled={isAiAnalyzing}
          className="w-full h-14 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] gap-3 shadow-2xl shadow-primary/20 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {isAiAnalyzing ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Synthesizing Neural Schedule...
            </>
          ) : (
            <>
              <Sparkles size={18} className="fill-current" />
              Execute One-Click Auto-Fill
            </>
          )}
        </Button>

        {isAiAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center gap-3 animate-pulse"
          >
            <Brain size={18} className="shrink-0" />
            <div className="space-y-0.5">
              <p>AI Auto-Fill Engine Active</p>
              <p className="text-[10px] font-medium text-muted-foreground">Balancing cognitive load & injecting spaced repetition blocks...</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Intelligent Study Block Component ──────────────────────────────────────
const IntelligentStudyBlock: React.FC<{
  event: CalendarEvent;
  onResolve: (id: string, outcome: 'completed' | 'missed' | 'delayed') => void;
  onStartFocus: () => void;
  courses: any[];
}> = ({ event, onResolve, onStartFocus, courses }) => {
  const [expanded, setExpanded] = useState(false);
  const course = courses.find(c => c.id === event.courseId);

  const intensityColors = {
    LOW: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', icon: <Clock size={14} /> },
    MEDIUM: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', icon: <BookOpen size={14} /> },
    HIGH: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', icon: <Target size={14} /> },
    PEAK: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', icon: <Flame size={14} /> },
  }[event.cognitiveIntensity || 'MEDIUM'];

  const typeConfig = {
    lecture: { label: 'Lecture Node', color: 'border-blue-500/30 bg-blue-500/5' },
    exam: { label: 'Exam Threat', color: 'border-red-500/40 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse' },
    study: { label: 'Study Stream', color: 'border-border/50 bg-card/40' },
    deadline: { label: 'Temporal Deadline', color: 'border-orange-500/30 bg-orange-500/5' },
    break: { label: 'Cognitive Rest', color: 'border-emerald-500/30 bg-emerald-500/5 border-dashed' },
    focus: { label: 'Deep Focus Block', color: 'border-primary/40 bg-primary/10 shadow-[0_0_25px_rgba(124,58,237,0.15)]' },
    revision: { label: 'Spaced Repetition', color: 'border-violet-500/30 bg-violet-500/5' },
    ai_block: { label: 'AI Synthesized', color: 'border-cyan-500/30 bg-cyan-500/5 border-dashed' },
  }[event.type];

  const startTimeStr = new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      drag="y"
      dragConstraints={{ top: -10, bottom: 10 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      className={cn(
        "rounded-2xl p-6 border backdrop-blur-xl relative group transition-all cursor-grab active:cursor-grabbing",
        typeConfig.color,
        event.status === 'completed' && "opacity-60 border-emerald-500/30 bg-emerald-500/5",
        event.status === 'missed' && "opacity-60 border-red-500/30 bg-red-500/5"
      )}
    >
      {/* Drag handle accent */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity text-muted-foreground">
        <GripVertical size={16} />
      </div>

      <div className="pl-4 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Badge variant="outline" className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", intensityColors.bg, intensityColors.text, intensityColors.border)}>
              <span className="mr-1.5">{intensityColors.icon}</span>
              {event.cognitiveIntensity || 'MEDIUM'} INTENSITY
            </Badge>
            {event.isAiGenerated && (
              <Badge variant="secondary" className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border-none text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <Brain size={10} /> AI Auto
              </Badge>
            )}
            {event.status === 'completed' && (
              <Badge className="bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">Completed</Badge>
            )}
            {event.status === 'missed' && (
              <Badge className="bg-red-500 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">Missed</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-wider">
            <Clock size={14} className="text-primary" />
            <span>{startTimeStr} — {endTimeStr}</span>
          </div>
        </div>

        {/* Title & Course */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            {course && (
              <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                {course.code}
              </span>
            )}
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              {typeConfig.label}
            </span>
          </div>
          <h3 className="text-xl font-black text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </div>

        {/* AI Recommendation Box */}
        {event.aiRecommendation && (
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-3 text-xs font-medium text-muted-foreground leading-relaxed">
            <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
            <p><strong className="text-foreground font-bold">AI Insight:</strong> {event.aiRecommendation}</p>
          </div>
        )}

        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4 border-t border-border/40 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">XP Reward</span>
                  <span className="text-lg font-black text-emerald-500 flex items-center gap-1">
                    <Zap size={14} className="fill-current" /> +{event.xpReward || 100} XP
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Focus Difficulty</span>
                  <span className="text-lg font-black text-foreground">Advanced</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Burnout Risk</span>
                  <span className="text-lg font-black text-amber-500">Low (12%)</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Linked Resources</span>
                  <span className="text-xs font-bold text-primary flex items-center gap-1 mt-1 cursor-pointer hover:underline">
                    <FileText size={12} /> Syllabus.pdf
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" variant="outline" className="h-9 rounded-xl text-xs font-bold border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30" onClick={() => alert('Opening AI Tutor customized for this study block...')}>
                  <Brain size={14} className="mr-1.5" /> Ask AI Tutor
                </Button>
                <Button size="sm" variant="outline" className="h-9 rounded-xl text-xs font-bold border-border/50 hover:bg-muted/50" onClick={() => alert('Block split into two 30-minute pomodoro streams.')}>
                  Split Session
                </Button>
                <Button size="sm" variant="outline" className="h-9 rounded-xl text-xs font-bold border-border/50 hover:bg-muted/50" onClick={() => alert('Converted study block to Spaced Repetition Revision.')}>
                  Convert to Revision
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Footer */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-border/30">
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 py-1"
          >
            {expanded ? (
              <>Hide Tactical Details <ChevronUp size={14} /></>
            ) : (
              <>Show Tactical Details <ChevronDown size={14} /></>
            )}
          </button>

          <div className="flex items-center gap-2">
            {event.status !== 'completed' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 rounded-xl text-xs font-bold border-border/50 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                  onClick={() => onResolve(event.id, 'missed')}
                >
                  <X size={14} className="mr-1" /> Missed
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 rounded-xl text-xs font-bold border-border/50 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30"
                  onClick={() => onResolve(event.id, 'delayed')}
                >
                  <Clock size={14} className="mr-1" /> Delay
                </Button>
                <Button 
                  size="sm" 
                  className="h-9 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 gap-1.5"
                  onClick={() => onResolve(event.id, 'completed')}
                >
                  <Check size={14} /> Mark Complete
                </Button>
                {event.type !== 'break' && (
                  <Button 
                    size="sm" 
                    className="h-9 rounded-xl text-xs font-black uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-1.5"
                    onClick={onStartFocus}
                  >
                    <Play size={14} className="fill-current" /> Start Focus
                  </Button>
                )}
              </>
            )}
            {event.status === 'completed' && (
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Fully Synchronized
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main DynamicPlanner (Temporal Engine) Component ────────────────────────
export const DynamicPlanner: React.FC = () => {
  const { 
    events, driftScore, driftMessage, alignmentHistory, isAiAnalyzing, 
    addEvent, resolveEvent, autoFillSchedule, recalculateDrift, 
    exams, courses, tasks, addTask, startFocusSession, addXP 
  } = useStore();

  const [view, setView] = useState<'timeline' | 'calendar'>('timeline');
  const [examMode, setExamMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    courseId: '',
    dueDate: new Date().toISOString().split('T')[0],
    urgency: 'NORMAL' as const
  });

  useEffect(() => {
    recalculateDrift();
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: Math.random().toString(),
      ...newTask,
      priority: (newTask.urgency as string) === 'URGENT' ? 1 : 2,
      completed: false,
      progress: 0,
      xpValue: (newTask.urgency as string) === 'URGENT' ? 250 : 100,
      urgency: newTask.urgency
    };
    addTask(task);
    setIsModalOpen(false);
    setNewTask({ title: '', courseId: '', dueDate: new Date().toISOString().split('T')[0], urgency: 'NORMAL' });
    alert(`Task "${task.title}" added to tactical queue. AI Auto-Fill can now synthesize it into your timeline.`);
  };

  const handleResolveEvent = (id: string, outcome: 'completed' | 'missed' | 'delayed') => {
    resolveEvent(id, outcome);
    if (outcome === 'completed') {
      const ev = events.find(e => e.id === id);
      const xp = ev?.xpReward || 100;
      addXP(xp);
    }
  };

  const handleStartFocus = (event: CalendarEvent) => {
    startFocusSession();
    alert(`Initiating Focus Stream for "${event.title}". Ambient soundscapes & neural timers engaged.`);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM

  return (
    <TooltipProvider>
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-10">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 shadow-lg shadow-primary/5">
                <Sparkles size={16} className="fill-current animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Temporal Engine v2.4 Online</span>
              </Badge>
              <div className="h-[1px] flex-1 bg-border/50 max-w-[100px]" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Living OS Schedule</span>
            </div>
            <div className="space-y-2">
               <h1 className="text-6xl font-black heading-os tracking-tighter text-foreground leading-none">Temporal Engine</h1>
               <p className="text-muted-foreground text-xl font-medium max-w-3xl leading-relaxed">
                 An AI-powered academic time machine. Dynamic auto-balancing across <span className="text-primary font-black border-b-2 border-primary/20">{courses.length} course nodes</span> and active execution streams.
               </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-6 w-full lg:w-auto shrink-0">
             <Tabs value={view} onValueChange={(v) => setView(v as any)} className="bg-muted/50 p-1 h-14 rounded-2xl shadow-inner">
                <TabsList className="bg-transparent border-none gap-2 px-2">
                   <TabsTrigger value="timeline" className="gap-2 px-8 h-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-xl transition-all rounded-xl">
                      <List size={16} />
                      Time-String
                   </TabsTrigger>
                   <TabsTrigger value="calendar" className="gap-2 px-8 h-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-xl transition-all rounded-xl">
                      <LayoutGrid size={16} />
                      Calendar Matrix
                   </TabsTrigger>
                </TabsList>
             </Tabs>
             <div className="flex gap-4">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] gap-3 px-8 shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                >
                   <Plus size={20} />
                   Quick Task
                </Button>
                <Button 
                  variant={examMode ? "destructive" : "outline"}
                  onClick={() => setExamMode(!examMode)}
                  className={cn(
                    "h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] gap-3 px-8 border-2 transition-all active:scale-95",
                    examMode ? "bg-destructive text-white shadow-2xl shadow-destructive/30 animate-pulse border-destructive" : "border-border/50 hover:border-primary/50"
                  )}
                >
                   <AlertCircle size={20} />
                   {examMode ? 'Exam Protocol Active' : 'Engage Exam Protocol'}
                </Button>
             </div>
          </div>
        </header>

        {/* Quick Task Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Tactical Task">
          <form onSubmit={handleAddTask} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Task Objective</label>
              <Input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Design Logic Circuits for Lab 4" className="bg-muted/30 border-border/50 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Course Node</label>
                <select required value={newTask.courseId} onChange={e => setNewTask({...newTask, courseId: e.target.value})} className="w-full h-10 bg-muted/30 border border-border/50 rounded-xl px-3 text-sm focus:outline-none focus:ring-1 ring-primary/20">
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Urgency Level</label>
                <select value={newTask.urgency} onChange={e => setNewTask({...newTask, urgency: e.target.value as any})} className="w-full h-10 bg-muted/30 border border-border/50 rounded-xl px-3 text-sm focus:outline-none focus:ring-1 ring-primary/20">
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Due Date</label>
              <Input type="date" required value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="bg-muted/30 border-border/50 rounded-xl" />
            </div>
            <Button type="submit" className="w-full h-14 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 rounded-xl">
              Initialize Task
            </Button>
          </form>
        </Modal>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-10">
           {/* Left Sidebar: AI Controls & Time Drift */}
           <div className="col-span-12 lg:col-span-4 space-y-10">
              <AIAutoFillControls 
                onAutoFill={() => autoFillSchedule(tasks, courses)} 
                isAiAnalyzing={isAiAnalyzing} 
                courses={courses}
              />
              <TimeDriftMonitor 
                driftScore={driftScore} 
                driftMessage={driftMessage} 
                alignmentHistory={alignmentHistory} 
              />
              
              {/* Exam Proximity Widget */}
              <Card className="border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
                 <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2">
                       <CalendarIcon size={16} className="text-primary" /> Temporal Threat Radar
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 pt-0 space-y-4">
                    {exams.map(exam => (
                      <div key={exam.id} className="p-4 rounded-2xl bg-muted/20 border border-border/40 hover:border-primary/30 transition-all group flex justify-between items-center cursor-pointer">
                         <div>
                            <h4 className="font-black text-foreground text-sm group-hover:text-primary transition-colors leading-tight mb-1">{exam.title}</h4>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{courses.find(c => c.id === exam.courseId)?.name}</span>
                         </div>
                         <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg">
                            -{Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} DAYS
                         </Badge>
                      </div>
                    ))}
                 </CardContent>
              </Card>
           </div>

           {/* Main Area: Time-String Vertical Timeline or Calendar Matrix */}
           <div className="col-span-12 lg:col-span-8 space-y-10">
              {/* Top Bar: Cognitive Efficiency Map */}
              <Card className="border-border/50 bg-card/20 backdrop-blur-sm overflow-hidden">
                 <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-end mb-4">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
                             <Activity size={14} /> Cognitive Efficiency Map
                          </p>
                          <h3 className="text-xl font-black text-foreground">Temporal Load Index</h3>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Peak Window</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-muted" />
                             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rest Buffer</span>
                          </div>
                       </div>
                    </div>
                    <div className="h-12 flex gap-1 items-end">
                       {Array.from({ length: 24 }).map((_, i) => (
                         <Tooltip key={i}>
                            <TooltipTrigger asChild>
                               <motion.div 
                                 initial={{ height: 0 }}
                                 animate={{ height: `${[10, 20, 15, 10, 5, 20, 45, 80, 95, 85, 70, 60, 55, 90, 85, 75, 40, 30, 60, 80, 70, 40, 20, 10][i]}%` }}
                                 className={cn(
                                   "flex-1 rounded-t-md transition-all cursor-pointer hover:opacity-80",
                                   i >= 8 && i <= 17 ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]" : "bg-muted"
                                 )}
                               />
                            </TooltipTrigger>
                            <TooltipContent className="text-[10px] font-black uppercase">{i}:00 • Eff: {[10, 20, 15, 10, 5, 20, 45, 80, 95, 85, 70, 60, 55, 90, 85, 75, 40, 30, 60, 80, 70, 40, 20, 10][i]}%</TooltipContent>
                         </Tooltip>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              {/* Time-String Vertical Timeline View */}
              {view === 'timeline' ? (
                <Card className="border-border/50 bg-card/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                   <CardHeader className="p-8 border-b border-border/40 flex flex-row items-center justify-between">
                      <div className="space-y-1">
                         <CardTitle className="text-2xl font-black text-foreground tracking-tight">Time-String Execution Stream</CardTitle>
                         <CardDescription className="text-xs font-bold uppercase tracking-widest">Vertical temporal flow • Draggable nodes</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                         <Badge variant="outline" className="px-3 py-1.5 rounded-xl bg-background text-muted-foreground border-border/50 text-[10px] font-black uppercase tracking-widest gap-1.5">
                            <Clock size={12} className="text-primary" /> {events.length} Active Nodes
                         </Badge>
                      </div>
                   </CardHeader>
                   <CardContent className="p-8 space-y-8 relative">
                      {/* Vertical glowing flow line */}
                      <div className="absolute left-[51px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-primary via-violet-500 to-cyan-500 opacity-30 shadow-[0_0_15px_rgba(124,58,237,0.5)]" />

                      <AnimatePresence>
                         {events.length === 0 ? (
                           <div className="text-center py-20 opacity-40 space-y-4">
                              <CalendarIcon size={64} className="mx-auto text-muted-foreground" />
                              <p className="text-sm font-black uppercase tracking-widest">Temporal queue is empty. Execute AI Auto-Fill to populate streams.</p>
                           </div>
                         ) : (
                           events.map((ev, index) => (
                              <div key={ev.id} className="flex items-start gap-6 relative group z-10">
                                 {/* Time connector dot */}
                                 <div className="w-7 h-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-[10px] font-black text-primary shrink-0 relative z-20 shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:scale-125 transition-transform">
                                    {index + 1}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <IntelligentStudyBlock 
                                      event={ev} 
                                      onResolve={handleResolveEvent}
                                      onStartFocus={() => handleStartFocus(ev)}
                                      courses={courses}
                                    />
                                 </div>
                              </div>
                           ))
                         )}
                      </AnimatePresence>
                   </CardContent>
                </Card>
              ) : (
                /* Calendar Matrix View */
                <Card className="border-border/50 bg-card/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                   <CardHeader className="p-8 border-b border-border/40">
                      <CardTitle className="text-2xl font-black text-foreground tracking-tight">Calendar Matrix</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest">Month overview & temporal density</CardDescription>
                   </CardHeader>
                   <CardContent className="p-8">
                      <div className="grid grid-cols-7 gap-4 mb-8">
                         {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                           <div key={day} className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] text-center">{day}</div>
                         ))}
                      </div>
                      <div className="grid grid-cols-7 gap-4">
                         {Array.from({ length: 35 }).map((_, i) => (
                           <motion.div 
                             key={i} 
                             whileHover={{ scale: 1.05 }}
                             className={cn(
                               "aspect-square p-4 rounded-2xl border-2 border-border/30 bg-muted/10 relative group cursor-pointer transition-all hover:border-primary/40 flex flex-col justify-between",
                               i === 15 && "border-primary/40 bg-primary/5 shadow-xl shadow-primary/5",
                               i === 24 && "border-destructive/40 bg-destructive/5 shadow-xl shadow-destructive/5"
                             )}
                           >
                              <span className="text-[11px] font-black text-muted-foreground group-hover:text-foreground">{(i % 31) + 1}</span>
                              {i === 15 && (
                                <Badge className="bg-primary text-white font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded">Peak</Badge>
                              )}
                              {i === 24 && (
                                <Badge className="bg-destructive text-white font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded">Exam</Badge>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Plus size={20} className="text-primary" />
                              </div>
                           </motion.div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
              )}
           </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
