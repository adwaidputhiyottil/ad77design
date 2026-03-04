import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProjectCard } from '../../components/ui/ProjectCard';

/**
 * Projects Page
 * Displays a grid of all non-hidden projects.
 * Includes category filtering chips.
 */

const CATEGORIES = ['All', 'Sports', 'Poster', 'Logo', 'Brand Identity', 'Illustration', 'Motion'];

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('is_hidden', false)
          .order('date', { ascending: false });
        
        if (data) {
          setProjects(data);
          setFilteredProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category.toLowerCase() === category.toLowerCase()));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="text-center md:text-left mb-16 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-black text-primary mb-6 tracking-tighter">
          My <span className="text-muted-foreground/40 italic">Works</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Explore a curated selection of visual solutions across sports design, 
          brand identity, and artistic illustrations.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-2 p-2 bg-secondary rounded-2xl border border-border/40 min-w-max">
          <Filter className="w-4 h-4 ml-2 text-muted-foreground" />
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleFilter(category)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCategory === category 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-white hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] bg-secondary animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      ) : (
        <div className="py-40 text-center bg-secondary/30 rounded-[3rem] border-2 border-dashed border-border">
          <Palette className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-primary mb-2">No projects found</h3>
          <p className="text-muted-foreground">Try clearing your filters or check back later.</p>
        </div>
      )}
    </div>
  );
};
