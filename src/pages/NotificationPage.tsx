import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Info, AlertTriangle, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

import { useStore } from '../store';

export const NotificationPage: React.FC = () => {
  const { notifications, markAllRead, clearNotification } = useStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'zap': return Zap;
      case 'info': return Info;
      case 'alert': return AlertTriangle;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black heading-os tracking-tight">NOTIFICATIONS</h1>
          <p className="text-muted-foreground mt-2">Neural updates and system alerts.</p>
        </div>
        <Button 
          variant="ghost" 
          className="text-primary font-bold gap-2"
          onClick={markAllRead}
        >
          <Check size={18} />
          Mark all read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <Bell size={64} className="mx-auto mb-4" />
            <p className="font-black uppercase tracking-widest text-sm">Neural queue is empty</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const Icon = getIcon(n.iconType);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card border-white/10 p-6 hover:bg-white/5 transition-all group relative overflow-hidden">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${n.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold">{n.title}</h3>
                        <span className="text-xs text-muted-foreground font-medium">{n.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 pr-12">{n.message}</p>
                      <div className="mt-4 flex gap-3">
                        <Button size="sm" variant="outline" className="h-8 px-4 text-xs font-bold border-white/10">View Details</Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-4 text-xs font-bold text-muted-foreground hover:text-red-500"
                          onClick={() => clearNotification(n.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
