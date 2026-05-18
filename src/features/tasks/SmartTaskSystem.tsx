import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Brain,
  Zap,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  Target,
  Rocket,
  ShieldCheck,
  MoreHorizontal
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const SmartTaskSystem: React.FC = () => {
  const { tasks, toggleTask, deleteTask, courses, pushToast, updateTaskProgress } = useStore();

  const loadTasks = useStore(state => state.loadTasks);

  useEffect(() => {
    loadTasks?.();
  }, []);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [view, setView] = useState<'LIST' | 'MATRIX'>('LIST');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ACTIVE') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    return true;
  });

  const matrixQuadrants = useMemo(() => {
    return {
      q1: tasks.filter(t => !t.completed && t.urgency === 'URGENT' && t.priority === 1),
      q2: tasks.filter(t => !t.completed && t.urgency === 'NORMAL' && t.priority === 1),
      q3: tasks.filter(t => !t.completed && t.urgency === 'URGENT' && (t.priority === 2 || t.priority === 3)),
      q4: tasks.filter(t => !t.completed && t.urgency === 'NORMAL' && (t.priority === 2 || t.priority === 3))
    };
  }, [tasks]);

  const handleDeferTask = (id: string) => {
    pushToast({
      type: 'insight',
      title: 'Neural Deferral Executed',
      body: 'Task shifted to tomorrow to optimize current cognitive load.'
    });
  };

  const getPriorityBadge = (p: number) => {
    if (p === 1) return <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] font-black uppercase px-2">Critical</Badge>;
    if (p === 2) return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black uppercase px-2">High</Badge>;
    return <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20 text-[9px] font-black uppercase px-2">Normal</Badge>;
  };

  return (
    <TooltipProvider>
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-1 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 shadow-lg shadow-primary/5">
              <ShieldCheck size={14} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Tactical Registry v2.4</span>
            </Badge>
            <h1 className="text-5xl font-black heading-os tracking-tight text-foreground">Task Intelligence</h1>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
              Neural prioritization active. <span className="text-primary font-bold">12 items</span> pending synchronization across <span className="text-foreground font-black">4 course nodes</span>.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="flex bg-muted/50 p-1 rounded-xl shrink-0">
                <Button 
                  variant={view === 'LIST' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setView('LIST')}
                  className="px-4 font-black text-[10px] uppercase tracking-widest gap-2 rounded-lg"
                >
                   <List size={14} /> List
                </Button>
                <Button 
                  variant={view === 'MATRIX' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setView('MATRIX')}
                  className="px-4 font-black text-[10px] uppercase tracking-widest gap-2 rounded-lg"
                >
                   <LayoutGrid size={14} /> Matrix
                </Button>
             </div>
             <Button className="h-12 px-8 font-black uppercase text-[10px] tracking-widest gap-3 shadow-xl shadow-primary/20 rounded-xl transition-all hover:scale-105 active:scale-95 flex-1 md:flex-none">
                <Plus size={18} />
                Initialize Task
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8 space-y-8">
             
             {/* Weekly Velocity Heatmap Placeholder */}
             <Card className="border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 space-y-6">
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Synchronized Velocity</p>
                         <h3 className="text-2xl font-black text-foreground">Activity Matrix</h3>
                      </div>
                      <div className="flex gap-1">
                         {Array.from({ length: 7 }).map((_, i) => (
                           <div key={i} className="flex flex-col items-center gap-1">
                              <div className={cn(
                                "w-6 h-6 rounded-md",
                                i === 4 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : 
                                i === 2 ? "bg-primary/60" :
                                i === 5 ? "bg-primary/20" : "bg-muted"
                              )} />
                              <span className="text-[8px] font-black text-muted-foreground uppercase">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="h-[1px] w-full bg-border/50" />
                   <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Peak Performance: Thu</span>
                      <span>Total XP Accrued: 2,450</span>
                   </div>
                </CardContent>
             </Card>

             <AnimatePresence mode="wait">
               {view === 'LIST' ? (
                 <motion.div 
                   key="list-view"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                 >
                   <Card className="border-border/50 bg-card/20 backdrop-blur-xl">
                      <CardHeader className="p-8 border-b border-border/50">
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div className="flex items-center gap-4 bg-muted/30 p-1 rounded-xl">
                               {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((f) => (
                                 <button
                                   key={f}
                                   onClick={() => setFilter(f)}
                                   className={cn(
                                     "px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                     filter === f ? "bg-background text-primary shadow-lg shadow-black/10" : "text-muted-foreground hover:text-foreground"
                                   )}
                                 >
                                   {f}
                                 </button>
                               ))}
                            </div>
                            <div className="relative w-full sm:w-64">
                               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                               <Input className="pl-10 h-11 bg-muted/20 border-none rounded-xl text-xs font-bold" placeholder="Search Tactical Registry..." />
                            </div>
                         </div>
                      </CardHeader>
                      <CardContent className="p-0">
                         <Table>
                            <TableHeader className="bg-muted/10">
                               <TableRow className="hover:bg-transparent border-border/50">
                                  <TableHead className="w-[60px]"></TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">Protocol Identification</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Priority</TableHead>
                                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Neural Sync</TableHead>
                                  <TableHead className="w-[40px]"></TableHead>
                               </TableRow>
                            </TableHeader>
                            <TableBody>
                               {filteredTasks.map((task) => (
                                 <React.Fragment key={task.id}>
                                    <TableRow className="group border-border/30 hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
                                       <TableCell className="py-6">
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                                            className={cn(
                                              "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                                              task.completed ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : "border-border/50 group-hover:border-primary/50"
                                            )}
                                          >
                                             {task.completed && <CheckCircle2 size={18} />}
                                          </button>
                                       </TableCell>
                                       <TableCell>
                                          <div className="flex flex-col gap-1">
                                             <span className={cn(
                                               "text-base font-black transition-all",
                                               task.completed ? "text-muted-foreground line-through opacity-40" : "text-foreground group-hover:text-primary"
                                             )}>
                                                {task.title}
                                             </span>
                                             <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary bg-primary/5 uppercase tracking-widest">{courses.find(c => c.id === task.courseId)?.code}</Badge>
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Accrual: +{task.xpValue} XP</span>
                                             </div>
                                          </div>
                                       </TableCell>
                                       <TableCell>
                                          {getPriorityBadge(task.priority)}
                                       </TableCell>
                                       <TableCell>
                                          <div className="w-32 space-y-2">
                                             <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Progress</span>
                                                <span className="text-xs font-black text-foreground">{task.progress}%</span>
                                             </div>
                                             <Progress value={task.progress} className="h-1.5 bg-muted" indicatorClassName={cn(task.completed ? "bg-emerald-500" : "bg-primary")} />
                                          </div>
                                       </TableCell>
                                       <TableCell>
                                          <ChevronDown className={cn("text-muted-foreground transition-transform duration-300", expandedTask === task.id && "rotate-180")} size={16} />
                                       </TableCell>
                                    </TableRow>
                                    <AnimatePresence>
                                       {expandedTask === task.id && (
                                         <TableRow className="bg-muted/5 hover:bg-muted/5 border-none">
                                            <TableCell colSpan={5} className="p-0">
                                               <motion.div 
                                                 initial={{ height: 0, opacity: 0 }}
                                                 animate={{ height: 'auto', opacity: 1 }}
                                                 exit={{ height: 0, opacity: 0 }}
                                                 className="overflow-hidden"
                                               >
                                                  <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border/30">
                                                     <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">AI Contextual Analysis</p>
                                                        <p className="text-sm font-medium text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-4">
                                                           "This task is linked to your upcoming <span className="text-foreground font-black">Digital Logic Midterm</span>. Completing it now will boost your predicted exam score by 4.2%."
                                                        </p>
                                                     </div>
                                                     <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sub-Task Clusters</p>
                                                        <div className="space-y-3">
                                                           {['Verify Logic Gates', 'Truth Table Extraction', 'NAND Gate Equiv'].map((st, i) => (
                                                             <div key={i} className="flex items-center gap-3 group/st cursor-pointer">
                                                                <div className="w-4 h-4 rounded-md border border-border/50 group-hover/st:border-primary transition-colors" />
                                                                <span className="text-xs font-bold text-muted-foreground group-hover/st:text-foreground">{st}</span>
                                                             </div>
                                                           ))}
                                                        </div>
                                                     </div>
                                                     <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Execute Options</p>
                                                        <div className="flex flex-col gap-2">
                                                           <Button className="w-full h-10 font-black uppercase text-[10px] tracking-widest gap-2">
                                                              <Zap size={14} className="fill-current" /> Ignite Focus Session
                                                           </Button>
                                                           <div className="flex gap-2">
                                                              <Button variant="outline" onClick={() => handleDeferTask(task.id)} className="flex-1 h-10 font-black uppercase text-[10px] tracking-widest border-border/50">Defer</Button>
                                                              <Button variant="outline" size="icon" className="w-10 h-10 border-border/50"><MoreHorizontal size={16} /></Button>
                                                           </div>
                                                        </div>
                                                     </div>
                                                  </div>
                                               </motion.div>
                                            </TableCell>
                                         </TableRow>
                                       )}
                                    </AnimatePresence>
                                 </React.Fragment>
                               ))}
                            </TableBody>
                         </Table>
                      </CardContent>
                   </Card>
                 </motion.div>
               ) : (
                 <motion.div 
                   key="matrix-view"
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.02 }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-6"
                 >
                    {[
                      { id: 'q1', title: 'Critical & Urgent', tasks: matrixQuadrants.q1, color: 'border-destructive/30 bg-destructive/5' },
                      { id: 'q2', title: 'Important / Not Urgent', tasks: matrixQuadrants.q2, color: 'border-primary/30 bg-primary/5' },
                      { id: 'q3', title: 'Urgent / Low Priority', tasks: matrixQuadrants.q3, color: 'border-amber-500/30 bg-amber-500/5' },
                      { id: 'q4', title: 'Routine Maintenance', tasks: matrixQuadrants.q4, color: 'border-slate-500/30 bg-slate-500/5' }
                    ].map(q => (
                      <Card key={q.id} className={cn("border-2 min-h-[300px]", q.color)}>
                         <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex justify-between items-center">
                               {q.title}
                               <Badge className="bg-background text-foreground border-border/50">{q.tasks.length}</Badge>
                            </CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-3">
                            {q.tasks.map(t => (
                              <div key={t.id} className="p-4 rounded-xl bg-card border border-border/50 group hover:border-primary/30 transition-all cursor-pointer">
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-black group-hover:text-primary transition-colors">{t.title}</h4>
                                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => toggleTask(t.id)}>
                                       <CheckCircle2 size={14} className="text-muted-foreground group-hover:text-primary" />
                                    </Button>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="text-[8px] uppercase">{courses.find(c => c.id === t.courseId)?.code}</Badge>
                                    <span className="text-[9px] font-black text-muted-foreground uppercase">{t.dueDate}</span>
                                 </div>
                              </div>
                            ))}
                            {q.tasks.length === 0 && (
                              <div className="py-20 text-center opacity-20">
                                 <Zap size={32} className="mx-auto mb-2" />
                                 <p className="text-[10px] font-black uppercase tracking-widest">Quadrant Empty</p>
                              </div>
                            )}
                         </CardContent>
                      </Card>
                    ))}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-10">
             
             <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group shadow-2xl shadow-primary/5">
                <div className="absolute -top-12 -right-12 opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110">
                   <Brain size={240} className="text-primary" />
                </div>
                <CardHeader>
                   <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 text-primary">
                      <Zap size={16} className="fill-current" />
                      Neural Strategist
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 relative z-10">
                   <p className="text-xl font-black leading-snug text-foreground tracking-tight">
                      "Optimal focus path detected: Execute <span className="text-primary border-b-2 border-primary/20">DSP Lab Report</span> now to leverage your 92% morning efficiency."
                   </p>
                   <div className="p-5 rounded-2xl bg-background/50 border border-border/50 backdrop-blur-sm space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">System Load</span>
                         <span className="text-xs font-black text-primary">High</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="flex-1 space-y-2">
                            <div className="h-1 w-full bg-muted rounded-full">
                               <div className="h-full w-4/5 bg-primary rounded-full" />
                            </div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase">Predicted Burnout in: 4h 12m</p>
                         </div>
                         <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Target size={18} />
                         </div>
                      </div>
                   </div>
                   <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-[10px] gap-3 shadow-xl shadow-primary/20 rounded-xl group/btn transition-all hover:-translate-y-1 active:translate-y-0">
                      Synchronize Queue
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                   </Button>
                </CardContent>
             </Card>

             <Card className="border-border/50 bg-card/50">
                <CardHeader>
                   <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center gap-2">
                      <Clock size={14} />
                      Deadline Threats
                   </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   {[
                     { title: 'DSP Lab Report', time: '2h 15m', urgency: 'CRITICAL', color: 'bg-destructive text-white shadow-destructive/20' },
                     { title: 'Embedded Quiz', time: '1d 04h', urgency: 'NORMAL', color: 'bg-muted text-muted-foreground border-border/50 border' }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col gap-4 p-6 rounded-2xl bg-muted/20 border border-transparent hover:border-border transition-all cursor-pointer group">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <h4 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Course: EEE182.4</p>
                           </div>
                           <div className={cn("w-2 h-2 rounded-full", item.urgency === 'CRITICAL' ? "bg-destructive animate-ping" : "bg-muted")} />
                        </div>
                        <div className="flex items-center justify-between">
                           <div className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg", item.color)}>
                              <Clock size={12} /> {item.time}
                           </div>
                           <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest gap-1 group-hover:text-primary transition-colors">
                              Mitigate <ArrowRight size={10} className="ml-1" />
                           </Button>
                        </div>
                     </div>
                   ))}
                </CardContent>
             </Card>

             <Card className="border-border/50 bg-card/20 backdrop-blur-xl group hover:border-emerald-500/30 transition-all border-dashed">
                <CardContent className="p-10 flex flex-col items-center text-center gap-6">
                   <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-emerald-500/5">
                      <Rocket size={32} className="fill-current/20" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-black text-foreground">Mission Ready</h4>
                      <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                         Workspace and task queue are in <span className="text-emerald-500 font-black">optimal alignment</span>.
                      </p>
                   </div>
                   <Button variant="outline" className="w-full h-11 border-border/50 font-black uppercase text-[9px] tracking-widest">Verify All Nodes</Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

const ArrowRight = ({ size, className }: { size: number, className?: string }) => <ChevronRight size={size} className={className} />;


