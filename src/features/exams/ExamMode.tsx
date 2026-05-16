import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { 
  ShieldAlert, 
  Brain, 
  RotateCw, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Flag,
  FileText,
  AlertCircle,
  Eye,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const ExamMode: React.FC = () => {
  const { addXP } = useStore();
  const [activeTab, setActiveTab] = useState<'flashcards' | 'mock'>('flashcards');
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [currentMockQuestion, setCurrentMockQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const mockFlashcards = [
    { q: "What is Kirchhoff's Current Law?", a: "The algebraic sum of currents entering a node is zero." },
    { q: "Define Ohm's Law.", a: "V = I * R (Voltage = Current * Resistance)" },
    { q: "What is a Capacitor?", a: "A component that stores electrical energy in an electric field." }
  ];

  const mockQuestions = [
    { 
      q: "Analyze the following truth table and identify the missing logic gate operation for the output Z.",
      options: ['AND Gate', 'NAND Gate', 'NOR Gate', 'XOR Gate'],
      hint: "Look at the case where both inputs are high."
    },
    { 
      q: "Which theorem states that any linear circuit can be replaced by an equivalent voltage source and series resistance?",
      options: ['Norton Theorem', 'Thevenin Theorem', 'Superposition', 'Millman Theorem'],
      hint: "Focus on voltage source equivalence."
    },
    // ... more would be here
  ];

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard(prev => Math.min(mockFlashcards.length - 1, prev + 1));
      addXP(5);
    }, 200);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard(prev => Math.max(0, prev - 1));
    }, 200);
  };

  const toggleFlag = (idx: number) => {
    setFlaggedQuestions(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-8 max-w-7xl mx-auto pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-1 rounded-full bg-destructive/10 text-destructive border-destructive/20 gap-2">
              <ShieldAlert size={14} className="fill-current animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">High Intensity Protocol</span>
            </Badge>
            <h1 className="text-5xl font-black heading-os tracking-tight text-foreground">Exam Protocol</h1>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
              AI is simulating your upcoming <span className="text-destructive font-black border-b-2 border-destructive/30">Digital Logic</span> midterm trajectory.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'flashcards' | 'mock')} className="bg-muted/50 p-1 rounded-xl">
             <TabsList className="bg-transparent border-none">
                <TabsTrigger value="flashcards" className="gap-2 px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-destructive data-[state=active]:text-white transition-all duration-300">
                   <Brain size={14} />
                   Neural Cards
                </TabsTrigger>
                <TabsTrigger value="mock" className="gap-2 px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-destructive data-[state=active]:text-white transition-all duration-300">
                   <Zap size={14} />
                   Mock Simulator
                </TabsTrigger>
             </TabsList>
          </Tabs>
        </header>

        <div className="grid grid-cols-12 gap-10">
           <div className="col-span-12 lg:col-span-8">
              <AnimatePresence mode="wait">
                 {activeTab === 'flashcards' ? (
                   <motion.div 
                     key="flashcards"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-12"
                   >
                      <div className="relative h-[480px] w-full perspective-1000">
                         <motion.div 
                           className="w-full h-full relative preserve-3d cursor-pointer"
                           animate={{ rotateY: isFlipped ? 180 : 0 }}
                           transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                           onClick={() => setIsFlipped(!isFlipped)}
                         >
                            {/* Front */}
                            <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center text-center p-16 gap-10 border-border/50 bg-card/50 backdrop-blur-sm group">
                               <div className="absolute top-8 left-8">
                                  <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase border-primary/20 text-primary">Concept Node</Badge>
                               </div>
                               <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform duration-500">
                                  <Sparkles size={40} />
                               </div>
                               <h2 className="text-3xl font-black text-foreground leading-tight tracking-tight">
                                  {mockFlashcards[currentCard].q}
                               </h2>
                               <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] animate-pulse">Tap to reveal neural answer</span>
                                  <div className="w-12 h-1 bg-primary/20 rounded-full" />
                               </div>
                            </Card>
                            {/* Back */}
                            <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center p-16 gap-10 border-destructive/20 bg-destructive/5 backdrop-blur-sm">
                               <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive">
                                  <CheckCircle2 size={40} />
                                </div>
                               <p className="text-2xl font-bold text-foreground leading-relaxed max-w-md">
                                  {mockFlashcards[currentCard].a}
                               </p>
                               <div className="flex gap-4">
                                  <Button variant="outline" className="h-12 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 uppercase font-black text-[10px] tracking-widest px-10 rounded-xl transition-all">I Knew This</Button>
                                  <Button variant="outline" className="h-12 border-destructive/20 text-destructive hover:bg-destructive/10 uppercase font-black text-[10px] tracking-widest px-10 rounded-xl transition-all">Need Review</Button>
                               </div>
                            </Card>
                         </motion.div>
                      </div>

                      <div className="flex items-center justify-between px-12">
                         <Button 
                           variant="outline"
                           size="icon"
                           onClick={handlePrevCard}
                           disabled={currentCard === 0}
                           className="w-16 h-16 rounded-2xl border-border/50 hover:bg-muted transition-all active:scale-95"
                         >
                            <ChevronLeft size={28} />
                         </Button>
                         <div className="flex flex-col items-center gap-4">
                            <p className="text-3xl font-black text-foreground tabular-nums tracking-tighter">
                               {currentCard + 1} <span className="text-muted-foreground text-sm font-bold">/ {mockFlashcards.length}</span>
                            </p>
                            <div className="flex gap-2">
                               {mockFlashcards.map((_, i) => (
                                 <motion.div 
                                   key={i} 
                                   initial={false}
                                   animate={{ 
                                     width: i === currentCard ? 40 : 10,
                                     backgroundColor: i === currentCard ? 'var(--destructive)' : 'var(--muted)'
                                   }}
                                   className="h-2 rounded-full transition-all" 
                                 />
                               ))}
                            </div>
                         </div>
                         <Button 
                           variant="outline"
                           size="icon"
                           onClick={handleNextCard}
                           disabled={currentCard === mockFlashcards.length - 1}
                           className="w-16 h-16 rounded-2xl border-border/50 hover:bg-muted transition-all active:scale-95"
                         >
                            <ChevronRight size={28} />
                         </Button>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="mock"
                     initial={{ opacity: 0, scale: 0.98, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     className="space-y-8"
                   >
                      <Card className="border-destructive/20 bg-background/50 backdrop-blur-xl relative overflow-hidden">
                         {/* Subtle Neural Pulse Effect */}
                         <div className="absolute top-0 left-0 w-full h-1 bg-destructive/20 overflow-hidden">
                            <motion.div 
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="w-1/3 h-full bg-destructive shadow-[0_0_15px_var(--destructive)]"
                            />
                         </div>

                         <CardContent className="p-0">
                            {/* Simulator Toolbar */}
                            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
                               <div className="flex items-center gap-6">
                                  <div className="space-y-1">
                                     <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                                        <Zap size={18} className="text-destructive fill-current" />
                                        Simulation Core: Digital Logic II
                                     </h2>
                                     <div className="flex items-center gap-4">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-emerald-500/20 text-emerald-500">Environment: Isolated</Badge>
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary">Proctor: AI-Neural</Badge>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <Tooltip>
                                     <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" className="w-10 h-10 border-border/50 rounded-xl hover:text-destructive">
                                           <AlertCircle size={18} />
                                        </Button>
                                     </TooltipTrigger>
                                     <TooltipContent>Report Simulation Error</TooltipContent>
                                  </Tooltip>
                                  <div className="px-6 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
                                     <Clock size={18} className="animate-pulse" />
                                     <span className="text-xl font-black tabular-nums">42:15</span>
                                  </div>
                               </div>
                            </div>

                            <div className="p-10 space-y-10">
                               <div className="flex justify-between items-start">
                                  <div className="space-y-6 flex-1 max-w-2xl">
                                     <div className="flex items-center gap-4">
                                        <Badge className="bg-destructive hover:bg-destructive text-white font-black px-4 py-1 rounded-lg">Question {currentMockQuestion + 1}</Badge>
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Weight: 15 Points</span>
                                     </div>
                                     <h3 className="text-2xl font-bold text-foreground leading-relaxed">
                                        {mockQuestions[currentMockQuestion].q}
                                     </h3>
                                     
                                     <div className="flex items-center gap-3 text-destructive/60 bg-destructive/5 p-4 rounded-xl border border-destructive/10">
                                        <Info size={16} />
                                        <p className="text-xs font-bold uppercase tracking-wide">AI Tip: {mockQuestions[currentMockQuestion].hint}</p>
                                     </div>
                                  </div>

                                  <div className="w-48 space-y-4">
                                     <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">Progress Radar</p>
                                     <div className="grid grid-cols-5 gap-2">
                                        {Array.from({ length: 20 }).map((_, i) => (
                                          <button 
                                            key={i}
                                            onClick={() => setCurrentMockQuestion(i % mockQuestions.length)}
                                            className={cn(
                                              "w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center border transition-all",
                                              currentMockQuestion === i ? "bg-destructive border-destructive text-white shadow-lg shadow-destructive/20 scale-110" : 
                                              answers[i] ? "bg-primary/10 border-primary/20 text-primary" : 
                                              flaggedQuestions.includes(i) ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                              "bg-muted border-border/50 text-muted-foreground hover:border-destructive/30"
                                            )}
                                          >
                                            {i + 1}
                                          </button>
                                        ))}
                                     </div>
                                  </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {mockQuestions[currentMockQuestion].options.map((opt, i) => (
                                    <Button 
                                      key={i} 
                                      variant="outline" 
                                      onClick={() => setAnswers(prev => ({ ...prev, [currentMockQuestion]: opt }))}
                                      className={cn(
                                        "h-20 justify-start px-8 rounded-2xl border-2 transition-all text-base font-bold gap-6",
                                        answers[currentMockQuestion] === opt ? 
                                        "bg-destructive/10 border-destructive text-destructive shadow-inner" : 
                                        "border-border/50 bg-background hover:bg-destructive/5 hover:border-destructive/30"
                                      )}
                                    >
                                       <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-black group-hover:bg-destructive group-hover:text-white transition-colors">
                                          {String.fromCharCode(65 + i)}
                                       </span>
                                       {opt}
                                    </Button>
                                  ))}
                               </div>

                               <div className="flex justify-between items-center pt-8 border-t border-border/50">
                                  <div className="flex gap-4">
                                     <Button variant="ghost" className="px-6 font-black uppercase text-[10px] tracking-widest gap-2">
                                        <ChevronLeft size={16} /> Previous
                                     </Button>
                                     <Button 
                                       variant="outline" 
                                       onClick={() => toggleFlag(currentMockQuestion)}
                                       className={cn(
                                         "px-6 font-black uppercase text-[10px] tracking-widest gap-2 rounded-xl",
                                         flaggedQuestions.includes(currentMockQuestion) && "text-amber-500 border-amber-500/30 bg-amber-500/5"
                                       )}
                                     >
                                        <Flag size={16} fill={flaggedQuestions.includes(currentMockQuestion) ? "currentColor" : "none"} />
                                        {flaggedQuestions.includes(currentMockQuestion) ? "Flagged" : "Flag for Review"}
                                     </Button>
                                  </div>
                                  <div className="flex gap-4">
                                     <Button variant="outline" className="px-8 font-black uppercase text-[10px] tracking-widest gap-2 rounded-xl border-border/50">
                                        <FileText size={16} /> Reference Sheet
                                     </Button>
                                     <Button className="px-10 bg-destructive hover:bg-destructive/90 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-destructive/30 h-12 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0">
                                        Submit & Next <ChevronRight size={16} className="ml-2" />
                                     </Button>
                                  </div>
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

           <div className="col-span-12 lg:col-span-4 space-y-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                 <CardHeader>
                    <CardTitle className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                       <RotateCw size={16} className="text-destructive" />
                       Neural Calibration
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    {[
                      { title: "Binary Arithmetic", status: "Critical", val: 34, trend: 'down' },
                      { title: "Boolean Algebra", status: "Stable", val: 82, trend: 'up' },
                      { title: "Logic Gates", status: "Review", val: 56, trend: 'neutral' }
                    ].map((node, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-muted/20 border border-border/50 space-y-4 group hover:border-destructive/30 transition-all cursor-default">
                         <div className="flex justify-between items-start">
                            <div className="space-y-1">
                               <h4 className="text-sm font-black text-foreground">{node.title}</h4>
                               <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Mastery Index</p>
                            </div>
                            <Badge variant={node.status === 'Critical' ? 'destructive' : node.status === 'Review' ? 'secondary' : 'outline'} className="text-[8px] font-black uppercase tracking-widest px-2 py-0">
                               {node.status}
                            </Badge>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between items-end">
                               <span className="text-2xl font-black text-foreground tabular-nums tracking-tighter">{node.val}%</span>
                               <TrendingIndicator trend={node.trend as 'up' | 'down' | 'neutral'} />
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${node.val}%` }}
                                 transition={{ duration: 1, delay: i * 0.1 }}
                                 className={cn(
                                   "h-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                                   node.status === 'Critical' ? "bg-destructive" : node.status === 'Review' ? "bg-amber-500" : "bg-emerald-500"
                                 )} 
                               />
                            </div>
                         </div>
                      </div>
                    ))}
                 </CardContent>
              </Card>

              <Card className="bg-destructive/5 border-destructive/20 relative overflow-hidden group border-dashed">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                    <Sparkles size={120} className="text-destructive" />
                 </div>
                 <CardContent className="p-10 space-y-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-2 shadow-xl shadow-destructive/10">
                       <Eye size={28} className="animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-foreground tracking-tight">AI Observation</h3>
                       <p className="text-muted-foreground text-sm font-medium leading-relaxed italic border-l-2 border-destructive/30 pl-4">
                         "I'm observing hesitation in <span className="text-destructive font-bold">K-Map simplification</span>. Your focus pulse suggests mental fatigue. Shift to visual mode?"
                       </p>
                    </div>
                    <div className="flex gap-3">
                       <Button className="flex-1 h-12 bg-destructive hover:bg-destructive/90 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-destructive/20 rounded-xl transition-all">
                          Optimize Path
                       </Button>
                       <Button variant="outline" className="w-12 h-12 rounded-xl border-border/50">
                          <ChevronRight size={18} />
                       </Button>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>

        <style>{`
          .perspective-1000 { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>
      </div>
    </TooltipProvider>
  );
};

const TrendingIndicator: React.FC<{ trend: 'up' | 'down' | 'neutral' }> = ({ trend }) => {
  if (trend === 'up') return <div className="text-emerald-500 text-[10px] font-black flex items-center gap-1 uppercase tracking-widest">▲ Rising</div>;
  if (trend === 'down') return <div className="text-destructive text-[10px] font-black flex items-center gap-1 uppercase tracking-widest">▼ Dropping</div>;
  return <div className="text-muted-foreground text-[10px] font-black flex items-center gap-1 uppercase tracking-widest">● Stable</div>;
};


