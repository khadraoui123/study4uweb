import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { 
  TrendingUp, 
  Activity, 
  Brain, 
  Zap, 
  Target, 
  AlertCircle,
  ArrowUpRight,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const NeuralAnalytics: React.FC = () => {
  const { aiMemory, performanceHistory, courses, tasks } = useStore();

  const burnoutForecastData = useMemo(() => {
    // Generate simulated forecast data based on task urgency and density
    return [
      { day: 'Mon', load: 45, forecast: 42 },
      { day: 'Tue', load: 52, forecast: 48 },
      { day: 'Wed', load: 68, forecast: 65 },
      { day: 'Thu', load: 85, forecast: 78 },
      { day: 'Fri', load: 92, forecast: 88 },
      { day: 'Sat', load: 40, forecast: 35 },
      { day: 'Sun', load: 30, forecast: 28 },
    ];
  }, [tasks]);

  return (
    <TooltipProvider>
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-10">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-2 shadow-lg shadow-emerald-500/5">
                <Activity size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Analytics v4.1</span>
              </Badge>
              <div className="h-[1px] flex-1 bg-border/50 max-w-[100px]" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Biometric Sync Active</span>
            </div>
            <div className="space-y-2">
               <h1 className="text-6xl font-black heading-os tracking-tighter text-foreground leading-none">Neural Insights</h1>
               <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
                 Deep-tier diagnostic of your <span className="text-emerald-500 font-black border-b-2 border-emerald-500/20">cognitive throughput</span> and academic growth velocity.
               </p>
            </div>
          </div>

          <Badge variant="outline" className="px-8 py-3 bg-emerald-500/5 text-emerald-500 border-emerald-500/20 gap-4 rounded-2xl">
             <TrendingUp size={24} />
             <div className="text-right">
                <p className="text-[9px] font-black uppercase opacity-60">Index Growth</p>
                <p className="text-2xl font-black tracking-tighter">+24.8%</p>
             </div>
          </Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Neural Readiness', val: '92%', icon: <Brain size={24} />, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Burnout Risk', val: `${aiMemory.burnoutRisk}%`, icon: <AlertCircle size={24} />, color: 'text-destructive', bg: 'bg-destructive/10' },
            { label: 'Active Retention', val: '78%', icon: <Target size={24} />, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            { label: 'Study Velocity', val: '4.8h/d', icon: <ArrowUpRight size={24} />, color: 'text-amber-500', bg: 'bg-amber-500/10' }
          ].map((stat, i) => (
            <Card key={i} className="group hover:border-emerald-500/30 transition-all cursor-default border-border/50 bg-card/40 backdrop-blur-xl shadow-xl">
              <CardContent className="p-8">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-lg`}>
                  {stat.icon}
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-foreground tabular-nums tracking-tighter">{stat.val}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8 space-y-10">
             <Card className="border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                <CardHeader className="p-10 border-b border-border/40">
                   <div className="flex justify-between items-center">
                      <div className="space-y-1">
                         <CardTitle className="text-xl font-black flex items-center gap-3">
                            <Activity size={24} className="text-emerald-500" />
                            Growth Velocity Timeline
                         </CardTitle>
                         <CardDescription className="text-xs font-bold uppercase tracking-widest">Predicted performance vs. Actual mastery</CardDescription>
                      </div>
                      <div className="flex bg-muted/30 p-1 rounded-xl">
                         <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase px-4 h-8 rounded-lg">30D</Button>
                         <Button variant="secondary" size="sm" className="text-[9px] font-black uppercase px-4 h-8 rounded-lg bg-background text-primary shadow-lg shadow-black/10">90D</Button>
                      </div>
                   </div>
                </CardHeader>
                <CardContent className="p-10">
                   <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={performanceHistory}>
                            <defs>
                               <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis 
                               dataKey="date" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} 
                               dy={10}
                            />
                            <YAxis 
                               domain={[0, 100]} 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} 
                            />
                            <Tooltip 
                               contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px' }}
                               itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                            />
                            <Area 
                               type="monotone" 
                               dataKey="score" 
                               stroke="hsl(var(--primary))" 
                               strokeWidth={6} 
                               fillOpacity={1} 
                               fill="url(#colorScore)" 
                               animationDuration={2500}
                            />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </CardContent>
             </Card>

             <Card className="border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                <CardHeader className="p-10 border-b border-border/40">
                   <CardTitle className="text-xl font-black flex items-center gap-3 text-destructive">
                      <AlertTriangle size={24} />
                      Burnout Forecast Protocol
                   </CardTitle>
                   <CardDescription className="text-xs font-bold uppercase tracking-widest">Temporal load density analysis</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                   <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={burnoutForecastData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '12px' }} />
                            <Area type="step" dataKey="load" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={3} />
                            <Area type="step" dataKey="forecast" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} strokeDasharray="5 5" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Sidebar Insights */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
             <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group shadow-2xl">
                <CardHeader className="p-10 pb-0">
                   <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                      <Zap size={16} fill="currentColor" />
                      Peak Proficiency
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                   {courses.slice(0, 3).map(course => (
                     <div key={course.id} className="space-y-3">
                        <div className="flex justify-between items-end">
                           <span className="text-sm font-black text-foreground">{course.name}</span>
                           <span className="text-xl font-black text-primary">{course.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden shadow-inner">
                           <motion.div 
                             className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                             initial={{ width: 0 }}
                             animate={{ width: `${course.percentage}%` }}
                             transition={{ duration: 2, ease: "circOut" }}
                           />
                        </div>
                     </div>
                   ))}
                </CardContent>
             </Card>

             <Card className="border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl p-10 space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10">
                   <Sparkles size={28} />
                </div>
                <div className="space-y-4">
                   <h3 className="text-2xl font-black text-foreground tracking-tight">AI Strategy Insight</h3>
                   <p className="text-muted-foreground text-sm font-medium leading-relaxed italic border-l-2 border-amber-500/30 pl-6 py-2">
                     "Your <span className="text-foreground font-bold">XP Velocity</span> has increased by 18% during morning blocks. I recommend shifting high-cognitive tasks to the 8AM - 11AM window for 2026-W21."
                   </p>
                </div>
                <Button className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-amber-500/20 rounded-xl transition-all hover:-translate-y-1">
                   Apply Optimization
                </Button>
             </Card>

             <Card className="bg-destructive/5 border-destructive/20 p-10 space-y-6">
                <div className="flex items-center gap-4 text-destructive">
                   <AlertCircle size={24} />
                   <h4 className="text-lg font-black uppercase tracking-widest">Cognitive Risk</h4>
                </div>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                   Extended deep work periods detected without recovery protocols. AI suggests a <span className="text-foreground font-black underline decoration-destructive/30">Burnout Mitigation</span> session tonight.
                </p>
                <Button variant="outline" className="w-full h-12 border-destructive/20 text-destructive hover:bg-destructive/10 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">
                   Initiate Rest Protocol
                </Button>
             </Card>
          </div>

          {/* Neural Focus Density Map */}
          <Card className="col-span-12 border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
             <CardHeader className="p-10 border-b border-border/40">
                <div className="flex justify-between items-center">
                   <div>
                      <CardTitle className="text-lg font-black uppercase tracking-[0.3em] flex items-center gap-3">
                         <Layers size={20} className="text-primary" />
                         Neural Focus Density Map
                      </CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">Biometric activity logs per temporal window</CardDescription>
                   </div>
                   <div className="flex gap-2">
                      {[1, 2, 3].map(i => <div key={i} className={`w-3 h-3 rounded-full ${i === 3 ? 'bg-primary' : 'bg-muted'}`} />)}
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-10 h-32 flex items-end gap-2">
                {aiMemory.focusHeatmap.map((val, i) => (
                  <UITooltip key={i}>
                     <TooltipTrigger asChild>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${val * 4}px` }}
                          transition={{ delay: i * 0.01, duration: 1 }}
                          className={cn(
                            "flex-1 rounded-t-md transition-all cursor-pointer",
                            val > 20 ? "bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)]" :
                            val > 10 ? "bg-primary/50" : "bg-muted hover:bg-muted-foreground/20"
                          )}
                        />
                     </TooltipTrigger>
                     <TooltipContent className="bg-black text-[10px] font-black uppercase border-white/10">Window {i}:00 — Intensity: {val}</TooltipContent>
                  </UITooltip>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};
