import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Trophy, 
  Users, 
  Crown, 
  Medal, 
  TrendingUp, 
  MessageSquare, 
  Zap, 
  Star,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Leaderboard: React.FC = () => {
  useStore();
  const [leaders, setLeaders] = useState([
    { id: '1', name: 'Alex Rivera', xp: 12400, level: 24, rank: 1, avatar: 'A' },
    { id: '2', name: 'Sarah Chen', xp: 11200, level: 22, rank: 2, avatar: 'S' },
    { id: '3', name: 'James Wilson', xp: 10800, level: 21, rank: 3, avatar: 'J' },
    { id: '4', name: 'Elena Kostic', xp: 9500, level: 19, rank: 4, avatar: 'E' },
    { id: '5', name: 'Marcus Thorne', xp: 8200, level: 16, rank: 5, avatar: 'M' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaders(prev => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = { ...next[idx], xp: next[idx].xp + Math.floor(Math.random() * 50) };
        return next.sort((a, b) => b.xp - a.xp).map((l, i) => ({ ...l, rank: i + 1 }));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="space-y-4">
          <Badge variant="secondary" className="px-4 py-1 rounded-full bg-primary/10 text-primary border-primary/20 gap-2">
            <Users size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Neural Network</span>
          </Badge>
          <h1 className="text-5xl font-black heading-os tracking-tight text-foreground">Intelligence Collective</h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
            Syncing with <span className="text-primary font-black">4,281 scholars</span> across the neural network.
          </p>
        </div>
        
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="px-8 py-4 flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Your Standing</p>
              <p className="text-2xl font-black text-foreground">#128 <span className="text-emerald-500 text-sm font-bold ml-2">↑ 12</span></p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Top 3 Podium */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
           {leaders.slice(0, 3).map((leader, i) => (
             <motion.div 
               key={leader.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={cn(
                 "relative",
                 i === 0 ? "md:-mt-6 z-20" : "z-10"
               )}
             >
               <Card className={cn(
                 "h-full overflow-hidden border-border/50 group hover:border-primary/30 transition-all",
                 i === 0 ? "bg-gradient-to-b from-primary/10 via-background to-background ring-2 ring-primary/20 shadow-2xl shadow-primary/10" : "bg-card/50 backdrop-blur-sm"
               )}>
                 <CardContent className="p-10 flex flex-col items-center text-center gap-6">
                   <div className="relative">
                      <Avatar className={cn(
                        "w-24 h-24 border-4",
                        i === 0 ? "border-primary" : "border-muted"
                      )}>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`} />
                        <AvatarFallback>{leader.avatar}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                        i === 0 ? "bg-amber-400 text-amber-950" : i === 1 ? "bg-slate-300 text-slate-900" : "bg-orange-500 text-orange-950"
                      )}>
                        {i === 0 ? <Crown size={20} /> : i === 1 ? <Medal size={20} /> : <Trophy size={20} />}
                      </div>
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-foreground tracking-tight">{leader.name}</h3>
                      <Badge variant="secondary" className="font-black uppercase text-[10px] tracking-widest mt-2 px-4">Level {leader.level}</Badge>
                   </div>
                   <div className="grid grid-cols-2 gap-8 w-full border-t border-border/50 pt-6 mt-2">
                      <div className="text-center">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Neural XP</p>
                         <p className="text-xl font-black text-foreground tabular-nums">{leader.xp.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Division</p>
                         <p className="text-xl font-black text-primary">{i === 0 ? 'Mythic' : 'Master'}</p>
                      </div>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
           ))}
        </div>

        {/* Extended List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                 <Star size={20} className="fill-current" />
              </div>
              <h2 className="text-xl font-black text-foreground uppercase tracking-widest">Intelligence Ranking</h2>
              <div className="h-[1px] flex-1 bg-border/50" />
           </div>

           <div className="space-y-3">
              {leaders.map((leader) => (
                <Card key={leader.id} className="group hover:bg-muted/30 transition-all border-border/50 cursor-pointer overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <span className="w-8 text-xl font-black text-muted-foreground group-hover:text-primary transition-colors">#{leader.rank}</span>
                       <Avatar className="w-12 h-12 border-2 border-border/50">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`} />
                          <AvatarFallback>{leader.avatar}</AvatarFallback>
                       </Avatar>
                       <div>
                          <h4 className="text-lg font-black text-foreground leading-none">{leader.name}</h4>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">Active Focus Session</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-right hidden sm:block">
                          <p className="text-lg font-black text-foreground tabular-nums leading-none">{leader.xp.toLocaleString()} XP</p>
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1.5">Rising Fast</p>
                       </div>
                       <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl text-muted-foreground group-hover:text-primary hover:bg-primary/10">
                          <MessageSquare size={20} />
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </div>

        {/* Sidebar Insights */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
              <CardHeader>
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-3">
                    <Zap size={16} fill="currentColor" />
                    Peer Activity
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {[
                   { name: 'Sarah Chen', action: 'completed a Mastery Challenge', time: '2m' },
                   { name: 'Marcus Thorne', action: 'reached Level 16', time: '15m' },
                   { name: 'Elena Kostic', action: 'unlocked "Deep Voyager"', time: '1h' }
                 ].map((act, i) => (
                   <div key={i} className="flex gap-4 group">
                      <Avatar className="w-10 h-10 border border-border/50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${act.name}`} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                         <p className="text-sm font-medium text-muted-foreground leading-snug">
                            <span className="font-black text-foreground group-hover:text-primary transition-colors">{act.name}</span> {act.action}
                         </p>
                         <p className="text-[9px] font-black text-muted-foreground/60 uppercase">{act.time} ago</p>
                      </div>
                   </div>
                 ))}
                 <Button variant="outline" className="w-full h-11 font-black uppercase text-[10px] tracking-widest gap-2 mt-4">
                    Open Global Feed <ChevronRight size={14} />
                 </Button>
              </CardContent>
           </Card>

           <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group">
              <CardContent className="p-10 space-y-6 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <UserPlus size={28} />
                 </div>
                 <h3 className="text-2xl font-black text-foreground tracking-tight">Network Sync</h3>
                 <p className="text-muted-foreground text-sm font-medium leading-relaxed italic mb-4">
                   "Your study patterns align with <span className="text-primary font-bold">Sarah Chen</span> by 88%. Sync for a collaborative session?"
                 </p>
                 <Button className="w-full h-12 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20">
                    Initiate Connection
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};


