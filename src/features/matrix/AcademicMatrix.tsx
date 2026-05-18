import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import type { Course } from '../../store/slices/academicSlice';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  GraduationCap, 
  ChevronRight, 
  Calendar,
  Target,
  Zap,
  Activity,
  Layers,
  BarChart3,
  MousePointer2,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';

import { Modal } from "@/components/ui/modal";

export const AcademicMatrix: React.FC = () => {
  const { courses, tasks, performanceHistory, addCourse, boostMastery, pushToast } = useStore();

  const loadCourses = useStore(state => state.loadCourses);
  const loadExams = useStore(state => state.loadExams);
  const loadPerformance = useStore(state => state.loadPerformance);

  useEffect(() => {
    loadCourses?.();
    loadExams?.();
    loadPerformance?.();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    instructor: '',
    schedule: '',
    room: ''
  });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const course: any = {
      id: Math.random().toString(),
      ...newCourse,
      difficulty: 5,
      percentage: 0,
      currentGrade: 'N/A',
      attendancePresent: 0,
      attendanceAbsent: 0,
      attendanceLate: 0,
    };
    addCourse(course);
    setIsModalOpen(false);
    setNewCourse({ code: '', name: '', instructor: '', schedule: '', room: '' });
    pushToast({
      type: 'success',
      title: 'Neural Node Synchronized',
      body: `Entity ${course.code} initialized in the academic matrix.`
    });
  };

  const handleBoostMastery = (courseId: string) => {
    boostMastery(courseId, 15);
    pushToast({
      type: 'insight',
      title: 'Syllabus Injection Complete',
      body: 'Cognitive retention boosted by 15% through rapid neural sync.',
    });
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
             <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase font-black text-[9px] tracking-[0.4em] px-4 py-1.5 rounded-full shadow-lg shadow-primary/5">
                Strategic / Command_Center
             </Badge>
             <div className="h-[1px] flex-1 bg-border/50 max-w-[100px]" />
             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">Operational Readiness: 98.4%</span>
          </div>
          <div className="space-y-2">
             <h1 className="text-6xl font-black heading-os tracking-tighter text-foreground leading-none">Academic Matrix</h1>
             <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
               Strategic orchestration of <span className="text-foreground font-black border-b-2 border-primary/20">enrollment nodes</span> and predictive grade trajectories.
             </p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all" size={18} />
            <Input 
              placeholder="Query subjects..."
              className="pl-10 h-14 bg-muted/20 border-border/50 focus-visible:bg-background focus-visible:ring-1 ring-primary/20 transition-all rounded-xl"
            />
          </div>
          <Button 
            className="font-black uppercase text-[10px] tracking-widest px-8 h-14 shadow-2xl shadow-primary/20 rounded-xl transition-all hover:scale-105 active:scale-95"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} className="mr-2" />
            Add Entity
          </Button>
        </div>
      </header>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Initialize New Neural Node"
      >
        <form onSubmit={handleAddCourse} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Course Code</label>
              <Input 
                required 
                value={newCourse.code}
                onChange={e => setNewCourse({...newCourse, code: e.target.value})}
                placeholder="e.g. CS101" 
                className="bg-muted/30 border-border/50 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Room Node</label>
              <Input 
                value={newCourse.room}
                onChange={e => setNewCourse({...newCourse, room: e.target.value})}
                placeholder="e.g. L402" 
                className="bg-muted/30 border-border/50 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity Name</label>
            <Input 
              required 
              value={newCourse.name}
              onChange={e => setNewCourse({...newCourse, name: e.target.value})}
              placeholder="e.g. Advanced Neural Architectures" 
              className="bg-muted/30 border-border/50 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lead Instructor</label>
            <Input 
              value={newCourse.instructor}
              onChange={e => setNewCourse({...newCourse, instructor: e.target.value})}
              placeholder="e.g. Dr. K. Vance" 
              className="bg-muted/30 border-border/50 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Temporal Schedule</label>
            <Input 
              value={newCourse.schedule}
              onChange={e => setNewCourse({...newCourse, schedule: e.target.value})}
              placeholder="e.g. Mon/Wed 2:00 PM" 
              className="bg-muted/30 border-border/50 rounded-xl"
            />
          </div>
          <Button type="submit" className="w-full h-14 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 rounded-xl">
            Execute Initialization
          </Button>
        </form>
      </Modal>

      <div className="grid grid-cols-12 gap-10">
        
        {/* Cumulative Performance Forecast */}
        <Card className="col-span-12 border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden group">
           <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
              <div className="space-y-1">
                 <CardTitle className="text-sm font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Activity size={18} />
                    Grade Velocity Forecast
                 </CardTitle>
                 <CardDescription className="text-xs font-bold uppercase tracking-widest">Predictive trajectory based on current neural sync</CardDescription>
              </div>
              <div className="flex gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">GPA Prediction</p>
                    <p className="text-2xl font-black text-foreground">3.82 <span className="text-emerald-500 text-xs font-black">▲ 0.04</span></p>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-10 pt-6">
              <div className="h-[300px] w-full mt-6">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceHistory}>
                       <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                       <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--muted-foreground)' }} 
                          dy={10}
                       />
                       <YAxis hide domain={[0, 100]} />
                       <RechartsTooltip 
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          labelStyle={{ fontWeight: 900, color: 'var(--primary)' }}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="var(--primary)" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorScore)" 
                          animationDuration={2000}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </CardContent>
        </Card>

        {/* Enrollment Grid */}
        <div className="col-span-12 space-y-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/5">
                <Layers size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">Neural Nodes</h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Active curriculum modules</p>
             </div>
             <div className="h-[1px] flex-1 bg-border/50" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <Card 
                key={course.id} 
                onClick={() => setSelectedCourse(course)}
                className="group hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden bg-card/40 hover:bg-card/60 shadow-xl hover:shadow-primary/5"
              >
                <CardContent className="p-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-lg bg-primary/10 text-primary border-none shadow-inner">{course.code}</Badge>
                       <h3 className="text-2xl font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">{course.name}</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50">
                       <MoreHorizontal size={24} />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 border-y border-border/50 py-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Mastery Index</p>
                        <p className="text-4xl font-black text-foreground tabular-nums tracking-tighter">{course.percentage}%</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Grade Node</p>
                        <p className="text-4xl font-black text-emerald-500 tabular-nums tracking-tighter">{course.currentGrade}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                           <Target size={14} /> Efficiency Load
                        </p>
                        <span className="text-xs font-black text-foreground">{(course.difficulty * 10)}%</span>
                     </div>
                     <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${course.percentage}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className={cn(
                            "h-full transition-all duration-1000",
                            course.percentage > 80 ? "bg-gradient-to-r from-emerald-500 to-teal-400" :
                            course.percentage > 40 ? "bg-gradient-to-r from-primary to-violet-500" :
                            "bg-gradient-to-r from-destructive to-orange-500"
                          )} 
                        />
                     </div>
                  </div>

                  <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl border border-border/50">
                     <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <Avatar key={i} className="w-8 h-8 border-4 border-background shadow-lg">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=node${i}${course.id}`} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="w-8 h-8 rounded-full border-4 border-background bg-primary/20 flex items-center justify-center text-[9px] font-black text-primary shadow-lg">+4</div>
                     </div>
                     <Button 
                        variant="ghost" 
                        onClick={(e) => { e.stopPropagation(); handleBoostMastery(course.id); }}
                        className="text-[10px] font-black text-primary hover:text-primary uppercase tracking-widest gap-2 h-8 px-4 rounded-xl hover:bg-primary/5"
                     >
                        <Zap size={14} className="fill-current" />
                        Inject Sync
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Course Modal */}
        <Modal 
          isOpen={!!selectedCourse} 
          onClose={() => setSelectedCourse(null)} 
          title={selectedCourse ? `Entity Details: ${selectedCourse.code}` : ''}
        >
          {selectedCourse && (
            <div className="space-y-8 p-2">
               <div className="flex justify-between items-center">
                  <div>
                     <h3 className="text-3xl font-black text-foreground">{selectedCourse.name}</h3>
                     <p className="text-muted-foreground font-bold mt-1">Lead: {selectedCourse.instructor}</p>
                  </div>
                  <Badge className="text-2xl font-black px-6 py-2 rounded-2xl bg-primary/10 text-primary border-none">
                     {selectedCourse.currentGrade}
                  </Badge>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-muted/30 border-none p-6 space-y-2">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mastery Index</p>
                     <p className="text-4xl font-black text-foreground">{selectedCourse.percentage}%</p>
                  </Card>
                  <Card className="bg-muted/30 border-none p-6 space-y-2">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Attendance Sync</p>
                      <p className="text-4xl font-black text-foreground">{Math.round((selectedCourse.attendancePresent / (selectedCourse.attendancePresent + selectedCourse.attendanceAbsent + selectedCourse.attendanceLate || 1)) * 100)}%</p>
                  </Card>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Linked Resources</h4>
                  <div className="grid grid-cols-1 gap-3">
                     {['Syllabus_v2.pdf', 'Lecture_Notes_Neural_Sync.md', 'Core_Curriculum_Resource.link'].map(res => (
                       <div key={res} className="p-4 rounded-xl bg-card border border-border/50 flex justify-between items-center hover:bg-muted/50 transition-colors cursor-pointer group">
                          <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{res}</span>
                          <ChevronRight size={16} className="text-muted-foreground" />
                       </div>
                     ))}
                  </div>
               </div>

               <div className="pt-6 border-t border-border/50 flex gap-4">
                  <Button className="flex-1 h-14 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-primary/20">
                     <Brain size={18} /> Deep Focus session
                  </Button>
                  <Button variant="outline" className="flex-1 h-14 font-black uppercase text-[10px] tracking-widest gap-2 border-border/50">
                     <Layers size={18} /> Node Analytics
                  </Button>
               </div>
            </div>
          )}
        </Modal>

        {/* Tactical Overview: Deadline Radar */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <Zap size={24} className="fill-current" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">Deadline Radar</h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">High-threat temporal events</p>
             </div>
             <div className="h-[1px] flex-1 bg-border/50" />
          </div>
          
          <Card className="border-border/50 bg-card/20 backdrop-blur-xl overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Operational Entity</TableHead>
                  <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Unit Code</TableHead>
                  <TableHead className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Temporal Sync</TableHead>
                  <TableHead className="px-10 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Intensity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.filter(t => !t.completed).slice(0, 6).map(task => (
                  <TableRow key={task.id} className="hover:bg-muted/50 transition-all group cursor-pointer border-border/30">
                    <TableCell className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]",
                          task.urgency === 'URGENT' ? "bg-destructive animate-pulse" : "bg-primary"
                        )} />
                        <span className="text-base font-black text-foreground group-hover:text-primary transition-colors">{task.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-10 py-8">
                      <Badge variant="outline" className="text-[10px] font-black text-primary border-primary/20 bg-primary/5 uppercase tracking-widest px-3 py-1 rounded-lg">{courses.find(c => c.id === task.courseId)?.code}</Badge>
                    </TableCell>
                    <TableCell className="px-10 py-8">
                      <div className="flex items-center gap-3 text-xs font-black text-muted-foreground uppercase tracking-widest">
                         <Calendar size={14} className="text-primary" />
                         <span>{task.dueDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-10 py-8 text-right">
                      <Badge variant={task.urgency === 'URGENT' ? "destructive" : "secondary"} className="text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-lg shadow-lg">
                        {task.urgency}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Neural Health Module */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <BarChart3 size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">Neural Status</h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Integrity & health metrics</p>
             </div>
          </div>

          <div className="space-y-10">
             <Card className="bg-emerald-500/5 border-emerald-500/20 relative overflow-hidden group shadow-2xl shadow-emerald-500/5">
                <CardContent className="p-10 space-y-10">
                   <div className="relative z-10 flex flex-col gap-8">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-2">
                            <ShieldCheck size={14} /> Cumulative Grade Index
                         </p>
                         <div className="flex items-end gap-3">
                            <h4 className="text-7xl font-black text-foreground tabular-nums tracking-tighter">3.38</h4>
                            <span className="text-2xl font-black text-muted-foreground mb-3 opacity-30">/ 4.0</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-4">
                         <div className="flex justify-between items-center">
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] tracking-widest h-9 px-6 rounded-xl shadow-xl shadow-emerald-500/20">
                               +0.12 VELOCITY ▲
                            </Badge>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status: Excellence</span>
                         </div>
                         <Progress value={84} className="h-1.5 bg-muted" indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                      <GraduationCap size={180} className="text-emerald-500" />
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-card/40 backdrop-blur-sm border-border/50 group border-dashed shadow-xl">
                <CardContent className="p-10 space-y-10">
                   <div className="flex justify-between items-center">
                       <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                         <Brain size={28} />
                      </div>
                      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-muted-foreground group-hover:text-primary">
                         <MousePointer2 size={18} />
                      </Button>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-xl font-black text-foreground uppercase tracking-widest">Neural Calibration</h3>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed italic border-l-2 border-primary/30 pl-6">
                        "Node <span className="text-primary font-black">Discrete Structures</span> is performing at 14% below baseline. AI Tutor suggests a rapid syllabus injection."
                      </p>
                   </div>
                   <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/20 rounded-xl transition-all hover:-translate-y-1 active:translate-y-0">
                      Initiate Recovery Sync
                   </Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
