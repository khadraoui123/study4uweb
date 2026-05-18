import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Zap, 
  Sparkles,
  Search,
  Plus,
  Filter,
  Activity,
  ArrowUpRight,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStore } from '../store';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '../store/slices/plannerSlice';

export const CalendarPage: React.FC = () => {
  const { events, exams, tasks, courses } = useStore();

  const loadEvents = useStore(state => state.loadEvents);

  useEffect(() => {
    loadEvents?.();
  }, []);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 17)); // May 2026
  const [view, setView] = useState<'month' | 'week'>('month');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const calendarDays = useMemo(() => {
    const days: { day: number; month: string; fullDate: Date }[] = [];
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    
    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, month: 'prev', fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i) });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: 'current', fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), i) });
    }
    
    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, month: 'next', fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i) });
    }
    
    return days;
  }, [currentDate, firstDayOfMonth, daysInMonth]);

  const upcomingThreats = useMemo(() => {
    const combined = [
      ...exams.map(e => ({ ...e, type: 'exam' as const })),
      ...tasks.filter(t => !t.completed && t.urgency === 'URGENT').map(t => ({ ...t, type: 'task' as const, date: t.dueDate }))
    ];
    return combined
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [exams, tasks]);

  const getEventsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.start.startsWith(dateStr));
  };

  const getDensityClass = (date: Date) => {
    const dayEvents = getEventsForDay(date);
    if (dayEvents.length === 0) return '';
    if (dayEvents.length <= 1) return 'bg-primary/5 border-primary/20';
    if (dayEvents.length <= 3) return 'bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]';
    return 'bg-primary/20 border-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.2)]';
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 shadow-lg shadow-primary/5">
              <Sparkles size={16} className="fill-current animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Sync Protocol v4.0</span>
            </Badge>
            <div className="h-[1px] flex-1 bg-border/50 max-w-[100px]" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Chronos Engine Active</span>
          </div>
          <div className="space-y-2">
             <h1 className="text-6xl font-black heading-os tracking-tighter text-foreground leading-none">Neural Calendar</h1>
             <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
               Predictive temporal orchestration. Synchronizing <span className="text-primary font-black border-b-2 border-primary/20">{events.length} schedule nodes</span> across your academic timeline.
             </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-4 w-full lg:w-auto">
           <div className="flex bg-muted/50 p-1 rounded-xl shadow-inner border border-white/5">
              <Button 
                variant={view === 'month' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setView('month')}
                className="px-6 font-black text-[10px] uppercase tracking-widest rounded-lg h-10"
              >
                Month
              </Button>
              <Button 
                variant={view === 'week' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setView('week')}
                className="px-6 font-black text-[10px] uppercase tracking-widest rounded-lg h-10"
              >
                Week
              </Button>
           </div>
           <Button className="h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] gap-3 shadow-2xl shadow-primary/20 rounded-xl transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground">
              <Plus size={20} />
              Schedule Event
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Calendar Matrix */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
           <Card className="border-border/50 bg-card/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-violet-500/50 to-cyan-500/50" />
              
              <CardHeader className="p-8 border-b border-border/40 flex flex-row items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="w-10 h-10 border-border/50 rounded-xl" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                        <ChevronLeft size={20} />
                      </Button>
                      <Button variant="outline" size="icon" className="w-10 h-10 border-border/50 rounded-xl" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                        <ChevronRight size={20} />
                      </Button>
                   </div>
                   <h2 className="text-3xl font-black text-foreground tracking-tight">{monthName} <span className="text-muted-foreground opacity-50">{year}</span></h2>
                </div>
                <div className="flex items-center gap-4">
                   <div className="relative w-64 group hidden md:block">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all" size={16} />
                      <Input placeholder="Search timeline..." className="pl-10 h-10 bg-muted/20 border-none rounded-xl text-xs font-bold" />
                   </div>
                   <Button variant="outline" size="icon" className="w-10 h-10 border-border/50 rounded-xl">
                      <Filter size={18} />
                   </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                 <div className="grid grid-cols-7 gap-4 mb-8">
                   {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                     <div key={day} className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] text-center">{day}</div>
                   ))}
                 </div>
                 
                 <div className="grid grid-cols-7 gap-4">
                   <AnimatePresence mode="wait">
                     {calendarDays.map((dateObj, i) => {
                       const dayEvents = getEventsForDay(dateObj.fullDate);
                       const densityClass = getDensityClass(dateObj.fullDate);
                       const isToday = dateObj.fullDate.toDateString() === new Date(2026, 4, 17).toDateString();

                       return (
                         <motion.div 
                           key={`${dateObj.month}-${dateObj.day}`}
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: i * 0.005 }}
                           whileHover={{ scale: 1.02 }}
                           className={cn(
                             "aspect-square p-3 rounded-2xl border-2 transition-all cursor-pointer relative group flex flex-col",
                             dateObj.month === 'current' ? "bg-muted/10 border-border/30" : "bg-transparent border-transparent opacity-20",
                             densityClass,
                             isToday && "border-primary/60 bg-primary/5 shadow-xl shadow-primary/10"
                           )}
                         >
                            <span className={cn(
                              "text-xs font-black transition-colors group-hover:text-primary",
                              isToday ? "text-primary" : "text-muted-foreground"
                            )}>
                               {dateObj.day}
                            </span>
                            
                            <div className="flex-1 mt-2 flex flex-col gap-1 overflow-hidden">
                               {dayEvents.slice(0, 3).map((ev, idx) => (
                                 <div 
                                   key={ev.id} 
                                   className={cn(
                                     "h-1.5 rounded-full transition-all group-hover:h-2",
                                     ev.type === 'exam' ? "bg-destructive shadow-[0_0_8px_var(--destructive)]" :
                                     ev.type === 'focus' ? "bg-primary shadow-[0_0_8px_var(--primary)]" :
                                     ev.type === 'lecture' ? "bg-cyan-500" : "bg-slate-400"
                                   )} 
                                   title={ev.title}
                                 />
                               ))}
                               {dayEvents.length > 3 && (
                                 <span className="text-[8px] font-black text-muted-foreground mt-1">+{dayEvents.length - 3} MORE</span>
                               )}
                            </div>

                            {isToday && (
                              <div className="absolute top-2 right-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                              </div>
                            )}
                         </motion.div>
                       );
                     })}
                   </AnimatePresence>
                 </div>
              </CardContent>
           </Card>

           {/* Tactical Load Index Overlay */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-primary/5 border-primary/20 p-6 rounded-[24px] flex items-center gap-6 group hover:bg-primary/10 transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Activity size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Temporal Density</p>
                    <p className="text-xl font-black text-foreground">Optimized</p>
                 </div>
              </Card>
              <Card className="bg-cyan-500/5 border-cyan-500/20 p-6 rounded-[24px] flex items-center gap-6 group hover:bg-cyan-500/10 transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                    <Zap size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Focus Windows</p>
                    <p className="text-xl font-black text-foreground">4 Active</p>
                 </div>
              </Card>
              <Card className="bg-amber-500/5 border-amber-500/20 p-6 rounded-[24px] flex items-center gap-6 group hover:bg-amber-500/10 transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                    <Brain size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Neural Readiness</p>
                    <p className="text-xl font-black text-foreground">88% Peak</p>
                 </div>
              </Card>
           </div>
        </div>

        {/* Temporal Threat Radar Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-8">
           <Card className="border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
              <CardHeader className="p-8 border-b border-border/40 bg-muted/20">
                 <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
                    <AlertTriangle size={16} /> Temporal Threat Radar
                 </CardTitle>
                 <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">High-impact upcoming events</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 {upcomingThreats.map((threat: any, i) => (
                   <div key={threat.id} className="relative pl-6 space-y-3 group cursor-pointer">
                      <div className={cn(
                        "absolute left-0 top-1 w-1 rounded-full transition-all duration-500 group-hover:w-1.5 group-hover:h-full",
                        threat.type === 'exam' ? "bg-destructive h-4" : "bg-amber-500 h-4"
                      )} />
                      <div className="space-y-1">
                         <div className="flex justify-between items-start">
                            <h4 className="text-sm font-black text-foreground leading-tight group-hover:text-primary transition-colors">{threat.title}</h4>
                            <ArrowUpRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            {courses.find(c => c.id === threat.courseId)?.code} • {new Date(threat.date).toLocaleDateString()}
                         </p>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[8px] font-black px-3 py-0.5 rounded-lg border-none shadow-lg",
                        threat.type === 'exam' ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"
                      )}>
                         -{Math.ceil((new Date(threat.date).getTime() - new Date(2026, 4, 17).getTime()) / 86400000)} DAYS
                      </Badge>
                   </div>
                 ))}

                 {upcomingThreats.length === 0 && (
                   <div className="text-center py-10 opacity-40 space-y-3">
                      <Clock size={40} className="mx-auto text-muted-foreground" />
                      <p className="text-[9px] font-black uppercase tracking-widest">No immediate threats detected</p>
                   </div>
                 )}

                 <Button variant="ghost" className="w-full h-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary gap-2 mt-4 border border-dashed border-border/50 hover:border-primary/30">
                    <CalendarIcon size={14} /> Full Agenda Sync
                 </Button>
              </CardContent>
           </Card>

           <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group shadow-2xl border-dashed">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                 <Zap size={120} className="text-primary" />
              </div>
              <CardContent className="p-10 space-y-6 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-xl shadow-primary/10">
                    <Brain size={28} className="animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground tracking-tight">AI Orchestrator</h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed italic border-l-2 border-primary/30 pl-4">
                      "I've identified a <span className="text-primary font-bold">cognitive overlap</span> on May 25th. Recommend shifting Revision Node E-12 to May 23rd."
                    </p>
                 </div>
                 <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 rounded-xl transition-all hover:-translate-y-1 active:translate-y-0">
                    Execute Auto-Balance
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

