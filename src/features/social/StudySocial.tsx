import React from 'react';
// No store import needed here if not used
import { Users, Trophy, Zap, MessageSquare, ChevronRight, Crown, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const leaderboard = [
  { rank: 1, name: 'Samiul H.', score: 12450, streak: 14, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sami' },
  { rank: 2, name: 'Tareq Ahmed', score: 9840, streak: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tareq' },
  { rank: 3, name: 'Farhan Z.', score: 8200, streak: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan' },
];

export const StudySocial: React.FC = () => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="space-y-4">
          <Badge variant="secondary" className="px-4 py-1 rounded-full bg-primary/10 text-primary border-primary/20 gap-2">
            <Users size={14} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Neural Social Node</span>
          </Badge>
          <h1 className="text-5xl font-black heading-os tracking-tight text-foreground">Neural Network</h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
            Collaborative intelligence & competitive <span className="text-foreground font-black">academic growth protocol</span>.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-10">
           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                 <div className="space-y-1">
                    <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                       <Trophy className="text-amber-500" size={24} />
                       Regional Network
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Top scholars in your proximity</CardDescription>
                 </div>
                 <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest gap-2">
                    View Global <ChevronRight size={14} />
                 </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 {leaderboard.map((user) => (
                   <Card key={user.rank} className={cn(
                     "group hover:border-primary/30 transition-all border-border/30",
                     user.name === 'Tareq Ahmed' && "bg-primary/5 border-primary/20"
                   )}>
                      <CardContent className="p-6 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <span className="text-xl font-black text-muted-foreground w-8 group-hover:text-primary transition-colors">#{user.rank}</span>
                            <div className="relative">
                               <Avatar className="w-14 h-14 border-2 border-border/50">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                               </Avatar>
                               {user.rank === 1 && (
                                 <div className="absolute -top-1.5 -right-1.5 text-amber-500 bg-background rounded-full p-0.5">
                                    <Crown size={14} fill="currentColor" />
                                 </div>
                               )}
                            </div>
                            <div>
                               <p className="text-lg font-bold text-foreground leading-none">{user.name}</p>
                               <div className="flex items-center gap-4 mt-2">
                                  <Badge variant="outline" className="text-amber-600 border-amber-500/20 bg-amber-500/5 text-[8px] font-black gap-1">
                                     <Flame size={10} fill="currentColor" /> {user.streak} DAY STREAK
                                  </Badge>
                                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{user.score} XP TOTAL</span>
                               </div>
                            </div>
                         </div>
                         <Button variant="ghost" className="text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-widest gap-2">
                            View Node <ChevronRight size={12} />
                         </Button>
                      </CardContent>
                   </Card>
                 ))}
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-emerald-500/20 bg-emerald-500/5 group hover:bg-emerald-500/10 cursor-pointer transition-all">
                 <CardContent className="p-8 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                       <Users size={24} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-foreground">Join Study Room</h3>
                       <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                          4 Active focus sessions in <span className="text-emerald-600 font-bold underline decoration-emerald-500/30 underline-offset-4">Computer Science</span>. Join peers for deep work.
                       </p>
                    </div>
                 </CardContent>
              </Card>
              <Card className="border-primary/20 bg-primary/5 group hover:bg-primary/10 cursor-pointer transition-all">
                 <CardContent className="p-8 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                       <Zap size={24} fill="currentColor" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-black text-foreground">Active Challenges</h3>
                       <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                          Accept a productivity duel. Out-focus your peers for a <span className="text-primary font-bold">2x XP multiplier</span> tonight.
                       </p>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
              <CardHeader>
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-3">
                    <MessageSquare size={18} />
                    Encrypted Feed
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                 {[
                   { user: 'Samiul', msg: 'Just hit Level 12! Focus chamber works.', time: '2m ago' },
                   { user: 'Farhan', msg: 'Neural analytics is predictive today.', time: '14m ago' },
                   { user: 'Anika', msg: 'Started a study room for Physics.', time: '1h ago' },
                   { user: 'Zayan', msg: 'Exam Mode simulation is intense.', time: '2h ago' }
                 ].map((feed, i) => (
                   <div key={i} className="relative pl-6 space-y-1">
                      <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black text-foreground">{feed.user}</span>
                         <span className="text-[9px] font-bold text-muted-foreground uppercase">{feed.time}</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">"{feed.msg}"</p>
                   </div>
                 ))}
                 <Button className="w-full h-11 font-black uppercase text-[10px] tracking-widest mt-4">
                    Neural Broadcast
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};


