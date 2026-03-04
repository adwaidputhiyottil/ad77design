import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Palette, PenTool, Layout as LayoutIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

/**
 * Project Details Page
 * Dynamic page showing full information about a specific project.
 * Includes cover image, gallery, description, and tools used.
 */

export const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        if (data) setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-black mb-4">Project Not Found</h2>
      <Link to="/projects">
        <Button variant="secondary">Back to Projects</Button>
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Back Button */}
      <Link to="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10 min-w-0"
        >
          <div className="min-w-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary font-bold text-xs uppercase tracking-widest mb-6">
              {project.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-primary leading-tight mb-8 tracking-tighter break-words">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t border-border pt-10">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold mb-4 uppercase text-xs tracking-widest">
                <Calendar className="w-4 h-4" />
                Date
              </div>
              <p className="text-muted-foreground">
                {project.date ? new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Ongoing'}
              </p>
            </div>
            {project.external_link && (
              <div>
                <div className="flex items-center gap-2 text-primary font-bold mb-4 uppercase text-xs tracking-widest">
                  <ExternalLink className="w-4 h-4" />
                  Live View
                </div>
                <a 
                  href={project.external_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline font-medium"
                >
                  Visit link
                </a>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-primary font-bold mb-6 uppercase text-xs tracking-widest">
              <PenTool className="w-4 h-4" />
              Tools Used
            </div>
            <div className="flex flex-wrap gap-3">
              {project.tools?.map((tool, idx) => (
                <span key={idx} className="px-5 py-2.5 bg-secondary text-primary font-bold text-sm rounded-xl">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Primary Image */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <img 
            src={project.cover_image || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Gallery Section */}
      {project.gallery_images && project.gallery_images.length > 0 && (
        <section className="space-y-12">
          <div className="flex items-center gap-3">
            <LayoutIcon className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">Gallery View</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.gallery_images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[2.5rem] overflow-hidden border border-border/40 shadow-sm"
              >
                <img 
                  src={img} 
                  alt={`${project.title} gallery ${idx + 1}`} 
                  className="w-full h-auto hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Next Project Footer */}
      <div className="mt-24 pt-20 border-t border-border flex justify-center">
         <Link to="/projects">
           <Button variant="secondary" size="lg" className="rounded-2xl gap-3">
             <ArrowLeft className="w-5 h-5" />
             Back to Portfolio
           </Button>
         </Link>
      </div>
    </div>
  );
};
