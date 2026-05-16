import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Layers, 
  ChevronRight, 
  MessageCircleCode, 
  Timer, 
  Zap, 
  Trophy, 
  Users, 
  PieChart,
  Settings,
  Sparkles,
  Command,
  Search,
  FileText,
  BarChart2
} from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: t('common.dashboard') },
    { path: '/planner', icon: <CalendarIcon size={20} />, label: t('common.planner') },
    { path: '/calendar', icon: <CalendarIcon size={20} />, label: t('common.calendar') },
    { path: '/courses', icon: <Layers size={20} />, label: t('common.courses') },
    { path: '/tasks', icon: <ChevronRight size={20} />, label: t('common.tasks') },
    { path: '/tutor', icon: <MessageCircleCode size={20} />, label: t('common.tutor') },
    { path: '/focus', icon: <Timer size={20} />, label: t('common.focus') },
    { path: '/notes', icon: <FileText size={20} />, label: t('common.notes') },
    { path: '/exams', icon: <Zap size={20} />, label: t('common.exams') },
    { path: '/achievements', icon: <Trophy size={20} />, label: t('common.achievements') },
    { path: '/leaderboards', icon: <BarChart2 size={20} />, label: t('common.leaderboards') },
    { path: '/social', icon: <Users size={20} />, label: t('common.social') },
    { path: '/analytics', icon: <PieChart size={20} />, label: t('common.analytics') },
  ];

  return (
    <TooltipProvider>
      <aside 
        className={cn(
          "h-screen fixed top-0 z-[100] bg-[#020205] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col shadow-2xl",
          isRTL ? "right-0 border-l" : "left-0 border-r",
          isCollapsed ? "w-[90px]" : "w-[300px]"
        )}
      >
        {/* Logo Area */}
        <div className="p-8 flex items-center gap-5">
          <NavLink to="/dashboard" className="flex items-center gap-5 group">
            <div className="relative shrink-0">
               <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-transform duration-500 group-hover:rotate-12">
                 <Sparkles size={24} className="fill-current" />
               </div>
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-[-4px] border border-primary/40 rounded-2xl" 
               />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="font-black text-2xl heading-os tracking-tighter text-foreground leading-none">StudyMate</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">Neural OS</span>
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        </div>

        {/* Command Search Hint */}
        {!isCollapsed && (
          <div className="px-6 mb-4">
             <div className="flex items-center gap-3 px-4 h-11 bg-muted/20 border border-border/50 rounded-xl text-muted-foreground hover:bg-muted/30 transition-all cursor-pointer group">
                <Search size={16} />
                <span className="text-[11px] font-bold">Neural Query...</span>
                <div className="ml-auto flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                   <Command size={10} /> <span className="text-[10px]">K</span>
                </div>
             </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-4 h-12 rounded-2xl transition-all duration-300 relative group px-3",
                      isActive 
                        ? "bg-primary/10 text-primary shadow-inner" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/10",
                      isCollapsed && "px-0 justify-center"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl shrink-0 transition-all duration-500",
                      isActive ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.4)] text-white scale-110" : "text-muted-foreground group-hover:scale-110"
                    )}>
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                       <span className={cn(
                         "text-sm font-black uppercase tracking-widest truncate",
                         isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                       )}>
                         {item.label}
                       </span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="ml-auto w-1 h-5 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" 
                      />
                    )}
                    {item.path === '/tutor' && !isCollapsed && (
                       <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    )}
                  </NavLink>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right" className="font-black uppercase text-[10px] tracking-widest">{item.label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Profile Area */}
        <div className="p-6 mt-auto border-t border-border/50 bg-muted/5">
          {!isCollapsed ? (
            <div className="space-y-6">
               <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Neural Sync</span>
                     <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase">Stable</span>
                     </div>
                  </div>
                  <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden shadow-inner">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '88%' }} 
                       className="h-full bg-primary shadow-[0_0_8px_var(--primary)]" 
                     />
                  </div>
               </div>
               
               <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-muted/20 transition-colors cursor-pointer group">
                  <div className="relative">
                     <Avatar className="w-12 h-12 border-2 border-primary/30 group-hover:border-primary transition-colors">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                        <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
                     </Avatar>
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-4 border-[#020205] flex items-center justify-center text-[8px] font-black text-white">12</div>
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="font-black text-sm text-foreground truncate uppercase tracking-tighter">Scholarly Node</span>
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">Authorized Admin</span>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground">
                     <Settings size={18} />
                  </Button>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="relative cursor-pointer group">
                        <Avatar className="w-12 h-12 border-2 border-primary/30 group-hover:border-primary transition-all">
                           <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-4 border-[#020205]" />
                     </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">Profile Settings</TooltipContent>
               </Tooltip>
               <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl text-muted-foreground">
                  <Settings size={20} />
               </Button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
