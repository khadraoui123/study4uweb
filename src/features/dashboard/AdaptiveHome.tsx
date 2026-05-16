import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { 
  ArrowRight,
  Clock,
  CheckCircle2,
  Brain,
  Zap,
  Target,
  Search,
  Activity,
  ShieldCheck,
  TrendingUp,
  Cpu,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { useNavigate } from 'react-router-dom';

export const AdaptiveDashboard: React.FC = () => {
  const { courses, tasks, aiMemory, toggleTask, streak, startFocusSession, level } = useStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const activeTasks = tasks.filter(t => !t.completed);

  const handleAcceptSchedule = () => {
    alert("Neural schedule synchronized with your temporal engine.");
    navigate('/planner');
  };

  const handleRecalibrate = () => {
    startFocusSession();
    navigate('/focus');
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Neural Status Ticker */}
      <div className="w-full bg-primary/5 border-y border-primary/10 py-2 overflow-hidden relative group">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 items-center"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full animate-pulse" /> {t('dashboard.neuralOS')} 0{i+1}: SYNCHRONIZED</span>
              <span className="flex items-center gap-2"><Activity size={12} className="text-primary" /> LOAD: 42%</span>
              <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-emerald-500" /> INTEGRITY: OPTIMAL</span>
              <span className="flex items-center gap-2"><Cpu size={12} className="text-violet-500" /> CORE: ACTIVE</span>
            </div>
          ))}
        </motion.div>
      </div>

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
             <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 shadow-lg shadow-primary/5">
                <Brain size={16} className="fill-current animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest">{t('dashboard.neuralOS')}</span>
             </Badge>
             <div className="h-px flex-1 bg-border/50 max-w-[100px]" />
             <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">{t('dashboard.integrityVerified')}</span>
          </div>
          <div className="space-y-2">
             <h1 className="text-6xl font-black heading-os tracking-tight text-foreground leading-[1.1]">
               {aiMemory.burnoutRisk > 40 ? t('dashboard.welcomeBack') : t('dashboard.welcome')} <br />
               <span className="text-gradient-ai">Tareq Ahmed</span>
             </h1>
             <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
               {t('dashboard.efficiency')} <span className="text-primary font-black border-b-2 border-primary/20">89%</span>. 
               {t('dashboard.readyToFinalize')} <span className="text-foreground font-black border-b-2 border-primary/40">Circuit Design</span> nodes?
             </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
          <Card 
            className="bg-card/30 backdrop-blur-xl border-border/50 group hover:border-amber-500/30 transition-all cursor-pointer"
            onClick={() => navigate('/achievements')}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center min-w-[160px] relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <Flame size={80} className="text-amber-500" />
              </div>
              <Flame size={32} className="text-amber-500 mb-3 fill-current shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
              <span className="text-5xl font-black text-foreground tracking-tighter tabular-nums">{streak}</span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">{t('dashboard.streak')}</span>
            </CardContent>
          </Card>
          <Card 
            className="bg-primary/5 backdrop-blur-xl border-primary/20 group hover:border-primary/50 transition-all cursor-pointer shadow-2xl shadow-primary/5"
            onClick={() => navigate('/leaderboards')}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center min-w-[160px] relative overflow-hidden">
               <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <Zap size={80} className="text-primary" />
              </div>
              <Zap size={32} className="text-primary mb-3 fill-current shadow-[0_0_20px_rgba(var(--primary),0.4)]" />
              <span className="text-5xl font-black text-primary tracking-tighter tabular-nums">{aiMemory.productivityScore}</span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">{t('dashboard.rank')}</span>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          
          {/* Daily Forecast Card */}
          <Card className="border-border/50 bg-card/20 backdrop-blur-sm overflow-hidden group">
            <CardContent className="p-0 flex flex-col md:flex-row h-full">
               <div className="p-10 flex-1 space-y-8">
                  <div className="space-y-4">
                     <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-3 py-1 font-black text-[10px] tracking-widest uppercase">{t('dashboard.forecast')}</Badge>
                     <h3 className="text-3xl font-black text-foreground tracking-tight">{t('dashboard.peakWindow')}</h3>
                     <p className="text-muted-foreground font-medium leading-relaxed">
                        {t('dashboard.forecastDesc')}
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <Button 
                       className="h-12 px-8 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl shadow-primary/20"
                       onClick={handleAcceptSchedule}
                     >
                        {t('dashboard.acceptSchedule')}
                     </Button>
                     <Button 
                       variant="outline" 
                       className="h-12 px-8 font-black uppercase text-[10px] tracking-widest rounded-xl border-border/50"
                       onClick={() => navigate('/planner')}
                     >
                        {t('dashboard.modifyPlan')}
                     </Button>
                  </div>
               </div>
               <div className="w-full md:w-64 bg-muted/30 border-l border-border/50 p-8 flex flex-col justify-between">
                  <div className="space-y-4" onClick={() => navigate('/analytics')} className="cursor-pointer group/stats">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover/stats:text-primary">{t('dashboard.expectedGains')}</p>
                     <div className="space-y-6">
                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-xs font-bold text-foreground">{t('dashboard.xpVelocity')}</span>
                              <span className="text-xs font-black text-emerald-500">+450</span>
                           </div>
                           <Progress value={85} className="h-1 bg-muted" indicatorClassName="bg-emerald-500" />
                        </div>
                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-xs font-bold text-foreground">{t('dashboard.masteryIndex')}</span>
                              <span className="text-xs font-black text-primary">+12%</span>
                           </div>
                           <Progress value={60} className="h-1 bg-muted" indicatorClassName="bg-primary" />
                        </div>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-border/50 flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                     <TrendingUp size={14} className="text-emerald-500" /> {t('dashboard.trendingUp')}
                  </div>
               </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="tasks" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
              <TabsList className="bg-muted/50 p-1 h-12 rounded-xl">
                <TabsTrigger value="tasks" className="px-8 h-10 font-black uppercase text-[10px] tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-lg transition-all">{t('dashboard.tacticalTasks')}</TabsTrigger>
                <TabsTrigger value="courses" className="px-8 h-10 font-black uppercase text-[10px] tracking-[0.2em] data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-lg transition-all">{t('dashboard.neuralNodes')}</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input className="w-full bg-muted/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:ring-1 ring-primary/20 transition-all outline-none" placeholder={t('dashboard.searchIntel')} />
                 </div>
                 <Button variant="outline" size="icon" className="w-11 h-11 border-border/50 rounded-xl shrink-0" onClick={() => navigate('/tasks')}><Target size={18} /></Button>
              </div>
            </div>

            <TabsContent value="tasks" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTasks.slice(0, 4).map(task => (
                  <Card key={task.id} className="group hover:border-primary/30 transition-all cursor-pointer border-border/50 bg-card/40 hover:bg-card/60" onClick={() => {
                    toggleTask(task.id);
                    alert(`Task completed: ${task.title}. XP Gained: ${task.xpValue}`);
                  }}>
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                          task.urgency === 'URGENT' ? "bg-destructive/10 text-destructive shadow-lg shadow-destructive/5" : "bg-muted text-muted-foreground"
                        )}>
                          {task.urgency === 'URGENT' ? <AlertTriangle size={24} /> : <Clock size={24} />}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3">+{task.xpValue} XP</Badge>
                          <CheckCircle2 size={28} className="text-muted/30 group-hover:text-primary transition-all duration-500" />
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{courses.find(c => c.id === task.courseId)?.code}</span>
                         <div className="w-1 h-1 bg-border rounded-full" />
                         <span className="text-[10px] font-black text-destructive uppercase tracking-[0.2em]">{t('dashboard.priorityHigh')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(course => (
                  <Card 
                    key={course.id} 
                    className="hover:border-primary/30 transition-all border-border/50 group bg-card/40 cursor-pointer"
                    onClick={() => navigate('/courses')}
                  >
                    <CardContent className="p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase font-black text-[10px] tracking-widest px-4 py-1 rounded-lg">{course.code}</Badge>
                        <div className="flex flex-col items-end">
                           <span className="text-2xl font-black text-foreground tabular-nums tracking-tighter">{course.percentage}%</span>
                           <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Mastery Level</span>
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{course.name}</h4>
                      <div className="space-y-2">
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                           <motion.div 
                             className="h-full bg-gradient-to-r from-primary to-violet-500"
                             initial={{ width: 0 }}
                             animate={{ width: `${course.percentage}%` }}
                             transition={{ duration: 1.5, ease: "circOut" }}
                           />
                         </div>
                         <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            <span>{t('dashboard.stability')}</span>
                            <span className="text-emerald-500">{t('dashboard.trendingUp')}</span>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Insights */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          
          <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group shadow-2xl shadow-primary/5">
            <div className="absolute -top-12 -right-12 opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110">
              <Brain size={240} className="text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-primary">
                <Brain size={20} className="fill-current" />
                {t('dashboard.neuralInsight')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 relative z-10">
              <div className="space-y-4">
                 <p className="text-2xl font-black leading-[1.3] text-foreground tracking-tight">
                    {t('dashboard.cognitiveDecay')}
                 </p>
                 <p className="text-muted-foreground font-medium leading-relaxed italic border-l-2 border-primary/30 pl-6">
                    {t('dashboard.syllabusSync')}
                 </p>
              </div>
              <Button 
                className="w-full h-14 font-black uppercase tracking-[0.2em] text-[10px] gap-3 shadow-xl shadow-primary/20 rounded-xl group/btn"
                onClick={handleRecalibrate}
              >
                {t('dashboard.recalibrate')}
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center gap-2">
                 <Activity size={14} className="text-primary" />
                 {t('dashboard.cognitiveMatrix')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {[
                { label: t('dashboard.deepWork'), val: '82%', color: 'text-primary', icon: <Target size={18} />, status: 'Optimal', path: '/focus' },
                { label: t('dashboard.persistence'), val: '94%', color: 'text-primary', icon: <Zap size={18} />, status: 'Peak', path: '/analytics' },
                { label: t('dashboard.retention'), val: '78%', color: 'text-primary', icon: <Brain size={18} />, status: 'Stable', path: '/courses' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-4 group cursor-pointer" onClick={() => navigate(stat.path)}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
                        {stat.icon}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{stat.label}</span>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{stat.status}</p>
                      </div>
                    </div>
                    <span className={cn("text-2xl font-black tabular-nums tracking-tighter", stat.color)}>{stat.val}</span>
                  </div>
                  <Progress value={parseInt(stat.val)} className="h-1 bg-muted/50" indicatorClassName="bg-primary/40 group-hover:bg-primary transition-all duration-500" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/20 backdrop-blur-xl group hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => navigate('/settings')}>
             <CardContent className="p-10 flex items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                   <ShieldCheck size={32} />
                </div>
                <div className="space-y-1">
                   <h4 className="text-xl font-black text-foreground">{t('dashboard.integrityVerified')}</h4>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('dashboard.workspaceSecured')}</p>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
