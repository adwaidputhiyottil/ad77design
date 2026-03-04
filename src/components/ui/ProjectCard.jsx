import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Palette } from 'lucide-react';

/**
 * ProjectCard component
 * Displays a summary of a project with a clean, grid-focused design.
 * Features hover effects and responsive layouts.
 */

export const ProjectCard = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={project.cover_image || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-block px-3 py-1 bg-secondary text-primary text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
              {project.category}
            </span>
            <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
              {project.title}
            </h3>
          </div>
          <Link
            to={`/projects/${project.id}`}
            className="p-3 bg-primary text-primary-foreground rounded-2xl transform transition-all duration-300 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex items-center justify-center"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Tools Preview */}
        {project.tools && project.tools.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tools.slice(0, 3).map((tool, idx) => (
              <span key={idx} className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Palette className="w-3 h-3" />
                {tool}
              </span>
            ))}
            {project.tools.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{project.tools.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
