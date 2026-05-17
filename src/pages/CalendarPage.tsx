import React from 'react';
import { Clock } from 'lucide-react';
import { Card } from '../components/ui/card';

export const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black heading-os tracking-tight">NEURAL CALENDAR</h1>
          <p className="text-muted-foreground mt-2">Sync your academic timeline with reality.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass-panel px-6 py-3 font-bold hover:bg-white/5 transition-colors rounded-xl border border-white/10">Month</button>
          <button className="glass-panel px-6 py-3 font-bold bg-primary text-primary-foreground rounded-xl">Week</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="p-6 glass-panel border-white/10 min-h-[600px] relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
             <div className="grid grid-cols-7 border-b border-white/10 pb-4 mb-4">
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                 <div key={day} className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest">{day}</div>
               ))}
             </div>
             <div className="grid grid-cols-7 grid-rows-5 gap-2 h-full">
               {Array.from({ length: 35 }).map((_, i) => (
                 <div key={i} className="aspect-square glass-panel border-white/5 p-2 hover:border-primary/50 transition-colors cursor-pointer group">
                   <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">{i + 1}</span>
                 </div>
               ))}
             </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6 glass-panel border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                  <p className="font-bold text-sm">Design Workshop</p>
                  <p className="text-xs text-muted-foreground mt-1">Tomorrow, 10:00 AM</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
