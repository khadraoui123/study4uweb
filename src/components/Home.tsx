import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { MapPin, Clock, MoreHorizontal, CheckCircle2, Circle } from 'lucide-react';

export const Home: React.FC = () => {
  const { courses, tasks, toggleTask } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 } as any
    }
  };

  const nextCourse = courses[0];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-32 pt-8 px-6 flex flex-col gap-8 max-w-lg m-auto"
    >
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium" style={{ color: '#64748B' }}>Good Morning</h2>
          <h1 className="text-3xl font-extrabold" style={{ color: '#1E293B' }}>Hello, Tareq! 👋</h1>
        </div>
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center p-[2px]"
          style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #2DD4BF 100%)' }}
        >
          <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tareq" alt="Avatar" />
          </div>
        </div>
      </header>

      <motion.div variants={itemVariants}>
        <fluent-card style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #2DD4BF 100%)', border: 'none', color: 'white' }}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                Up Next
              </span>
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold">{nextCourse.name}</h3>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{nextCourse.code}</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                <MapPin size={16} />
                <span>{nextCourse.room}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                <Clock size={16} />
                <span>{nextCourse.schedule}</span>
              </div>
            </div>
          </div>
        </fluent-card>
      </motion.div>

      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold" style={{ color: '#1E293B' }}>Your Courses</h3>
          <button style={{ background: 'none', border: 'none', color: '#4ADE80', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            View All
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {courses.map((course) => (
            <motion.div key={course.id} variants={itemVariants}>
              <fluent-card style={{ padding: '16px' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs">
                    {course.code.split('.')[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold line-clamp-1" style={{ color: '#1E293B' }}>{course.name}</h4>
                    <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>{course.schedule}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold" style={{ color: '#1E293B' }}>
                      {Math.round((course.attendance.present / (course.attendance.present + course.attendance.absent + course.attendance.late || 1)) * 100)}%
                    </span>
                    <span className="text-xs font-bold uppercase" style={{ fontSize: '10px', color: '#94A3B8' }}>Attend</span>
                  </div>
                </div>
              </fluent-card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-bold" style={{ color: '#1E293B' }}>Active Tasks</h3>
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <motion.div key={task.id} variants={itemVariants}>
              <fluent-card style={{ padding: '16px' }}>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleTask(task.id)} 
                    style={{ background: 'none', border: 'none', color: '#4ADE80', cursor: 'pointer', padding: 0 }}
                  >
                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <div className="flex-1">
                    <h4 
                      className="font-semibold text-sm" 
                      style={{ 
                        color: task.completed ? '#94A3B8' : '#1E293B',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}
                    >
                      {task.title}
                    </h4>
                  </div>
                  <span 
                    className="px-2 py-1 rounded-xl font-extrabold" 
                    style={{ 
                      fontSize: '10px',
                      backgroundColor: task.urgency === 'URGENT' ? '#fef2f2' : '#eff6ff',
                      color: task.urgency === 'URGENT' ? '#ef4444' : '#3b82f6'
                    }}
                  >
                    {task.urgency}
                  </span>
                </div>
              </fluent-card>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
