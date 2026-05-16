import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  Mic, 
  History, 
  Command, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  Target,
  Rocket
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const AIChat: React.FC = () => {
  const { chatHistory, sendMessage, addAssistantMessage, aiMemory, tasks, courses, exams } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  const generateAIResponse = (userInput: string) => {
    const unfinishedTasks = tasks.filter(t => !t.completed);
    const weakSub = aiMemory.weakSubjects[0];
    const upcomingExam = exams[0];
    
    let response = "";
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('task') || lowerInput.includes('do next')) {
      response = `Analyzing your queue. You have ${unfinishedTasks.length} pending items. I recommend starting with "${unfinishedTasks[0]?.title}" as it aligns with your peak focus window. Shall I initiate a 25-minute Pomodoro?`;
    } else if (lowerInput.includes('exam') || lowerInput.includes('test')) {
      const examCourse = courses.find(c => c.id === upcomingExam?.courseId);
      response = upcomingExam 
        ? `You have "${upcomingExam.title}" coming up on ${new Date(upcomingExam.date).toLocaleDateString()}. Based on your ${examCourse?.percentage}% retention in ${examCourse?.name}, we should focus on the latest lab results.`
        : "You don't have any upcoming exams scheduled. A perfect time to get ahead on your courses!";
    } else if (lowerInput.includes('quiz')) {
      response = `Generating a custom quiz for ${weakSub}... \n\n1. Explain the difference between a Set and a Multiset.\n2. What is the Power Set of {a, b}?\n\nType your answers and I will grade them instantly.`;
    } else if (lowerInput.includes('summarize')) {
      const completedCount = tasks.filter(t => t.completed).length;
      response = `Week Summary: You've completed ${completedCount} tasks. Your proficiency in Circuit Design is trending up, but ${weakSub} needs a 20% boost before the midterm.`;
    } else if (lowerInput.includes('study') || lowerInput.includes('help')) {
      response = `Neural logs indicate a slight dip in ${weakSub} comprehension. I've prepared a personalized revision path. We'll start with core axioms and move to proof by induction. Ready?`;
    } else {
      response = "Neural Core synchronized. I'm monitoring your academic trajectory in real-time. You're currently at optimal efficiency. How can I assist your progress?";
    }
    
    setTimeout(() => {
      addAssistantMessage(response);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSend = (text?: string) => {
    const messageContent = text || input;
    if (!messageContent.trim()) return;
    
    sendMessage(messageContent);
    if (!text) setInput('');
    setIsTyping(true);
    generateAIResponse(messageContent);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-12 gap-8 h-[calc(100vh-140px)] max-w-7xl mx-auto">
        {/* Left: Memory Vault & Context */}
        <div className="col-span-12 lg:col-span-3 space-y-6 hidden lg:block">
           <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
              <CardHeader className="pb-4">
                 <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2">
                    <Activity size={14} className="text-primary" />
                    Cognitive Memory
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Priority Focus Areas</p>
                    <div className="flex flex-wrap gap-2">
                       {aiMemory.weakSubjects.map(sub => (
                         <Badge key={sub} variant="outline" className="text-[9px] font-black border-primary/20 bg-primary/5 text-primary">
                            {sub}
                         </Badge>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Neural Fatigue</span>
                       <span className="text-xs font-black text-foreground">{aiMemory.burnoutRisk}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${aiMemory.burnoutRisk}%` }}
                         className={cn(
                           "h-full transition-all duration-1000",
                           aiMemory.burnoutRisk > 70 ? "bg-destructive" : "bg-primary"
                         )}
                       />
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-border/50 bg-primary/5 group hover:border-primary/30 transition-all cursor-default overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Rocket size={80} className="text-primary" />
              </div>
              <CardContent className="p-8 space-y-4 relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Next Milestone</h4>
                 <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    You're 1,240 XP away from reaching <span className="text-primary font-bold">Grade 6 Scholar</span>.
                 </p>
                 <Button variant="outline" size="sm" className="w-full text-[9px] font-black uppercase tracking-widest h-8 rounded-lg">View Tree</Button>
              </CardContent>
           </Card>

           <div className="p-6 border-l-2 border-primary/20 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <History size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Neural Sessions</span>
              </div>
              <div className="space-y-3">
                 {['Circuit Logic (45m)', 'Linear Algebra (1h)', 'Discrete Rev (30m)'].map((session, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{session}</span>
                      <ChevronRight size={12} className="text-muted-foreground/30 group-hover:text-primary" />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Center: Neural Command Interface */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 h-full relative">
          
          {/* AI Thinking Animation Overlay (Top) */}
          <div className="absolute top-0 left-0 w-full h-1 z-20 pointer-events-none overflow-hidden">
             <AnimatePresence>
                {isTyping && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                )}
             </AnimatePresence>
          </div>

          <Card className="flex-1 flex flex-col overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl relative">
            <CardHeader className="border-b border-border/50 bg-muted/20 py-4 px-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <Bot size={28} />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-[-4px] border border-primary/40 rounded-2xl" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                       <CardTitle className="text-xl font-black heading-os tracking-tight">Neural Command Interface</CardTitle>
                       <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary">v2.0-Alpha</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                         <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cognitive Link: Peak</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Memory Sync: Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Tooltip>
                      <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-muted-foreground">
                            <History size={18} />
                         </Button>
                      </TooltipTrigger>
                      <TooltipContent>Command Logs</TooltipContent>
                   </Tooltip>
                   <Tooltip>
                      <TooltipTrigger asChild>
                         <Button variant="outline" className="h-10 px-4 gap-2 rounded-xl border-border/50 bg-background/50 font-black text-[10px] uppercase tracking-widest">
                            <Command size={14} />
                            Neural Hub
                         </Button>
                      </TooltipTrigger>
                      <TooltipContent>Global Command Palette (⌘K)</TooltipContent>
                   </Tooltip>
                </div>
              </div>
            </CardHeader>

            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <AnimatePresence initial={false}>
                {chatHistory.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-6 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="shrink-0 flex flex-col items-center gap-2">
                         <Avatar className={cn(
                           "w-12 h-12 border-2 shadow-lg",
                           msg.role === 'user' ? "border-muted" : "border-primary/20 bg-background"
                         )}>
                           <AvatarImage src={msg.role === 'user' ? `https://api.dicebear.com/7.x/avataaars/svg?seed=user` : undefined} />
                           <AvatarFallback className={msg.role === 'user' ? "bg-muted" : "bg-primary text-primary-foreground"}>
                             {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                           </AvatarFallback>
                         </Avatar>
                      </div>
                      <div className="space-y-2">
                         <div className={cn(
                           "p-8 rounded-[32px] text-base font-medium leading-relaxed shadow-xl backdrop-blur-sm",
                           msg.role === 'user' 
                             ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/10" 
                             : "bg-background/80 border border-border/50 text-foreground rounded-tl-none shadow-black/5"
                         )}>
                           <div className="whitespace-pre-wrap">{msg.content}</div>
                           
                           {/* Contextual Action Block - Example: AI suggests a task */}
                           {msg.role === 'assistant' && msg.content.includes('recommend') && (
                             <motion.div 
                               initial={{ opacity: 0, scale: 0.95 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ delay: 0.5 }}
                               className="mt-6 p-5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between group cursor-pointer hover:bg-primary/15 transition-all"
                             >
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                     <Target size={20} />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Recommended Action</p>
                                     <p className="text-sm font-black text-primary tracking-tight">Initiate Focus: {tasks[0]?.title}</p>
                                  </div>
                               </div>
                               <Button size="icon" className="w-10 h-10 rounded-full bg-primary text-white">
                                  <ChevronRight size={18} />
                                </Button>
                             </motion.div>
                           )}
                         </div>
                         <div className={cn("flex items-center gap-3 px-2", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                               {msg.role === 'user' ? 'Authorized Node' : 'Neural Core'}
                            </span>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-6 items-start">
                     <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg animate-pulse">
                        <Sparkles size={24} />
                     </div>
                     <div className="bg-muted/20 border border-border/50 p-6 rounded-[24px] rounded-tl-none flex gap-2 items-center">
                        {[0, 0.2, 0.4].map(d => (
                          <motion.div 
                            key={d} 
                            animate={{ 
                              height: [8, 16, 8],
                              opacity: [0.3, 1, 0.3] 
                            }} 
                            transition={{ repeat: Infinity, duration: 1, delay: d }} 
                            className="w-1.5 rounded-full bg-primary" 
                          />
                        ))}
                        <span className="ml-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Synthesizing Intelligence...</span>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            {/* Neural Command Input Area */}
            <div className="p-8 border-t border-border/50 bg-muted/10 space-y-8">
              <div className="flex flex-wrap gap-3">
                {aiMemory.suggestedActions.map(hint => (
                  <Button 
                    key={hint}
                    variant="outline"
                    className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    onClick={() => handleSend(hint)}
                  >
                    <Zap size={14} className="text-primary fill-current" />
                    {hint}
                  </Button>
                ))}
                <Button variant="ghost" className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground border border-dashed border-border/50">
                   More Commands...
                </Button>
              </div>
              
              <div className="relative group">
                 <div className="absolute inset-0 bg-primary/5 rounded-[24px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                 <div className="relative flex items-center gap-4 bg-background border border-border/50 rounded-[24px] p-2 pl-6 shadow-2xl focus-within:border-primary/40 transition-all">
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                      <Mic size={24} />
                    </Button>
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Neural query core..."
                      className="flex-1 bg-transparent border-none py-4 text-base font-semibold placeholder:text-muted-foreground/60 focus:outline-none"
                    />
                    <Button 
                      onClick={() => handleSend()} 
                      disabled={!input.trim()}
                      className="rounded-[18px] px-8 h-12 font-black uppercase tracking-widest text-[11px] gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20"
                    >
                      <Send size={18} />
                      Execute
                    </Button>
                 </div>
              </div>
              <div className="flex justify-center items-center gap-4 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">
                 <ShieldCheck size={12} /> Privacy Guaranteed • End-to-End Neural Encryption
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};
