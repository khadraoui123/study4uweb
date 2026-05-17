import React from 'react';
import { Medal, Crown, Star, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useStore } from '../store';
import { cn } from "@/lib/utils";

export const LeaderboardPage: React.FC = () => {
  const { leaderboard } = useStore();
  const leaders = leaderboard || [];

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 shadow-lg shadow-primary/5">
              <Trophy size={16} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Intelligence Sync</span>
            </Badge>
            <div className="h-[1px] flex-1 bg-border/50 max-w-[100px]" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Scholar Collective v2.1</span>
          </div>
          <div className="space-y-2">
             <h1 className="text-6xl font-black heading-os tracking-tighter text-foreground leading-none">Global Rankings</h1>
             <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
               Benchmarking neural capacity against the <span className="text-primary font-black border-b-2 border-primary/20">academic collective</span>.
             </p>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20 shadow-2xl">
           <CardContent className="px-8 py-6 flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Your Standing</p>
                 <p className="text-2xl font-black text-foreground">#128 <span className="text-emerald-500 text-xs font-black ml-1">▲ 4</span></p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <TrendingUp size={28} />
              </div>
           </CardContent>
        </Card>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10">
        {/* Top 3 Podiums */}
        <div className="order-2 md:order-1 md:pt-16">
           <Card className="border-border/50 bg-card/40 backdrop-blur-xl p-10 text-center relative overflow-hidden group hover:border-primary/30 transition-all shadow-xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-slate-400/50" />
             <Medal size={48} className="mx-auto text-slate-400 mb-6 group-hover:scale-110 transition-transform" />
             <div className="relative inline-block mb-6">
                <Avatar className="w-24 h-24 border-4 border-slate-400/20 shadow-2xl">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[1]?.name || 'Sarah'}`} />
                  <AvatarFallback>{leaders[1]?.avatar || 'SC'}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-slate-400 text-slate-900 flex items-center justify-center font-black shadow-lg">2</div>
             </div>
             <h3 className="font-black text-2xl text-foreground tracking-tight">{leaders[1]?.name || 'Sarah Chen'}</h3>
             <Badge variant="secondary" className="font-black uppercase text-[9px] tracking-widest mt-2 px-4">Level {leaders[1]?.level || 38}</Badge>
             <div className="mt-8 pt-6 border-t border-border/50 font-black text-3xl tabular-nums tracking-tighter">{(leaders[1]?.xp || 11200).toLocaleString()} XP</div>
           </Card>
        </div>

        <div className="order-1 md:order-2">
           <Card className="border-primary/50 bg-primary/5 backdrop-blur-2xl p-12 text-center relative overflow-hidden shadow-2xl ring-2 ring-primary/20">
             <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
             <Crown size={64} className="mx-auto text-amber-400 mb-8 animate-bounce" />
             <div className="relative inline-block mb-6">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-[0_0_50px_rgba(var(--primary),0.3)]">
                   <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[0]?.name || 'Alex'}`} />
                   <AvatarFallback>{leaders[0]?.avatar || 'AR'}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 border-2 border-white/20">1</div>
             </div>
             <h3 className="font-black text-3xl text-foreground tracking-tight">{leaders[0]?.name || 'Alex Rivera'}</h3>
             <Badge className="bg-primary hover:bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest mt-2 px-6 h-8">Neural Champion</Badge>
             <div className="mt-8 pt-6 border-t border-primary/20 font-black text-4xl tabular-nums tracking-tighter text-primary">{(leaders[0]?.xp || 12450).toLocaleString()} XP</div>
           </Card>
        </div>

        <div className="order-3 md:order-3 md:pt-24">
           <Card className="border-border/50 bg-card/40 backdrop-blur-xl p-8 text-center relative overflow-hidden group hover:border-primary/30 transition-all shadow-xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-amber-700/50" />
             <Star size={40} className="mx-auto text-amber-600 mb-6 group-hover:scale-110 transition-transform" />
             <div className="relative inline-block mb-6">
                <Avatar className="w-20 h-20 border-4 border-amber-600/20 shadow-2xl">
                   <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaders[2]?.name || 'James'}`} />
                   <AvatarFallback>{leaders[2]?.avatar || 'JM'}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-lg bg-amber-600 text-amber-50 flex items-center justify-center font-black shadow-lg">3</div>
             </div>
             <h3 className="font-black text-xl text-foreground tracking-tight">{leaders[2]?.name || 'James Miller'}</h3>
             <Badge variant="secondary" className="font-black uppercase text-[9px] tracking-widest mt-2 px-4">Level {leaders[2]?.level || 35}</Badge>
             <div className="mt-8 pt-6 border-t border-border/50 font-black text-2xl tabular-nums tracking-tighter">{(leaders[2]?.xp || 9800).toLocaleString()} XP</div>
           </Card>
        </div>
      </div>

      <Card className="border-border/50 bg-card/20 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-border/50 flex justify-between items-center bg-muted/20">
           <h2 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
              <Users size={16} /> Extended Scholar Registry
           </h2>
           <Badge variant="outline" className="font-black uppercase text-[9px] tracking-widest px-4 border-border/50">Top 100 Sync</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/10 border-b border-border/50">
              <tr>
                <th className="px-10 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Rank</th>
                <th className="px-10 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Operational Entity</th>
                <th className="px-10 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-center">Neural Grade</th>
                <th className="px-10 py-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-right">XP Accrued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {leaders.map((leader) => (
                <tr key={leader.rank} className="group hover:bg-muted/10 transition-colors cursor-pointer">
                  <td className="px-10 py-8">
                     <span className={cn(
                        "text-2xl font-black tabular-nums tracking-tighter",
                        leader.rank <= 3 ? "text-primary" : "text-muted-foreground"
                     )}>#{leader.rank}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-12 h-12 border-2 border-border/50 group-hover:border-primary/50 transition-colors shadow-lg">
                         <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.name}`} />
                         <AvatarFallback>{leader.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                         <h4 className="font-black text-lg text-foreground group-hover:text-primary transition-colors leading-none">{leader.name}</h4>
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Stream: Discrete Math</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                     <Badge variant="secondary" className="font-black uppercase text-[10px] tracking-widest px-4 h-8 bg-muted/50 border-none group-hover:bg-primary/10 group-hover:text-primary transition-all">Level {leader.level}</Badge>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <div className="flex items-center justify-end gap-3">
                        <span className="font-black text-xl tabular-nums tracking-tighter text-foreground">{leader.xp.toLocaleString()}</span>
                        <ArrowUpRight size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const Trophy = ({ size, className }: { size: number, className?: string }) => <Medal size={size} className={className} />;

