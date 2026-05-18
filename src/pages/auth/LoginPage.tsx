import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Loader2, Eye, EyeOff, Sparkles, Key, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('john.doe@university.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const login = useStore(state => state.login);
  const isLoading = useStore(state => state.isLoading);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      await login(email, password);
      // Under a real system, rememberMe would toggle cookie persistence or longer token expiry
      if (rememberMe) {
        localStorage.setItem('study4u_remember_me', email);
      } else {
        localStorage.removeItem('study4u_remember_me');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and security keys.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordSent(true);
    setTimeout(() => {
      setForgotPasswordOpen(false);
      setForgotPasswordSent(false);
      setForgotPasswordEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent)]" />
      </div>

      <div className="relative w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="glass-panel p-8 md:p-10 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40 relative"
        >
          {/* Decorative Protocol tag */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest">Secure Handshake</span>
          </div>

          {/* Logo Headings */}
          <div className="text-center mb-8">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 mx-auto mb-4 flex items-center justify-center shadow-lg relative group cursor-pointer"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Brain size={32} className="text-white" />
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <h1 className="text-3xl font-black heading-os tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Study4u AI
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Neural Academic Operating System</p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm overflow-hidden"
              >
                <AlertCircle size={18} className="shrink-0" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                placeholder="john.doe@university.edu"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Security Key</label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-xs text-primary hover:underline font-bold transition-all"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all text-sm pr-10"
                  placeholder="Enter your security key"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-primary focus:ring-0 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-300">
                Remember connection state
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-sm font-black uppercase tracking-widest relative group overflow-hidden h-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Handshaking Protocol...
                  </>
                ) : (
                  <>
                    Decrypt & Access
                    <Sparkles size={16} className="text-cyan-300" />
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Registration Redirect */}
          <p className="text-center mt-6 text-xs text-muted-foreground">
            Identity node not initialized?{' '}
            <Link to="/register" className="text-primary hover:underline font-bold transition-all">
              Initialize Profile
            </Link>
          </p>

          {/* Quick Demo Assist */}
          <div className="mt-8 p-3 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center gap-2.5">
            <Key size={14} className="text-primary" />
            <div className="text-[10px] text-slate-400">
              <span className="font-bold text-slate-300">Quick Seed:</span> john.doe@university.edu / password123
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal (Architectural Placeholder) */}
      <AnimatePresence>
        {forgotPasswordOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-panel max-w-sm w-full p-8 border border-white/10 rounded-[28px] bg-slate-950 text-center relative"
            >
              <button 
                onClick={() => setForgotPasswordOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
              
              <div className="w-12 h-12 rounded-2xl bg-primary/20 mx-auto mb-4 flex items-center justify-center text-primary">
                <HelpCircle size={24} />
              </div>
              
              {!forgotPasswordSent ? (
                <>
                  <h3 className="text-xl font-bold heading-os">Recover Security Key</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Enter your verified neural node email to dispatch decryption tokens.
                  </p>
                  <form onSubmit={handleForgotPasswordSubmit} className="mt-5 space-y-4">
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={e => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="Verified email address"
                      required
                    />
                    <Button type="submit" className="w-full py-2.5 text-xs font-black uppercase tracking-wider">
                      Request Decryption Token
                    </Button>
                  </form>
                </>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 animate-bounce">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-emerald-400">Decryption Token Dispatched</h3>
                  <p className="text-xs text-slate-400">
                    If this node exists, an encrypted sequence has been dispatched to recovery channels.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

