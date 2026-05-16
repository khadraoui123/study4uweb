import React from 'react';
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
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NeuralAnalytics: React.FC = () => {
  const { aiMemory, performanceHistory, courses } = useStore();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black heading-os text-foreground tracking-tight">Neural Insights</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Biometric focus cross-referenced with <span className="text-primary font-bold">academic trajectory</span>.
          </p>
        </div>
        <Badge variant="outline" className="px-6 py-2 bg-emerald-500/5 text-emerald-500 border-emerald-500/20 gap-2">
           <TrendingUp size={16} />
           <span className="text-sm font-black">+24.8% Index Growth</span>
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Neural Readiness', val: '92%', icon: <Brain size={20} />, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Burnout Risk', val: `${aiMemory.burnoutRisk}%`, icon: <AlertCircle size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Active Retention', val: '78%', icon: <Target size={20} />, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
          { label: 'Study Velocity', val: '4.8h/d', icon: <ArrowUpRight size={20} />, color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((stat, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-all cursor-default">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-foreground tabular-nums">{stat.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <Card className="col-span-12 lg:col-span-8 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <Activity size={20} className="text-primary" />
                  Growth Velocity Timeline
                </CardTitle>
                <CardDescription>Predicted performance vs. Actual mastery</CardDescription>
              </div>
              <Badge variant="secondary" className="font-black uppercase tracking-widest text-[9px]">Last 30 Days</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceHistory}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', padding: '12px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
            <CardHeader>
               <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                 <Zap size={14} fill="currentColor" />
                 Peak Proficiency
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {courses.slice(0, 3).map(course => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-muted-foreground">{course.name}</span>
                    <span className="text-primary">{course.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary" 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/10">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                <AlertCircle size={14} />
                Burnout Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium leading-relaxed italic text-muted-foreground mb-6">
                "Neural load is increasing. Efficiency is high, but sleep quality has dipped by 12%. Recommend a <span className="text-foreground underline decoration-destructive/40">Rest Protocol</span>."
              </p>
              <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-10 border-destructive/20 text-destructive hover:bg-destructive/10">
                Adjust Intensity
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-12">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-widest">Neural Focus Density</CardTitle>
            <CardDescription>Biometric activity logs per temporal window</CardDescription>
          </CardHeader>
          <CardContent className="h-24 flex items-end gap-1.5">
            {aiMemory.focusHeatmap.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${val * 3}px` }}
                className={cn(
                  "flex-1 rounded-t-sm transition-all",
                  val > 20 ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" :
                  val > 10 ? "bg-primary/50" : "bg-muted"
                )}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
