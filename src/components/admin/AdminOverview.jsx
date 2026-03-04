import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, ArrowUpRight, Palette, Layers, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * AdminOverview component
 * Displays high-level stats and recent activity for the administrator.
 */

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalSkills: 0,
    totalExperience: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
       try {
         const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
         const { count: featuredCount } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('show_on_homepage', true);
         const { count: skillsCount } = await supabase.from('skills').select('*', { count: 'exact', head: true });
         const { count: expCount } = await supabase.from('experience').select('*', { count: 'exact', head: true });

         setStats({
           totalProjects: projectsCount || 0,
           featuredProjects: featuredCount || 0,
           totalSkills: skillsCount || 0,
           totalExperience: expCount || 0
         });
       } catch (error) {
         console.error('Error fetching stats:', error);
       }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Projects', value: stats.totalProjects, icon: Layers, color: 'bg-blue-500' },
    { name: 'Featured Works', value: stats.featuredProjects, icon: Star, color: 'bg-amber-500' },
    { name: 'Core Skills', value: stats.totalSkills, icon: Palette, color: 'bg-purple-500' },
    { name: 'Experience Entries', value: stats.totalExperience, icon: Users, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tighter mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Snapshot of your portfolio data and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-border/40 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.name}</p>
            <p className="text-4xl font-black text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-border/40">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
               <Eye className="w-5 h-5 text-primary" />
               Quick Tips
            </h2>
            <div className="space-y-6">
               {[
                 "Keep your featured projects updated for the best first impression.",
                 "Ensure your bio accurately reflects your current primary niche (Sports Design).",
                 "Review and add new skills as you master new design tools."
               ].map((tip, i) => (
                 <div key={i} className="flex gap-4 p-4 bg-secondary/30 rounded-2xl border border-border/20">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs shrink-0">{i+1}</span>
                    <p className="text-sm text-primary/80 leading-relaxed font-medium">{tip}</p>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="bg-primary p-12 rounded-[3.5rem] flex flex-col justify-center items-center text-center text-primary-foreground relative overflow-hidden group">
            <div className="z-10 relative">
              <Star className="w-12 h-12 mb-6 opacity-30 mx-auto" />
              <h3 className="text-2xl font-black mb-6">Need Help?</h3>
              <p className="text-primary-foreground/50 mb-8 text-sm">Facing issues with the dashboard? Check the documentation.</p>
              <button className="px-8 py-3.5 bg-white text-primary rounded-xl font-bold text-sm tracking-tighter hover:bg-white/90">
                 Read Guide
              </button>
            </div>
            {/* Background sparkle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
         </div>
      </div>
    </div>
  );
};
