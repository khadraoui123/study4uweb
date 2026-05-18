import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Save, 
  X, 
  Sparkles, 
  Link as LinkIcon, 
  Tags, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Layers,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Note } from '../store/slices/noteSlice';

export const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, courses, pushToast } = useStore();

  const loadNotes = useStore(state => state.loadNotes);

  useEffect(() => {
    loadNotes?.();
  }, []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateNote = () => {
    const newNote = {
      title: 'Untitled Synapse',
      content: '',
      tags: [],
      courseId: courses[0]?.id
    };
    addNote(newNote);
    pushToast({
      type: 'success',
      title: 'Neural Note Initialized',
      body: 'New digital consciousness node created.'
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    pushToast({
      type: 'success',
      title: 'Sync Complete',
      body: 'Note state persisted to neural storage.'
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Permanently delete this neural node?')) {
      deleteNote(id);
      if (selectedNoteId === id) setSelectedNoteId(null);
      pushToast({
        type: 'warning',
        title: 'Node Terminated',
        body: 'Neural note successfully purged.'
      });
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 gap-2 shadow-lg shadow-primary/5">
              <FileText size={16} className="fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Notes v2.8</span>
            </Badge>
            <div className="h-[1px] flex-1 bg-border/50 max-w-[100px]" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">Knowledge Repository Active</span>
          </div>
          <div className="space-y-2">
             <h1 className="text-6xl font-black heading-os tracking-tighter text-foreground leading-none">Digital Archive</h1>
             <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
               Capture and cross-reference your <span className="text-primary font-black border-b-2 border-primary/20">academic consciousness</span> with AI-powered conceptual linking.
             </p>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all" size={18} />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Query archive..."
              className="pl-10 h-14 bg-muted/20 border-border/50 focus-visible:bg-background focus-visible:ring-1 ring-primary/20 transition-all rounded-xl"
            />
          </div>
          <Button 
            className="font-black uppercase text-[10px] tracking-widest px-8 h-14 shadow-2xl shadow-primary/20 rounded-xl transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
            onClick={handleCreateNote}
          >
            <Plus size={20} className="mr-2" />
            New Note
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <AnimatePresence mode="wait">
          {!selectedNoteId ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredNotes.map((note, i) => (
                <motion.div 
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card 
                    onClick={() => setSelectedNoteId(note.id)}
                    className="group relative h-72 border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/40 transition-all cursor-pointer overflow-hidden flex flex-col shadow-xl hover:shadow-primary/5"
                  >
                    <div className="h-2 bg-gradient-to-r from-primary/50 to-violet-500/50" />
                    <CardContent className="p-8 flex-1 flex flex-col justify-between">
                       <div className="space-y-4">
                          <div className="flex justify-between items-start">
                             <h3 className="text-xl font-black text-foreground tracking-tight line-clamp-2 group-hover:text-primary transition-colors">{note.title}</h3>
                             <button onClick={(e) => handleDelete(note.id, e)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={16} />
                             </button>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground line-clamp-3 leading-relaxed italic">
                             {note.content || 'Empty node...'}
                          </p>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                             {note.tags.slice(0, 2).map(tag => (
                               <Badge key={tag} variant="secondary" className="text-[8px] font-black uppercase tracking-widest px-2 py-0">{tag}</Badge>
                             ))}
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-border/30">
                             <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <Clock size={12} className="text-primary" />
                                {new Date(note.lastModified).toLocaleDateString()}
                             </div>
                             {note.courseId && (
                               <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase">
                                 {courses.find(c => c.id === note.courseId)?.code}
                               </Badge>
                             )}
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {filteredNotes.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center gap-6 opacity-30 text-center">
                   <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
                      <Layers size={40} />
                   </div>
                   <p className="text-xl font-black uppercase tracking-[0.2em]">No matches found in the archive</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="editor"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="col-span-12 lg:col-span-9"
            >
              <Card className="border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl min-h-[700px] flex flex-col">
                 <CardHeader className="p-8 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-6">
                       <Button variant="ghost" size="icon" onClick={() => setSelectedNoteId(null)} className="w-10 h-10 rounded-xl hover:bg-background">
                          <ChevronLeft size={24} />
                       </Button>
                       <div className="space-y-1">
                          <Input 
                            value={selectedNote?.title}
                            onChange={(e) => updateNote(selectedNote!.id, { title: e.target.value })}
                            className="text-2xl font-black text-foreground border-none bg-transparent p-0 h-auto focus-visible:ring-0 w-80"
                          />
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                             Modified {new Date(selectedNote!.lastModified).toLocaleString()}
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <Button variant="outline" className="h-10 px-4 font-black text-[10px] uppercase tracking-widest gap-2 rounded-xl border-border/50">
                          <LinkIcon size={14} /> Link Course
                       </Button>
                       <Button onClick={handleSave} className="h-10 px-6 font-black text-[10px] uppercase tracking-widest gap-2 rounded-xl bg-primary text-primary-foreground">
                          <Save size={14} /> Persist
                       </Button>
                    </div>
                 </CardHeader>
                 
                 <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="p-8 border-b border-border/30 bg-muted/10 flex gap-4">
                       <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-xl border border-border/50">
                          <Tags size={14} className="text-primary" />
                          <Input 
                            placeholder="Add neural tags..." 
                            className="h-6 border-none bg-transparent text-[10px] font-black uppercase tracking-widest p-0 focus-visible:ring-0 w-32"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if (val) {
                                  updateNote(selectedNote!.id, { tags: [...selectedNote!.tags, val] });
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                       </div>
                       {selectedNote?.tags.map(tag => (
                         <Badge key={tag} className="bg-primary/10 text-primary border-none px-4 rounded-xl flex items-center gap-2 group">
                            <span className="text-[10px] font-black uppercase tracking-widest">{tag}</span>
                            <X size={10} className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => updateNote(selectedNote!.id, { tags: selectedNote!.tags.filter(t => t !== tag) })} />
                         </Badge>
                       ))}
                    </div>
                    
                    <textarea 
                      value={selectedNote?.content}
                      onChange={(e) => updateNote(selectedNote!.id, { content: e.target.value })}
                      placeholder="Synthesize your knowledge here..."
                      className="flex-1 p-10 bg-transparent border-none text-lg font-medium leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30 custom-scrollbar"
                    />
                 </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar: AI Conceptual Links */}
        {selectedNoteId && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-12 lg:col-span-3 space-y-8"
          >
             <Card className="border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
                <CardHeader className="p-8 border-b border-border/40 bg-muted/20">
                   <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
                      <Sparkles size={16} /> Neural Context
                   </CardTitle>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-muted-foreground">AI Conceptual associations</p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recommended Actions</p>
                      <div className="space-y-3">
                         {['Summarize Node', 'Generate Flashcards', 'Cross-link Course'].map(action => (
                           <Button key={action} variant="outline" className="w-full justify-between h-12 rounded-xl border-border/50 text-[10px] font-black uppercase tracking-widest px-6 group">
                              {action}
                              <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                           </Button>
                         ))}
                      </div>
                   </div>

                   <div className="h-[1px] bg-border/50" />

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Related Knowledge</p>
                      <div className="space-y-4">
                         {[
                           { title: 'Entropy Variations', type: 'Note', date: '2d ago' },
                           { title: 'EEE182.4 Midterm', type: 'Exam', date: '8d left' }
                         ].map((rel, i) => (
                           <div key={i} className="p-4 rounded-xl bg-muted/20 border border-transparent hover:border-border transition-all cursor-pointer group">
                              <div className="flex justify-between items-start mb-1">
                                 <h5 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{rel.title}</h5>
                                 <Badge className="text-[8px] font-black uppercase h-4 px-2 bg-background border-border/50">{rel.type}</Badge>
                              </div>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase">{rel.date}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group shadow-2xl border-dashed">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                   <Bot size={120} className="text-primary" />
                </div>
                <CardContent className="p-10 space-y-6 relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-xl shadow-primary/10">
                      <Sparkles size={28} className="animate-pulse" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-foreground tracking-tight">AI Insights</h3>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed italic border-l-2 border-primary/30 pl-4">
                        "I've detected missing concepts in your <span className="text-primary font-bold">First Law</span> section. Would you like a neural injection of enthalpy examples?"
                      </p>
                   </div>
                   <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 rounded-xl">
                      Inject Concepts
                   </Button>
                </CardContent>
             </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

