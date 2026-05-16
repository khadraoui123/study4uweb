import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles, 
  Clock, 
  BookOpen,
  AlertCircle,
  Zap,
  LayoutGrid,
  List,
  Target,
  Activity,
  History,
  MousePointer2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

export const DynamicPlanner: React.FC = () => {
  const { exams, courses, tasks, addTask } = useStore();
  const [view, setView] = useState<'calendar' | 'timeline'>('timeline');
  const [examMode, setExamMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    courseId: '',
    dueDate: new Date().toISOString().split('T')[0],
    urgency: 'NORMAL' as const
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: Math.random().toString(),
      ...newTask,
      priority: newTask.urgency === 'URGENT' ? 1 : 2,
      completed: false,
      progress: 0,
      xpValue: newTask.urgency === 'URGENT' ? 250 : 100
    };
    addTask(task);
    setIsModalOpen(false);
    setNewTask({ title: '', courseId: '', dueDate: new Date().toISOString().split('T')[0], urgency: 'NORMAL' });
    alert(`Task "${task.title}" added to tactical queue.`);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

  return (
    <TooltipProvider>
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-10">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 shadow-lg shadow-primary/5">
                <Sparkles size={16} className="fill-current" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Temporal Orchestration Active</span>
              </Badge>
              <div className="h-[1px] flex-1 bg-border/50 max-w-[100px]" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Current Epoch: Semester 02</span>
            </div>
            <div className="space-y-2">
               <h1 className="text-6xl font-black heading-os tracking-tighter text-foreground leading-none">Dynamic Planner</h1>
               <p className="text-muted-foreground text-xl font-medium max-w-3xl leading-relaxed">
                 AI is balancing your workload across <span className="text-primary font-black border-b-2 border-primary/20">{courses.length} course nodes</span> and active deadlines.
               </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-6 w-full lg:w-auto">
             <Tabs value={view} onValueChange={(v) => setView(v as any)} className="bg-muted/50 p-1 h-14 rounded-2xl shadow-inner">
                <TabsList className="bg-transparent border-none gap-2 px-2">
                   <TabsTrigger value="timeline" className="gap-2 px-8 h-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-xl transition-all rounded-xl">
                      <List size={16} />
                      Timeline
                   </TabsTrigger>
                   <TabsTrigger value="calendar" className="gap-2 px-8 h-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-xl transition-all rounded-xl">
                      <LayoutGrid size={16} />
                      Calendar
                   </TabsTrigger>
                </TabsList>
             </Tabs>
             <div className="flex gap-4">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] gap-3 px-10 shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95"
                >
                   <Plus size={20} />
                   Quick Task
                </Button>
                <Button 
                  variant={examMode ? "destructive" : "outline"}
                  onClick={() => setExamMode(!examMode)}
                  className={cn(
                    "h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] gap-3 px-10 border-2 transition-all active:scale-95",
                    examMode ? "bg-destructive text-white shadow-2xl shadow-destructive/30 animate-pulse border-destructive" : "border-border/50 hover:border-primary/50"
                  )}
                >
                   <AlertCircle size={20} />
                   {examMode ? 'Exam Protocol Active' : 'Engage Exam Protocol'}
                </Button>
             </div>
          </div>
        </header>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Create Tactical Task"
        >
          <form onSubmit={handleAddTask} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Task Objective</label>
              <Input 
                required 
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                placeholder="e.g. Design Logic Circuits for Lab 4" 
                className="bg-muted/30 border-border/50 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Course Node</label>
                <select 
                  required
                  value={newTask.courseId}
                  onChange={e => setNewTask({...newTask, courseId: e.target.value})}
                  className="w-full h-10 bg-muted/30 border border-border/50 rounded-xl px-3 text-sm focus:outline-none focus:ring-1 ring-primary/20"
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Urgency Level</label>
                <select 
                  value={newTask.urgency}
                  onChange={e => setNewTask({...newTask, urgency: e.target.value as any})}
                  className="w-full h-10 bg-muted/30 border border-border/50 rounded-xl px-3 text-sm focus:outline-none focus:ring-1 ring-primary/20"
                >
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Due Date</label>
              <Input 
                type="date"
                required 
                value={newTask.dueDate}
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                className="bg-muted/30 border-border/50 rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full h-14 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 rounded-xl">
              Initialize Task
            </Button>
          </form>
        </Modal>

        <div className="grid grid-cols-12 gap-10">
           <div className="col-span-12 lg:col-span-9 space-y-10">
              
              {/* Energy/Cognitive Load Visualization Overlay */}
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
                             <div className="w-3 h-3 rounded-full bg-primary" />
                             <span className="text-[10px] font-black text-muted-foreground uppercase">Peak</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-muted" />
                             <span className="text-[10px] font-black text-muted-foreground uppercase">Rest</span>
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

              <Card className="border-border/50 bg-card/40 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                 <CardContent className="p-0">
                    {view === 'timeline' ? (
                      <div className="flex">
                         {/* Hour Labels */}
                         <div className="w-24 border-r border-border/50 bg-muted/20 py-10 flex flex-col items-center gap-[60px]">
                            {hours.map(h => (
                              <span key={h} className="text-[11px] font-black text-muted-foreground uppercase tracking-widest tabular-nums">{h}:00</span>
                            ))}
                         </div>
                         
                         {/* Days View */}
                         <div className="flex-1 overflow-x-auto custom-scrollbar flex">
                            {days.slice(0, 5).map((day) => (
                              <div key={day} className="min-w-[280px] flex-1 border-r border-border/30 last:border-none relative">
                                 <div className="p-6 border-b border-border/30 bg-muted/10 sticky top-0 z-10 backdrop-blur-md">
                                    <h3 className="text-xs font-black text-foreground uppercase tracking-[0.3em] text-center">{day}</h3>
                                 </div>
                                 <div className="h-[960px] relative">
                                    {/* Grid Lines */}
                                    {hours.map((_, hIdx) => (
                                      <div key={hIdx} className="absolute w-full h-[1px] bg-border/20" style={{ top: `${(hIdx + 1) * 80}px` }} />
                                    ))}
                                    
                                    {/* Events */}
                                    {day === 'Tuesday' && (
                                      <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute left-4 right-4 bg-primary/10 border-2 border-primary/40 rounded-2xl p-6 shadow-xl shadow-primary/10 group cursor-pointer hover:bg-primary/20 transition-all z-20"
                                        style={{ top: '280px', height: '160px' }} // 11:30 - 1:30
                                      >
                                         <div className="flex justify-between items-start mb-4">
                                            <Badge className="bg-primary text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg">Lecture</Badge>
                                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                                               <BookOpen size={18} />
                                            </div>
                                         </div>
                                         <h4 className="text-base font-black text-foreground leading-tight mb-2">Electrical Circuit Design 1L</h4>
                                         <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            <Clock size={12} className="text-primary" /> 11:30 - 13:30
                                         </div>
                                      </motion.div>
                                    )}

                                    {examMode && day === 'Tuesday' && (
                                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute left-4 right-4 bg-destructive/10 border-2 border-destructive/40 border-dashed rounded-2xl p-6 shadow-xl shadow-destructive/10 group cursor-pointer hover:bg-destructive/20 transition-all z-20"
                                        style={{ top: '640px', height: '160px' }} // 4:00 - 6:00
                                      >
                                         <div className="flex justify-between items-start mb-4">
                                            <Badge className="bg-destructive text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg">High Focus</Badge>
                                            <Zap size={18} className="text-destructive fill-current" />
                                         </div>
                                         <h4 className="text-base font-black text-foreground leading-tight mb-2">Deep Revision: Circuit Analysis</h4>
                                         <div className="flex items-center gap-3 text-[10px] font-black text-destructive uppercase tracking-widest">
                                            <Target size={12} /> AI Optimal Window
                                         </div>
                                      </motion.div>
                                    )}
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    ) : (
                      <div className="p-10">
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
                                  "aspect-square p-4 rounded-2xl border-2 border-border/30 bg-muted/10 relative group cursor-pointer transition-all hover:border-primary/40",
                                  i === 15 && "border-primary/40 bg-primary/5 shadow-xl shadow-primary/5",
                                  i === 24 && "border-destructive/40 bg-destructive/5"
                                )}
                              >
                                 <span className="text-[11px] font-black text-muted-foreground group-hover:text-foreground">{(i % 31) + 1}</span>
                                 {i === 15 && <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-primary rounded-full" />}
                                 {i === 24 && <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-destructive rounded-full shadow-[0_0_10px_var(--destructive)]" />}
                                 
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus size={20} className="text-primary" />
                                 </div>
                              </motion.div>
                            ))}
                         </div>
                      </div>
                    )}
                 </CardContent>
              </Card>
           </div>

           <div className="col-span-12 lg:col-span-3 space-y-10">
              <Card className="border-border/50 bg-card/50">
                 <CardHeader>
                    <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center gap-2">
                       <CalendarIcon size={16} className="text-primary" />
                       Temporal Nodes
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    {exams.map(exam => (
                      <Card key={exam.id} className="bg-muted/20 border-border/30 hover:border-primary/30 transition-all cursor-pointer group shadow-lg">
                         <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                               <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-[9px] font-black px-3 py-1 rounded-lg">
                                  -{Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} DAYS
                               </Badge>
                               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{exam.weight}% WEIGHT</span>
                            </div>
                            <h4 className="font-black text-foreground text-base mb-2 group-hover:text-primary transition-colors leading-tight">{exam.title}</h4>
                            <div className="flex items-center gap-3">
                               <div className="w-1 h-1 rounded-full bg-border" />
                               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{courses.find(c => c.id === exam.courseId)?.name}</p>
                            </div>
                         </CardContent>
                      </Card>
                    ))}
                 </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20 overflow-hidden group shadow-2xl shadow-primary/5 relative">
                 <div className="absolute -top-12 -right-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                    <Sparkles size={160} className="text-primary" />
                 </div>
                 <CardContent className="p-10 space-y-8 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                       <Zap size={28} className="fill-current" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-2xl font-black text-foreground tracking-tighter">Conflict Intelligence</h3>
                       <p className="text-muted-foreground text-sm font-medium leading-relaxed italic border-l-2 border-primary/30 pl-4">
                         "I've reorganized your Friday schedule to accommodate for the <span className="text-primary font-black">Midterm Exam</span>. Focus density increased by 20% to prevent cognitive overlap."
                       </p>
                    </div>
                    <Button className="w-full h-14 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20 rounded-xl transition-all hover:-translate-y-1 active:translate-y-0">
                       Accept Synchronization
                    </Button>
                 </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/20 border-dashed">
                 <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                          <History size={14} /> Audit Logs
                       </p>
                       <MousePointer2 size={16} className="text-muted-foreground/30" />
                    </div>
                    <div className="space-y-4">
                       {['Schedule Calibrated', 'Buffer Time Added', 'Contextual Sync'].map((log, i) => (
                         <div key={i} className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                            <span>{log}</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase">OK</span>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
