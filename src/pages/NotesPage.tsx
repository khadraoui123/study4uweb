import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, MoreVertical } from 'lucide-react';
import { Card } from '../components/ui/card';

export const NotesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black heading-os tracking-tight">NEURAL NOTES</h1>
          <p className="text-muted-foreground mt-2">Capture your digital consciousness.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95">
          <Plus size={20} />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="glass-panel border-white/10 overflow-hidden cursor-pointer hover:border-primary/50 transition-all p-0">
              <div className="h-32 bg-gradient-to-br from-primary/20 to-cyan-500/20" />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">Thermodynamics Lecture {i}</h3>
                  <MoreVertical size={16} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                  Key concepts covering entropy, enthalpy and the second law of thermodynamics. Important for midterm.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <FileText size={12} />
                  Academic
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
