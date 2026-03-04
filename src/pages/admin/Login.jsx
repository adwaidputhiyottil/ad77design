import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

/**
 * Login Page
 * Secure portal for the administrator.
 * Uses Supabase authentication.
 */

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back, Adwaid!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-border/40">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform -rotate-6">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-primary tracking-tighter">Admin Portal</h1>
            <p className="text-muted-foreground mt-2">Manage your creative portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-primary/60 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adwaidpc0704@gmail.com"
                  className="w-full pl-12 pr-4 h-14 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-primary/60 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 h-14 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-lg font-bold group"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-border/40">
             <button 
               type="button"
               onClick={() => navigate('/')}
               className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
             >
               Back to Public Site
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
