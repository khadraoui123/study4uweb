import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Award, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Waves, 
  Music,
  Target,
  ShieldCheck,
  Eye,
  Activity,
  Wind
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer
} from 'recharts';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const FocusRoom: React.FC = () => {
  const { 
    pomodoroTime, 
    isTimerRunning, 
    setTimerState, 
    tickTimer, 
    resetTimer,
    startFocusSession,
    addFocusTime,
    xp,
    addXP,
    activeFocusSession,
    ambientSound,
    setAmbientSound
  } = useStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stabilityData, setStabilityData] = useState<{ time: number, stability: number }[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTimerRunning && pomodoroTime > 0) {
      timerRef.current = window.setInterval(() => {
        tickTimer();
        // Generate pseudo-random stability data for the immersive chart
        setStabilityData(prev => [
          ...prev.slice(-19), 
          { time: Date.now(), stability: 70 + Math.random() * 30 }
        ]);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pomodoroTime === 0 && isTimerRunning) {
        addFocusTime(25);
        addXP(500);
        setTimerState(false);
        alert("Deep Focus Session Complete! +500 XP Gained.");
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, tickTimer, pomodoroTime, addFocusTime, addXP, setTimerState]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - pomodoroTime) / (25 * 60)) * 100;

  const handleSoundToggle = (sound: any) => {
     if (ambientSound === sound) {
        setAmbientSound('none');
     } else {
        setAmbientSound(sound);
        if (isMuted) setIsMuted(false);
     }
  };

  return (
    <div className={cn(
      "h-[calc(100vh-140px)] relative overflow-hidden flex flex-col items-center justify-center p-8 transition-all duration-1000 rounded-[48px] border border-border/50 bg-[#020205] shadow-2xl",
      isFullscreen && "fixed inset-0 z-[300] h-screen rounded-none border-none"
    )}>
      {/* Immersive Neural Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: isTimerRunning ? [1, 1.2, 1] : 1,
            rotate: [0, 90, 180, 270, 360],
            opacity: isTimerRunning ? 0.3 : 0.1
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-gradient-to-br from-primary/20 via-transparent to-violet-500/20 rounded-full blur-[180px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="z-10 w-full max-w-6xl flex flex-col items-center gap-16">
        <header className="text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-8 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[11px] uppercase tracking-[0.5em] shadow-xl shadow-primary/5"
          >
            <Sparkles size={16} className="fill-current animate-pulse" />
            <span>Neural Chamber Node 01</span>
          </motion.div>
          <motion.h1 
            animate={{ letterSpacing: isTimerRunning ? '0.15em' : '0.05em' }}
            className="text-8xl font-black tracking-tighter heading-os text-foreground transition-all duration-1000"
          >
            {isTimerRunning ? 'DEEP_STASIS' : 'NEURAL_VOID'}
          </motion.h1>
        </header>

        <div className="flex flex-col lg:flex-row items-center gap-24 w-full">
          {/* Stability Matrix Left */}
          <div className={cn(
            "hidden lg:flex flex-col gap-10 w-64 transition-all duration-1000",
            isFullscreen && "opacity-0 translate-x-[-50px] pointer-events-none"
          )}>
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Stability Index</p>
                   <span className="text-sm font-black text-emerald-500">Peak</span>
                </div>
                <div className="h-[120px] w-full bg-muted/10 rounded-2xl border border-border/50 p-4">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stabilityData}>
                         <Area 
                            type="monotone" 
                            dataKey="stability" 
                            stroke="var(--primary)" 
                            strokeWidth={3} 
                            fill="var(--primary)" 
                            fillOpacity={0.1} 
                            isAnimationActive={false}
                         />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
             
             <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                   <Activity size={14} className="text-primary" /> Metrics
                </p>
                <div className="grid grid-cols-1 gap-4">
                   <div className="p-4 rounded-2xl bg-card/30 border border-border/50 space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase">Today's Focus</p>
                      <p className="text-2xl font-black text-foreground">2.4<span className="text-xs text-muted-foreground ml-1">h</span></p>
                   </div>
                   <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase">Neural XP</p>
                      <p className="text-2xl font-black text-primary tabular-nums">{xp}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Central Neural Timer */}
          <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center group">
            {/* Multiple Glowing Rings */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="50%" cy="50%" r="48%" 
                fill="none" 
                stroke="rgba(255,255,255,0.02)" 
                strokeWidth="2" 
              />
              <motion.circle 
                cx="50%" cy="50%" r="48%" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="12" 
                strokeDasharray="100 100"
                style={{ pathLength: progress / 100 }}
                transition={{ duration: 1, ease: "circOut" }}
                strokeLinecap="round"
                className="drop-shadow-[0_0_20px_rgba(var(--primary),0.6)]"
              />
              <motion.circle 
                cx="50%" cy="50%" r="44%" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2" 
                strokeDasharray="4 8"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="opacity-30"
              />
            </svg>

            <div className="text-center space-y-6 z-20">
              <motion.div 
                animate={{ 
                  scale: isTimerRunning ? [1, 1.02, 1] : 1,
                  textShadow: isTimerRunning ? ["0 0 20px rgba(255,255,255,0.1)", "0 0 40px rgba(var(--primary),0.3)", "0 0 20px rgba(255,255,255,0.1)"] : "none"
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                 <span className="block text-9xl md:text-[11rem] font-black text-foreground tracking-tighter tabular-nums leading-none">
                   {formatTime(pomodoroTime)}
                 </span>
              </motion.div>
              <div className="flex flex-col items-center gap-4">
                 <Badge variant="outline" className="text-[11px] font-black uppercase tracking-[0.5em] border-primary/20 text-primary px-6 py-1.5 rounded-full bg-primary/5">Deep Work Protocol</Badge>
                 <div className="flex gap-2 h-6 items-end">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <motion.div 
                        key={i} 
                        animate={{ 
                          height: isTimerRunning ? [6, 24, 6] : 6,
                          opacity: isTimerRunning ? [0.2, 1, 0.2] : 0.2
                        }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
                        className="w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" 
                      />
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Immersive Controls Right */}
          <div className={cn(
            "flex lg:flex-col gap-6 transition-all duration-1000",
            isFullscreen && "opacity-0 translate-x-[50px] pointer-events-none"
          )}>
             <TooltipProvider>
                <Tooltip>
                   <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-16 h-16 rounded-[24px] border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-xl"
                        onClick={toggleFullscreen}
                      >
                         {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent>Immersive Mode</TooltipContent>
                </Tooltip>
                <Tooltip>
                   <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-16 h-16 rounded-[24px] border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-xl"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                         {isMuted || ambientSound === 'none' ? <VolumeX size={24} className="text-destructive" /> : <Volume2 size={24} className="text-primary" />}
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent>{isMuted ? 'Unmute' : 'Mute Soundscape'}</TooltipContent>
                </Tooltip>
                <Tooltip>
                   <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-16 h-16 rounded-[24px] border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-xl"
                        onClick={() => setShowStats(!showStats)}
                      >
                         <ShieldCheck size={24} />
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent>Neural Integrity</TooltipContent>
                </Tooltip>
             </TooltipProvider>
          </div>
        </div>

        <div className="flex gap-8 z-20">
          <Button 
            size="lg"
            onClick={activeFocusSession ? () => setTimerState(!isTimerRunning) : startFocusSession}
            className={cn(
              "h-20 px-16 rounded-[32px] text-xl font-black uppercase tracking-[0.3em] gap-6 transition-all duration-700 shadow-2xl",
              isTimerRunning ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/30" : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/30"
            )}
          >
            {isTimerRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
            {isTimerRunning ? 'Suspend Neural Session' : 'Initiate Deep Focus'}
          </Button>
          
          <Button 
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="w-20 h-20 rounded-[32px] border-border/50 bg-background/50 group hover:border-primary/30 transition-all shadow-xl"
          >
            <RotateCcw size={32} className="group-hover:rotate-[-180deg] transition-transform duration-700" />
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 z-20">
          {[
            { id: 'lofi', icon: <Music size={18} />, label: 'Neural Lofi' },
            { id: 'rain', icon: <Waves size={18} />, label: 'Deep Rain' },
            { id: 'wind', icon: <Wind size={18} />, label: 'Atmospheric' },
            { id: 'zen', icon: <Target size={18} />, label: 'Zen Void' }
          ].map((tool) => (
            <Button 
              key={tool.id} 
              variant={ambientSound === tool.id ? "secondary" : "outline"}
              onClick={() => handleSoundToggle(tool.id)}
              className={cn(
                "h-14 px-8 rounded-2xl border-border/50 uppercase font-black text-[11px] tracking-[0.2em] gap-4 transition-all duration-500",
                ambientSound === tool.id ? "bg-primary/20 text-primary border-primary/40 shadow-2xl shadow-primary/10 scale-105" : "hover:bg-primary/5 hover:border-primary/20"
              )}
            >
              {tool.icon}
              {tool.label}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isTimerRunning && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-12 z-20 flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-3 bg-background/40 backdrop-blur-md px-6 py-2 rounded-full border border-border/50 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
               <Eye size={14} className="text-primary animate-pulse" /> AI SENTINEL ACTIVE: MONITORING DISTRACTIONS
            </div>
            <Card className="bg-primary/10 backdrop-blur-xl border-primary/30 rounded-3xl shadow-[0_0_50px_rgba(var(--primary),0.1)]">
               <CardContent className="px-10 py-5 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                     <Award size={28} className="animate-bounce" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-lg font-black text-foreground leading-tight tracking-tight">Peak Neural Stability</p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Maintaining top-tier cognitive flow</p>
                  </div>
               </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


