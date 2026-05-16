import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Trophy, 
  Zap, 
  Flame, 
  Crown, 
  Target, 
  Medal, 
  ChevronRight, 
  TrendingUp,
  Activity,
  Award,
  Command,
  Rocket,
  ShieldCheck,
  Dna
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const AchievementSystem: React.FC = () => {
  const { xp, level, achievements, streak, totalFocusTime } = useStore();

  const nextLevelXP = (level + 1) * 1000;
  const progress = (xp / nextLevelXP) * 100;

  // Mock data for XP accrual bar chart
  const xpAccrualData = [
    { day: 'M', xp: 450 },
    { day: 'T', xp: 800 },
    { day: 'W', xp: 600 },
    { day: 'T', xp: 1200 },
    { day: 'F', xp: 900 },
    { day: 'S', xp: 300 },
    { day: 'S', xp: 500 },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-12 max-w-7xl mx-auto pb-20">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-10">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-5 py-2 rounded-full bg-amber-500/10 text-amber-600 border-amber-500/30 gap-3 shadow-xl shadow-amber-500/5">
                <Crown size={16} className="fill-current" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Prestige: Grade {level}</span>
              </Badge>
              <div className="h-[1px] flex-1 bg-border/50 max-w-[120px]" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">Synapse Fidelity: 99.9%</span>
            </div>
            <div className="space-y-2">
               <h1 className="text-7xl font-black heading-os tracking-tighter text-foreground leading-none">Scholar Ascendant</h1>
               <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
                 You are currently <span className="text-amber-500 font-black border-b-2 border-amber-500/20 px-1">Level {level}</span>. 
                 Your cognitive trajectory is <span className="text-foreground font-black">12.4% above baseline</span>.
               </p>
            </div>
          </div>

          <div className="flex gap-6 w-full lg:w-auto">
             <Card className="bg-amber-500/5 border-amber-500/20 backdrop-blur-xl group hover:border-amber-500/40 transition-all cursor-default overflow-hidden relative shadow-2xl">
                <CardContent className="px-10 py-6 flex items-center gap-8 relative z-10">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Neural Streak</p>
                      <p className="text-4xl font-black text-amber-600 tabular-nums tracking-tighter">{streak} DAYS</p>
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-110 transition-transform duration-700">
                      <Flame size={32} className="fill-current" />
                   </div>
                </CardContent>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
             </Card>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10">
          {/* Main Progression Engine */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
             
             <Card className="relative overflow-hidden border-amber-500/30 bg-[#0A0A0F] shadow-2xl group">
                <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000 pointer-events-none">
                  <Trophy size={320} className="text-amber-500" />
                </div>
                <CardContent className="p-12 space-y-12 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="flex items-center gap-10">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-[40px] bg-amber-500 flex flex-col items-center justify-center text-amber-foreground shadow-[0_0_50px_rgba(245,158,11,0.3)] border-4 border-white/20">
                          <span className="text-xs font-black uppercase tracking-widest opacity-60 mb-[-4px]">Level</span>
                          <span className="text-5xl font-black">{level}</span>
                        </div>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                          className="absolute inset-[-15px] border-2 border-dashed border-amber-500/20 rounded-[50px]" 
                        />
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="absolute inset-[-10px] border-2 border-amber-500/40 rounded-[45px]" 
                        />
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-4xl font-black text-foreground tracking-tight">Grade {level} Elite Scholar</h2>
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-3">
                              <Zap size={18} className="text-amber-500 fill-current" />
                              <span className="text-base font-black text-foreground tabular-nums">
                                {xp.toLocaleString()} <span className="text-muted-foreground text-sm font-bold">/ {nextLevelXP.toLocaleString()} XP</span>
                              </span>
                           </div>
                           <Badge className="w-fit bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">Mastery Multiplier: 1.25x</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2 bg-background/40 p-6 rounded-3xl border border-border/50 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-1">Total Neural Focus</p>
                      <p className="text-4xl font-black text-foreground tabular-nums tracking-tighter leading-none">
                        {Math.floor(totalFocusTime / 60)}h <span className="text-xl opacity-30">{totalFocusTime % 60}m</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">Progression to Grade {level + 1}</span>
                      <span className="text-2xl font-black text-amber-500 tabular-nums">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                         transition={{ duration: 2, ease: "circOut" }}
                         className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]" 
                       />
                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                    </div>
                  </div>
                </CardContent>
             </Card>

             <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/5">
                    <Award size={24} className="fill-current" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">Neural Milestones</h2>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">High-fidelity achievement catalog</p>
                  </div>
                  <div className="h-[1px] flex-1 bg-border/50" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {achievements.map((ach) => (
                    <Card key={ach.id} className={cn(
                      "group relative overflow-hidden transition-all duration-500 bg-card/40 border-border/50 hover:bg-card/60",
                      !ach.unlockedAt ? "grayscale opacity-30 cursor-not-allowed" : "hover:border-amber-500/50 cursor-default shadow-xl hover:shadow-amber-500/5"
                    )}>
                      <CardContent className="p-10 flex gap-8">
                        <div className={cn(
                          "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6",
                          ach.unlockedAt ? "bg-amber-500/10 text-amber-600 border-2 border-amber-500/20" : "bg-muted text-muted-foreground border-2 border-transparent"
                        )}>
                          {ach.id.includes('focus') ? <Target size={40} /> : <ShieldCheck size={40} />}
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="space-y-1">
                             <div className="flex justify-between items-start">
                                <h4 className="text-xl font-black text-foreground leading-tight tracking-tight group-hover:text-amber-500 transition-colors">{ach.title}</h4>
                                {ach.unlockedAt && <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[8px] uppercase">Rarity: Rare</Badge>}
                             </div>
                             <p className="text-sm font-medium text-muted-foreground leading-relaxed">{ach.description}</p>
                          </div>
                          {ach.unlockedAt && (
                            <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                               <Badge variant="outline" className="text-[9px] font-black text-amber-600 border-amber-500/20 bg-amber-500/5 px-3 py-1 rounded-lg">
                                 UNLOCKED: {new Date(ach.unlockedAt).toLocaleDateString()}
                               </Badge>
                               <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">+500 XP</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
             </div>
          </div>

          {/* Sidebar Modules */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
             
             {/* XP Accrual Visualization */}
             <Card className="border-border/50 bg-card/40 backdrop-blur-xl shadow-xl">
                <CardHeader className="p-8 pb-4">
                   <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] flex items-center gap-3">
                      <Activity size={16} className="text-primary" /> XP Velocity
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                   <div className="h-[180px] w-full mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={xpAccrualData}>
                            <Bar dataKey="xp" radius={[6, 6, 0, 0]}>
                               {xpAccrualData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.xp > 1000 ? 'var(--primary)' : 'rgba(var(--primary), 0.3)'} />
                               ))}
                            </Bar>
                            <XAxis 
                               dataKey="day" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--muted-foreground)' }} 
                            />
                            <YAxis hide />
                            <RechartsTooltip 
                               cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                               contentStyle={{ backgroundColor: '#020205', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avg daily XP</span>
                         <span className="text-sm font-black text-primary">842 XP</span>
                      </div>
                      <Progress value={84} className="h-1 bg-muted" indicatorClassName="bg-primary" />
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-[#0A0A0F] border-border/50 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50" />
                <CardHeader className="p-8 relative z-10">
                  <CardTitle className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3">
                    <Target size={18} className="text-amber-500" />
                    Neural Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-10 relative z-10">
                   {[
                     { title: 'Deep Stasis protocol', desc: 'Focus for 4 hours in a single session.', reward: '500 XP', progress: 65, icon: <Rocket size={18} /> },
                     { title: 'Node Mastery', desc: 'Complete 10 tasks in Electronics.', reward: '1000 XP', progress: 40, icon: <Dna size={18} /> }
                   ].map((challenge, i) => (
                     <div key={i} className="space-y-5 group/c cursor-pointer">
                        <div className="flex justify-between items-start">
                           <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 group-hover/c:bg-amber-500 group-hover/c:text-black transition-all">
                                 {challenge.icon}
                              </div>
                              <div>
                                 <h4 className="text-base font-black text-foreground leading-tight group-hover/c:text-amber-500 transition-colors">{challenge.title}</h4>
                                 <p className="text-[10px] font-black text-amber-500 mt-1 uppercase tracking-widest">Reward: {challenge.reward}</p>
                              </div>
                           </div>
                           <span className="text-xs font-black text-muted-foreground tabular-nums">{challenge.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${challenge.progress}%` }}
                             className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                           />
                        </div>
                     </div>
                   ))}
                   <Button variant="outline" className="w-full h-14 font-black uppercase text-[10px] tracking-[0.2em] gap-3 border-border/50 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all rounded-xl">
                      Explore All Nodes <ChevronRight size={18} />
                   </Button>
                </CardContent>
             </Card>

             <Card className="border-border/50 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden group">
                <CardHeader className="p-8">
                  <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Global Node Standing</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-8">
                   <div className="flex items-center gap-6 group/rank cursor-pointer">
                      <div className="w-16 h-16 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl group-hover/rank:scale-110 transition-transform duration-700">
                         <TrendingUp size={32} />
                      </div>
                      <div className="space-y-1">
                         <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">Top 3%</p>
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Neural Percentile</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 group/rank cursor-pointer">
                      <div className="w-16 h-16 rounded-[24px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-xl group-hover/rank:scale-110 transition-transform duration-700">
                         <Medal size={32} />
                      </div>
                      <div className="space-y-1">
                         <p className="text-3xl font-black text-foreground tracking-tighter">Gold Tier</p>
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Academic Division</p>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-border/30">
                      <Button variant="ghost" className="w-full h-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary gap-2">
                         <Command size={14} /> Full Leaderboard Sync
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};


