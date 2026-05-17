import React from 'react';
import { Award, BookOpen, Clock, Edit2, Share2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Profile Card */}
      <Card className="glass-panel border-white/10 p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/30 to-cyan-500/30 blur-2xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
          <div className="relative">
             <Avatar className="w-32 h-32 border-4 border-primary shadow-2xl">
               <AvatarImage src="https://github.com/shadcn.png" />
               <AvatarFallback>JD</AvatarFallback>
             </Avatar>
             <button className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform">
               <Edit2 size={16} />
             </button>
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black heading-os tracking-tight">John Doe</h1>
            <p className="text-muted-foreground font-medium">B.S. Computer Engineering • Senior Scholar</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">Level 42</div>
              <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest">Master of Focus</div>
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-xs font-black uppercase tracking-widest">Rank #124 Global</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-primary hover:scale-105 transition-transform font-bold gap-2">
              <Share2 size={18} />
              Share Portfolio
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 glass-panel border-white/10 p-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Award size={20} className="text-primary" />
              Academic Progress
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2 uppercase tracking-widest">
                  <span>Major Completion</span>
                  <span className="text-primary">85%</span>
                </div>
                <Progress value={85} className="h-2 bg-white/5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Cumulative GPA</p>
                   <p className="text-2xl font-black mt-1">3.92</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Credits</p>
                   <p className="text-2xl font-black mt-1">112 / 128</p>
                 </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-cyan-400" />
              Current Semester
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="p-4 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer bg-white/5">
                   <p className="font-bold">Advanced Circuit Design</p>
                   <p className="text-xs text-muted-foreground">EEE 401 • Grade: A</p>
                 </div>
               ))}
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="glass-panel border-white/10 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Study Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-muted-foreground uppercase">Focus Time</span>
                <span className="font-black">1,240 hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-muted-foreground uppercase">Tasks Completed</span>
                <span className="font-black">412</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-muted-foreground uppercase">Streak</span>
                <span className="font-black text-primary">12 Days</span>
              </div>
            </div>
          </Card>

          <Card className="glass-panel border-primary/20 bg-primary/5 p-8 text-center">
             <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Next Milestone</p>
             <h4 className="font-bold text-lg">Scholar Grade 43</h4>
             <div className="mt-4">
                <Progress value={65} className="h-2 bg-primary/10" />
                <p className="text-xs text-muted-foreground mt-2 font-bold">1,250 XP remaining</p>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
