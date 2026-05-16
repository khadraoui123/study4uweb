import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, BarChart2, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'tracker', icon: <Calendar size={24} />, label: 'Tracker' },
    { id: 'stats', icon: <BarChart2 size={24} />, label: 'Stats' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-8">
      <div className="floating-dock max-w-lg m-auto flex justify-around items-center p-4 shadow-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex flex-col items-center justify-center w-16 h-16"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <motion.div
              animate={{
                scale: activeTab === tab.id ? 1.2 : 1,
                color: activeTab === tab.id ? '#4ADE80' : '#94A3B8'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 } as any}
            >
              {tab.icon}
            </motion.div>
            {activeTab === tab.id && (
              <motion.div
                layoutId="nav-active"
                className="absolute w-1 h-1 rounded-full"
                style={{ top: '-4px', backgroundColor: '#4ADE80' }}
                transition={{ type: "spring", stiffness: 300, damping: 20 } as any}
              />
            )}
            <span 
              className="text-xs mt-1 font-semibold"
              style={{ fontSize: '10px', color: activeTab === tab.id ? '#4ADE80' : '#94A3B8' }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
