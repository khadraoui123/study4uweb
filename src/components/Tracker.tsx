import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

export const Tracker: React.FC = () => {
  const { courses, logAttendance } = useStore();

  const totalAttendance = courses.reduce((acc: number, c: any) => {
    const total = c.attendancePresent + c.attendanceAbsent + c.attendanceLate;
    return acc + (total > 0 ? (c.attendancePresent / total) : 0);
  }, 0) / (courses.length || 1);

  const attendancePercent = Math.round(totalAttendance * 100);
  const isBelowThreshold = attendancePercent < 75;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-32 pt-8 px-6 flex flex-col gap-8 max-w-lg m-auto"
    >
      <header>
        <h1 className="text-3xl font-extrabold" style={{ color: '#1E293B' }}>Academic Tracker</h1>
        <p className="font-medium" style={{ color: '#64748B' }}>Keep your consistency in check.</p>
      </header>

      <section className="flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <fluent-progress-ring
            value={attendancePercent}
            style={{ 
              '--progress-ring-size': '220px', 
              '--stroke-width': '24px', 
              '--accent-fill-rest': isBelowThreshold ? '#EF4444' : '#4ADE80' 
            } as any}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="display-stat text-5xl font-extrabold" style={{ color: '#1E293B' }}>{attendancePercent}%</span>
            <span 
              className="font-bold uppercase tracking-widest mt-1" 
              style={{ fontSize: '10px', color: '#94A3B8' }}
            >
              Total Attendance
            </span>
          </div>
        </div>
        {isBelowThreshold && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 flex items-center gap-2 bg-red-50 px-4 py-3 rounded-2xl"
            style={{ border: '1px solid #fee2e2', color: '#dc2626' }}
          >
            <AlertCircle size={20} />
            <span className="text-sm font-bold">Attendance below 75% threshold!</span>
          </motion.div>
        )}
      </section>

      <div className="flex gap-4">
        {[
          { label: 'Present', count: courses.reduce((acc: number, c: any) => acc + (c.attendancePresent || 0), 0), color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Absent', count: courses.reduce((acc: number, c: any) => acc + (c.attendanceAbsent || 0), 0), color: '#dc2626', bg: '#fef2f2' },
          { label: 'Late', count: courses.reduce((acc: number, c: any) => acc + (c.attendanceLate || 0), 0), color: '#d97706', bg: '#fffbeb' }
        ].map((stat) => (
          <fluent-card 
            key={stat.label} 
            style={{ padding: '12px', textAlign: 'center', flex: 1, backgroundColor: stat.bg, color: stat.color }}
          >
            <span className="block text-xl font-extrabold">{stat.count}</span>
            <span className="font-bold uppercase tracking-wider" style={{ fontSize: '10px' }}>{stat.label}</span>
          </fluent-card>
        ))}
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-bold" style={{ color: '#1E293B' }}>Today's Classes</h3>
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <div key={course.id} className="relative py-2" style={{ paddingLeft: '2rem', borderLeft: '2px solid #f1f5f9' }}>
              <div 
                className="absolute bg-white rounded-full" 
                style={{ 
                  left: '-9px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  width: '1rem', 
                  height: '1rem', 
                  border: '4px solid #4ADE80' 
                }} 
              />
              <fluent-card style={{ padding: '20px' }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg" style={{ color: '#1E293B' }}>{course.name}</h4>
                    <p className="font-bold" style={{ fontSize: '12px', color: '#94A3B8' }}>{course.schedule}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <fluent-button 
                    appearance="accent" 
                    onClick={() => logAttendance(course.id, 'present')} 
                    className="flex-1" 
                    style={{ '--accent-fill-rest': '#4ADE80' } as any}
                  >
                    <Check size={18} slot="start" /> Present
                  </fluent-button>
                  <fluent-button 
                    onClick={() => logAttendance(course.id, 'absent')} 
                    className="flex-1" 
                    style={{ border: '1px solid #CBD5E1' }}
                  >
                    <X size={18} slot="start" /> Absent
                  </fluent-button>
                  <fluent-button 
                    onClick={() => logAttendance(course.id, 'late')} 
                    style={{ minWidth: '48px', border: '1px solid #CBD5E1' }}
                  >
                    <Clock size={18} />
                  </fluent-button>
                </div>
              </fluent-card>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
