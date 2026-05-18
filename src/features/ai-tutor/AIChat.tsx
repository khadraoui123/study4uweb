import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { Send, Bot, User, Sparkles, Brain, Book, Command, Mic, History, Settings } from 'lucide-react';

export const AIChat: React.FC = () => {
  const { chatHistory, sendMessage, addAssistantMessage, tasks, exams, courses, notes } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const generateContextualResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('exam') || query.includes('test')) {
      const nextExam = exams[0];
      return `I've analyzed your temporal engine. You have a ${nextExam.title} for ${courses.find(c => c.id === nextExam.courseId)?.code} on ${nextExam.date}. Based on your current mastery of 89%, I recommend 2 deep focus sessions this week.`;
    }
    
    if (query.includes('task') || query.includes('todo')) {
      const urgentTasks = tasks.filter(t => !t.completed && t.urgency === 'URGENT');
      return `You have ${urgentTasks.length} urgent tactical nodes pending. The high-priority task is "${urgentTasks[0]?.title}". Shall we initiate a focus stream?`;
    }

    if (query.includes('grade') || query.includes('performance')) {
      return `Your cumulative GPA trajectory is currently 3.82. Your strongest node is Physics (94%), but Discrete Structures is showing a 12% retention decay. Recommend syllabus injection.`;
    }

    return "Neural Assistant synchronized. I'm monitoring your academic trajectory across all modules. How can I optimize your flow?";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    sendMessage(input);
    setInput('');
    setIsTyping(true);
    
    // Premium simulated response delay
    setTimeout(() => {
      setIsTyping(false);
      const response = generateContextualResponse(userMsg);
      addAssistantMessage(response);
    }, 1500);
  };

  return (
    <div className="flex-1 ml-[300px] h-screen flex flex-col p-12 gap-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="ambient-bg">
        <div className="blob w-[500px] h-[500px] bg-violet-900 top-[-200px] right-[-100px] opacity-10" />
      </div>

      <header className="flex justify-between items-center relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
               <Bot size={18} />
            </div>
            <h1 className="text-3xl font-black heading-os text-white">Neural Assistant</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Equipped with <span className="text-violet-400">Academic Memory v4.2</span></p>
        </div>
        <div className="flex gap-4">
           <button className="glass-card-premium p-3 text-slate-500 hover:text-white transition-all"><History size={20} /></button>
           <button className="glass-card-premium p-3 text-slate-500 hover:text-white transition-all"><Settings size={20} /></button>
        </div>
      </header>

      <div className="flex-1 glass-panel rounded-[32px] flex flex-col overflow-hidden relative z-10 border-white/5">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          <AnimatePresence initial={false}>
            {chatHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-6 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl ${
                    msg.role === 'user' ? 'bg-slate-800 border border-white/10 text-slate-400' : 'bg-gradient-to-br from-violet-500 to-violet-700 text-white'
                  }`}>
                    {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                  </div>
                  <div className={`p-6 rounded-[24px] text-base font-medium leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-slate-100' 
                      : 'bg-white/[0.03] text-white border border-white/10 backdrop-blur-md'
                  }`}>
                    {msg.content}
                    <div className="mt-4 flex justify-between items-center opacity-40">
                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-6"
              >
                 <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 animate-pulse">
                    <Sparkles size={20} />
                 </div>
                 <div className="bg-white/[0.03] border border-white/10 p-5 rounded-[20px] flex gap-1.5 items-center">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <div className="flex gap-3 mb-6">
            {["Analyze Physics Grades", "Quiz on KVL/KCL", "Today's OS Summary"].map(hint => (
              <button 
                key={hint}
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all uppercase tracking-widest flex items-center gap-2"
                onClick={() => setInput(hint)}
              >
                <Command size={12} />
                {hint}
              </button>
            ))}
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-slate-950/80 border border-white/10 rounded-2xl p-2 pr-4 transition-all focus-within:border-violet-500/50">
               <button className="p-3 text-slate-500 hover:text-violet-400 transition-colors"><Mic size={22} /></button>
               <input 
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Message Study4u OS..."
                 className="flex-1 bg-transparent border-none py-4 px-4 text-white font-medium placeholder:text-slate-600 focus:outline-none"
               />
               <button 
                 onClick={handleSend}
                 disabled={!input.trim()}
                 className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                   input.trim() ? 'bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:bg-violet-400' : 'bg-slate-800 text-slate-600'
                 }`}
               >
                 <Send size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8 relative z-10">
        {[
          { icon: <Brain size={18} />, label: 'Neural Readiness', val: '82%', color: 'text-violet-400' },
          { icon: <Book size={18} />, label: 'Active Subject', val: 'Electronics', color: 'text-cyan-400' },
          { icon: <Sparkles size={18} />, label: 'Insight Confidence', val: '98%', color: 'text-emerald-400' },
          { icon: <Command size={18} />, label: 'Memory Depth', val: 'Level 4', color: 'text-amber-400' }
        ].map((item, i) => (
          <div key={i} className="glass-card-premium p-6 flex flex-col gap-3">
             <div className={`${item.color} opacity-60`}>{item.icon}</div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                <p className="text-xl font-black text-white">{item.val}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
