import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  UserCircle, 
  Wrench, 
  History, 
  LogOut, 
  Menu, 
  X,
  Palette,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

// Admin components (To be created)
import { AdminOverview } from '../../components/admin/AdminOverview';
import { ProjectManager } from '../../components/admin/ProjectManager';
import { BioManager } from '../../components/admin/BioManager';
import { SkillManager } from '../../components/admin/SkillManager';
import { ExperienceManager } from '../../components/admin/ExperienceManager';
import { MessageManager } from '../../components/admin/MessageManager';

/**
 * Admin Dashboard
 * Main layout for authenticated users.
 * Features a persistent sidebar and nested routes for management tasks.
 */

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { name: 'Inbox', icon: MessageSquare, path: '/admin/messages' },
    { name: 'Projects', icon: FolderKanban, path: '/admin/projects' },
    { name: 'Bio Editor', icon: UserCircle, path: '/admin/bio' },
    { name: 'Skills', icon: Wrench, path: '/admin/skills' },
    { name: 'Experience', icon: History, path: '/admin/experience' },
  ];

  return (
    <div className="flex h-screen bg-secondary/20">
      {/* Sidebar Overlay (Mobile) */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white border-r border-border/40 w-72 z-50 transition-transform duration-300 transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative`}
      >
        <div className="h-full flex flex-col p-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter">ADMIN</span>
            </div>
            <button className="lg:hidden p-2 hover:bg-secondary rounded-lg" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-grow space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "text-muted-foreground hover:bg-secondary hover:text-primary"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto space-y-4">
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/5 transition-all"
             >
               <LogOut className="w-5 h-5" />
               Logout Session
             </button>
             <Link to="/" className="block text-center text-xs font-bold text-muted-foreground hover:text-primary pt-4 border-t border-border/40">
                View Public Site
             </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border/40 flex items-center justify-between px-8 shrink-0 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-secondary rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">Dashboard</span>
          <div className="w-10 h-10 bg-secondary rounded-full overflow-hidden">
             <img src="https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
          </div>
        </header>

        {/* Dynamic Section Rendering */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/messages" element={<MessageManager />} />
              <Route path="/projects" element={<ProjectManager />} />
              <Route path="/bio" element={<BioManager />} />
              <Route path="/skills" element={<SkillManager />} />
              <Route path="/experience" element={<ExperienceManager />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};
