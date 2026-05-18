import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Command, 
  Menu,
  Flame,
  Zap,
  Activity,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  onMenuClick: () => void;
}

import { useNavigate } from 'react-router-dom';

export const Header: React.FC<HeaderProps> = React.memo(({ onMenuClick }) => {
  const level = useStore(state => state.level);
  const streak = useStore(state => state.streak);
  const user = useStore(state => state.user);
  
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <TooltipProvider>
      <header 
        className="h-[80px] border-b border-border/50 bg-[#020205]/80 backdrop-blur-xl fixed top-0 z-[90] transition-all duration-500 flex items-center justify-between px-10 shadow-2xl" 
        style={{ 
          left: isRTL ? '0' : 'var(--sidebar-width)',
          right: isRTL ? 'var(--sidebar-width)' : '0'
        }}
      >
        <div className="flex items-center gap-10 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group" 
            onClick={onMenuClick}
          >
            <Menu size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </Button>
          
          <div className="relative max-w-xl w-full hidden lg:block group">
            <div className="absolute inset-0 bg-primary/5 rounded-[20px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-muted/20 border border-border/50 rounded-[20px] h-14 px-6 gap-4 hover:border-primary/30 transition-all focus-within:border-primary/50 focus-within:bg-background">
               <Search className="text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
               <input 
                 className="flex-1 bg-transparent border-none text-sm font-semibold placeholder:text-muted-foreground focus:outline-none" 
                 placeholder="Search OS intelligence... (⌘K)" 
               />
               <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border/50 bg-background/50 text-[10px] font-black text-muted-foreground pointer-events-none shadow-sm">
                 <Command size={12} />
                 <span>K</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Status Metrics */}
          <div className="hidden sm:flex items-center gap-8 px-10 border-x border-border/30 h-10">
             <LanguageSwitcher />
             <Tooltip>
                <TooltipTrigger asChild>
                   <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/achievements')}>
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
                         <Flame size={20} fill="currentColor" />
                      </div>
                      <div className="hidden md:block">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-1">Streak</p>
                         <p className="text-sm font-black text-foreground leading-none tabular-nums tracking-tighter">{streak} DAYS</p>
                      </div>
                   </div>
                </TooltipTrigger>
                <TooltipContent>Operational Streak</TooltipContent>
             </Tooltip>

             <Tooltip>
                <TooltipTrigger asChild>
                   <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/leaderboards')}>
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-lg shadow-primary/5">
                         <Zap size={20} fill="currentColor" />
                      </div>
                      <div className="hidden md:block">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-1">Grade</p>
                         <p className="text-sm font-black text-foreground leading-none tracking-tighter">LVL {level}</p>
                      </div>
                   </div>
                </TooltipTrigger>
                <TooltipContent>Neural Grade</TooltipContent>
             </Tooltip>
          </div>

          <div className="flex items-center gap-4">
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-12 h-12 rounded-2xl relative text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={() => navigate('/notifications')}
                  >
                    <Bell size={22} />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive border-4 border-[#020205] rounded-full" />
                  </Button>
               </TooltipTrigger>
               <TooltipContent>Intelligence Alerts</TooltipContent>
            </Tooltip>

            <Tooltip>
               <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-12 h-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={() => navigate('/analytics')}
                  >
                    <Activity size={22} />
                  </Button>
               </TooltipTrigger>
               <TooltipContent>System Vitals</TooltipContent>
            </Tooltip>
            
            <div 
              className="flex items-center gap-4 pl-6 border-l border-border/30 ml-2 group cursor-pointer"
              onClick={() => navigate('/profile')}
            >
               <div className="text-right hidden xl:block">
                   <p className="text-sm font-black text-foreground uppercase tracking-tighter leading-none mb-1 group-hover:text-primary transition-colors">{user?.name || 'User'}</p>
                  <div className="flex items-center justify-end gap-1.5">
                     <ShieldCheck size={12} className="text-emerald-500" />
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">Authorized</p>
                  </div>
               </div>
               <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-primary/30 group-hover:border-primary transition-all duration-500 shadow-xl">
                     <AvatarImage src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Tareq"} />
                     <AvatarFallback>{user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}</AvatarFallback>
                  </Avatar>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 border border-primary rounded-full pointer-events-none" 
                  />
               </div>
               <ChevronDown size={16} className="text-muted-foreground group-hover:text-primary transition-all group-hover:translate-y-0.5" />
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
});
