import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Trophy, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './components/ui/button';
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

const AdaptiveDashboard = React.lazy(() => import('./features/dashboard/AdaptiveHome').then(m => ({ default: m.AdaptiveDashboard })));
const AIChat = React.lazy(() => import('./features/ai/AIStudyAssistant').then(m => ({ default: m.AIChat })));
const FocusRoom = React.lazy(() => import('./features/focus-room/FocusRoom').then(m => ({ default: m.FocusRoom })));
const AcademicMatrix = React.lazy(() => import('./features/matrix/AcademicMatrix').then(m => ({ default: m.AcademicMatrix })));
const SmartTaskSystem = React.lazy(() => import('./features/tasks/SmartTaskSystem').then(m => ({ default: m.SmartTaskSystem })));
const NeuralAnalytics = React.lazy(() => import('./features/analytics/NeuralAnalytics').then(m => ({ default: m.NeuralAnalytics })));
const DynamicPlanner = React.lazy(() => import('./features/planner/DynamicPlanner').then(m => ({ default: m.DynamicPlanner })));
const AchievementSystem = React.lazy(() => import('./features/gamification/AchievementSystem').then(m => ({ default: m.AchievementSystem })));
const ExamMode = React.lazy(() => import('./features/exams/ExamMode').then(m => ({ default: m.ExamMode })));
const StudySocial = React.lazy(() => import('./features/social/StudySocial').then(m => ({ default: m.StudySocial })));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const NotesPage = React.lazy(() => import('./pages/NotesPage').then(m => ({ default: m.NotesPage })));
const LeaderboardPage = React.lazy(() => import('./pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationPage = React.lazy(() => import('./pages/NotificationPage').then(m => ({ default: m.NotificationPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));

const NeuralLoader = () => (
  <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-6">
    <div className="relative">
      <Loader2 size={48} className="text-primary animate-spin" />
      <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Synthesizing Neural Node...</p>
  </div>
);

const LevelUpCelebration: React.FC<{ level: number; onClose: () => void }> = ({ level, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6"
  >
    <motion.div
      initial={{ scale: 0.5, y: 100, rotate: -10 }}
      animate={{ scale: 1, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="glass-panel p-16 max-w-xl text-center relative overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.3)] bg-card border border-border rounded-[40px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 animate-pulse" />
      <div className="relative z-10 space-y-8">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-cyan-400 mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.5)]">
           <Trophy size={64} className="text-white fill-white/20" />
        </div>
        <div>
           <motion.h2
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="text-5xl font-black heading-os text-foreground"
           >
             LEVEL UP
           </motion.h2>
           <p className="text-primary text-2xl font-black mt-2 tracking-widest uppercase">Rank: Scholar Grade {level}</p>
        </div>
        <p className="text-muted-foreground text-lg font-medium">Your neural capacity has expanded. New focus protocols have been decrypted in your workspace.</p>
        <Button
          onClick={onClose}
          size="lg"
          className="px-12 py-7 text-lg font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
        >
          Acknowledge
        </Button>
      </div>
      <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"><X size={24} /></button>
    </motion.div>
  </motion.div>
);

function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const sidebarWidth = isSidebarCollapsed ? '80px' : '280px';
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <Header onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <main
        className="transition-all duration-300 pt-[70px] min-h-screen"
        style={{
          marginLeft: isRTL ? '0' : sidebarWidth,
          marginRight: isRTL ? sidebarWidth : '0',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-8"
          >
            <React.Suspense fallback={<NeuralLoader />}>
              <Outlet />
            </React.Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

const App: React.FC = () => {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const initializeApp = useStore(state => state.initializeApp);
  const checkStreak = useStore(state => state.checkStreak);
  const level = useStore(state => state.level);
  const simulateCognitiveDecay = useStore(state => state.simulateCognitiveDecay);
  const logout = useStore(state => state.logout);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastLevel, setLastLevel] = useState(level);
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Clear any existing session upon initial mount to guarantee login page is the first page
  useEffect(() => {
    logout();
    if (location.pathname === '/register') {
      navigate('/login', { replace: true });
    }
  }, [logout]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsInitialized(false);
      initializeApp().finally(() => setIsInitialized(true));
    } else {
      setIsInitialized(true);
    }
  }, [isAuthenticated, initializeApp]);

  useEffect(() => {
    if (checkStreak) checkStreak();
    const decayInterval = setInterval(() => {
      if (simulateCognitiveDecay) simulateCognitiveDecay();
    }, 30000);
    return () => clearInterval(decayInterval);
  }, [checkStreak, simulateCognitiveDecay]);

  useEffect(() => {
    if (level > lastLevel) {
      setShowLevelUp(true);
      setLastLevel(level);
    }
  }, [level, lastLevel]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-primary animate-spin mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse mt-4">Initializing Neural Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary transition-all duration-300">
      <div className="ambient-bg" />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
          <Route path="/dashboard" element={<AdaptiveDashboard />} />
          <Route path="/tutor" element={<AIChat />} />
          <Route path="/focus" element={<FocusRoom />} />
          <Route path="/courses" element={<AcademicMatrix />} />
          <Route path="/tasks" element={<SmartTaskSystem />} />
          <Route path="/planner" element={<DynamicPlanner />} />
          <Route path="/analytics" element={<NeuralAnalytics />} />
          <Route path="/achievements" element={<AchievementSystem />} />
          <Route path="/social" element={<StudySocial />} />
          <Route path="/exams" element={<ExamMode />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      <AnimatePresence>
        {showLevelUp && <LevelUpCelebration level={level} onClose={() => setShowLevelUp(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;
