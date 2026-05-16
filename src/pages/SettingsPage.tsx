import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Keyboard, Database } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export const SettingsPage: React.FC = () => {
  const sections = [
    { icon: User, label: 'Profile Settings', description: 'Update your personal info and avatar' },
    { icon: Bell, label: 'Notifications', description: 'Configure study reminders and alerts' },
    { icon: Palette, label: 'Appearance', description: 'Customize themes and accent colors' },
    { icon: Shield, label: 'Security', description: 'Manage passwords and neural encryption' },
    { icon: Keyboard, label: 'Shortcuts', description: 'Configure productivity keybinds' },
    { icon: Database, label: 'Data & Privacy', description: 'Export your study history and analytics' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black heading-os tracking-tight">SYSTEM SETTINGS</h1>
          <p className="text-muted-foreground mt-2">Calibrate your neural workspace experience.</p>
        </div>
        <Button 
          variant="destructive" 
          className="font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-xl"
          onClick={() => {
            if(confirm('Are you sure you want to perform a factory reset? All local study logs will be purged.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
        >
          Factory Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card border-white/10 p-6 hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <section.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{section.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card border-white/10 p-8 mt-12">
        <h3 className="text-xl font-bold mb-6">Subscription Status</h3>
        <div className="flex justify-between items-center p-6 rounded-2xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center font-black">P</div>
             <div>
               <p className="font-bold">Neural Pro Plan</p>
               <p className="text-sm text-muted-foreground">Active until Dec 2026</p>
             </div>
          </div>
          <Button 
            variant="outline" 
            className="border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => alert('Neural synchronization terminal initialized. Redirecting to billing...')}
          >
            Manage Plan
          </Button>
        </div>
      </Card>
    </div>
  );
};
