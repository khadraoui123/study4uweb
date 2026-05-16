import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

import { useStore } from '../store';

export const LeaderboardPage: React.FC = () => {
  const { leaderboard } = useStore();
  const leaders = leaderboard;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black heading-os tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
          GLOBAL RANKINGS
        </h1>
        <p className="text-muted-foreground text-lg">The elite minds of the StudyMate ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        {/* Top 3 Podiums */}
        <div className="order-2 md:order-1 pt-12">
           <Card className="glass-card border-white/10 p-8 text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-slate-400" />
             <Medal size={48} className="mx-auto text-slate-400 mb-4" />
             <Avatar className="w-20 h-20 mx-auto border-4 border-slate-400/20 mb-4">
               <AvatarFallback>{leaders[1]?.avatar}</AvatarFallback>
             </Avatar>
             <h3 className="font-bold text-xl">{leaders[1]?.name}</h3>
             <p className="text-primary font-black uppercase tracking-widest text-sm mt-1">2nd Place</p>
             <div className="mt-4 pt-4 border-t border-white/5 font-black text-2xl">{leaders[1]?.xp.toLocaleString()} XP</div>
           </Card>
        </div>
        <div className="order-1 md:order-2">
           <Card className="glass-card border-primary/50 p-8 text-center relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.2)]">
             <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
             <Crown size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
             <Avatar className="w-24 h-24 mx-auto border-4 border-primary mb-4">
               <AvatarFallback>{leaders[0]?.avatar}</AvatarFallback>
             </Avatar>
             <h3 className="font-bold text-2xl">{leaders[0]?.name}</h3>
             <p className="text-primary font-black uppercase tracking-widest text-sm mt-1">Global Champion</p>
             <div className="mt-4 pt-4 border-t border-white/5 font-black text-3xl">{leaders[0]?.xp.toLocaleString()} XP</div>
           </Card>
        </div>
        <div className="order-3 md:order-3 pt-20">
           <Card className="glass-card border-white/10 p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-amber-700" />
             <Star size={40} className="mx-auto text-amber-600 mb-4" />
             <Avatar className="w-16 h-16 mx-auto border-4 border-amber-600/20 mb-4">
               <AvatarFallback>{leaders[2]?.avatar}</AvatarFallback>
             </Avatar>
             <h3 className="font-bold text-lg">{leaders[2]?.name}</h3>
             <p className="text-primary font-black uppercase tracking-widest text-sm mt-1">3rd Place</p>
             <div className="mt-4 pt-4 border-t border-white/5 font-black text-xl">{leaders[2]?.xp.toLocaleString()} XP</div>
           </Card>
        </div>
      </div>

      <Card className="glass-card border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-8 py-4 font-black uppercase tracking-widest text-xs text-muted-foreground">Rank</th>
              <th className="px-8 py-4 font-black uppercase tracking-widest text-xs text-muted-foreground">Scholar</th>
              <th className="px-8 py-4 font-black uppercase tracking-widest text-xs text-muted-foreground text-center">Level</th>
              <th className="px-8 py-4 font-black uppercase tracking-widest text-xs text-muted-foreground text-right">XP Total</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader) => (
              <tr key={leader.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6 font-black text-xl text-muted-foreground group-hover:text-foreground">#{leader.rank}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{leader.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="font-bold">{leader.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center font-bold text-primary">{leader.level}</td>
                <td className="px-8 py-6 text-right font-black tracking-tighter">{leader.xp.toLocaleString()} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
