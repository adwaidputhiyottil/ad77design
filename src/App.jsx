import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/public/Home';
import { Projects } from './pages/public/Projects';
import { ProjectDetails } from './pages/public/ProjectDetails';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';

/**
 * ScrollToTop helper
 * Ensures the page scrolls to the top on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Admin Pages (To be created)
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';

/**
 * ProtectedRoute component
 * Redirects unauthenticated users to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

import { isSupabaseConfigured } from './lib/supabase';
import { AlertCircle, Key, ExternalLink } from 'lucide-react';
import { Button } from './components/ui/Button';

/**
 * SetupRequired component
 * Friendly UI shown when .env is not yet configured.
 */
const SetupRequired = () => (
  <div className="min-h-screen flex items-center justify-center bg-secondary p-6">
    <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-border/40 shadow-2xl text-center space-y-8">
      <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto text-amber-500">
        <AlertCircle size={40} />
      </div>
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tighter mb-4">Setup Required</h1>
        <p className="text-muted-foreground leading-relaxed">
          Your portfolio is almost ready! You just need to connect your <strong>Supabase</strong> project to get started.
        </p>
      </div>
      <div className="bg-secondary/50 p-6 rounded-2xl text-left space-y-4">
        <div className="flex items-center gap-3 text-sm font-bold text-primary">
          <Key size={18} className="text-muted-foreground" />
          <span>Add keys to .env file</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Copy your keys from Supabase Settings and paste them into the <code>.env</code> file in your project root.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={() => window.location.reload()} className="h-14 rounded-2xl font-black">
          I've added the keys, reload!
        </Button>
      </div>
    </div>
  </div>
);
// Minimal Loading Screen
import { LoadingScreen } from './components/ui/LoadingScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        {isInitialLoading && (
          <LoadingScreen onComplete={() => setIsInitialLoading(false)} />
        )}
      </AnimatePresence>

      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Layout Wrapper */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
