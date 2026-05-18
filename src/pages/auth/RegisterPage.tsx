import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Loader2, Eye, EyeOff, Sparkles, Check, AlertCircle, GraduationCap, Calendar, User } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('Freshman');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Custom seed-based avatar generator
  const [avatarSeed, setAvatarSeed] = useState('');
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed || name || 'default')}`;

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const register = useStore(state => state.register);
  const isLoading = useStore(state => state.isLoading);
  const navigate = useNavigate();

  // Password strength checker
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: 'Weak', color: 'bg-red-500' });
  
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: 'None', color: 'bg-slate-700' });
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let text = 'Weak';
    let color = 'bg-red-500';
    if (score >= 4) {
      text = 'Strong 🔥';
      color = 'bg-emerald-500';
    } else if (score >= 2) {
      text = 'Medium ⚡';
      color = 'bg-amber-500';
    }
    setPasswordStrength({ score, text, color });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validations
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(name, email, password, major, year, avatarUrl);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Email may already be registered.');
    }
  };

  const regenerateAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01),transparent)]" />
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-xl z-10"
          >
            <div className="glass-panel p-8 md:p-10 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40 relative">
              {/* Decorative Tech Grid element */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[8px] font-black uppercase tracking-widest">Protocol 404-Active</span>
              </div>

              {/* Headings */}
              <div className="text-center mb-8">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 mx-auto mb-4 flex items-center justify-center shadow-lg relative group cursor-pointer"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Brain size={32} className="text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <h1 className="text-3xl font-black heading-os tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Initialize Neural Node
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Create your decentralized academic identity</p>
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
                {/* 1. Identity & Avatar Row */}
                <div className="flex flex-col md:flex-row gap-6 items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="relative group shrink-0">
                    <img 
                      src={avatarUrl} 
                      alt="Avatar Preview" 
                      className="w-20 h-20 rounded-2xl border-2 border-primary/30 bg-slate-900 object-cover shadow-lg group-hover:border-primary transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={regenerateAvatar}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary hover:bg-primary/80 border-2 border-slate-950 flex items-center justify-center text-white shadow-md transition-colors"
                      title="Regenerate Avatar Seed"
                    >
                      <Sparkles size={12} />
                    </button>
                  </div>
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <User size={12} className="text-primary" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Email Address */}
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

                {/* 3. Credentials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all text-sm pr-10"
                        placeholder="Min 6 characters"
                        required
                        minLength={6}
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
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all text-sm pr-10"
                        placeholder="Confirm password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Password Strength Indicator */}
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                      <span className="text-slate-400">Security Score:</span>
                      <span className={passwordStrength.score >= 4 ? 'text-emerald-400' : passwordStrength.score >= 2 ? 'text-amber-400' : 'text-red-400'}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-full flex-1 rounded-full transition-all duration-500 ${
                            i < passwordStrength.score ? passwordStrength.color : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 5. Major & Year Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-primary" /> Major / Field
                    </label>
                    <input
                      type="text"
                      value={major}
                      onChange={e => setMajor(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary" /> Academic Year
                    </label>
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-slate-300"
                    >
                      <option value="Freshman">Freshman (Year 1)</option>
                      <option value="Sophomore">Sophomore (Year 2)</option>
                      <option value="Junior">Junior (Year 3)</option>
                      <option value="Senior">Senior (Year 4)</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                {/* 6. Form Submission */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-sm font-black uppercase tracking-widest relative group overflow-hidden mt-2 h-12"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Encrypting Protocols...
                      </>
                    ) : (
                      <>
                        Initiate Node
                        <Sparkles size={16} className="text-cyan-300 group-hover:animate-bounce" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              {/* Bottom Navigation */}
              <p className="text-center mt-6 text-xs text-muted-foreground">
                Already authenticated?{' '}
                <Link to="/login" className="text-primary hover:underline font-bold transition-all">
                  Access Neural Interface
                </Link>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="register-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-10 max-w-md text-center border border-white/10 rounded-[32px] bg-black/50 shadow-[0_0_100px_rgba(139,92,246,0.2)] z-10 space-y-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <Check size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black heading-os">Node Successfully Synced</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Decrypted keys are validated. Launching your personalized Study4u dashboard.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <Loader2 size={12} className="animate-spin" />
              Preloading Academic Matrix...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

