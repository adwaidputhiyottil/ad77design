import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Palette, Mail, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProjectCard } from '../../components/ui/ProjectCard';
import { Button } from '../../components/ui/Button';

/**
 * Home Page
 * Features Hero section, Featured Projects, Skills preview, and About preview.
 * Uses Framer Motion for entrance animations.
 */

export const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase.from('profile').select('*').single();
        if (profileData) setProfile(profileData);

        // Fetch featured projects (up to 3)
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('show_on_homepage', true)
          .eq('is_hidden', false)
          .order('created_at', { ascending: false })
          .limit(3);
        if (projectsData) setFeaturedProjects(projectsData);

        // Fetch skills (up to 6 for preview)
        const { data: skillsData } = await supabase.from('skills').select('*').limit(6);
        if (skillsData) setSkills(skillsData);

      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-12 md:space-y-16 pb-32">
      {/* Hero Section */}
      <section className="relative pt-12 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -z-10 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left md:max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary font-bold text-xs uppercase tracking-widest mb-6">
              {profile?.headline || 'Graphic Designer | Sports Design'}
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-primary leading-[1.1] mb-8 tracking-tighter">
              Crafting Visual <span className="text-muted-foreground/40 italic">Excellence</span> in Sports & Design
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
              I'm Adwaid, a designer specialized in <span className="text-primary font-semibold">Sports Graphic Design</span>. 
              Helping brands stand out through dynamic visuals and impactful branding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/projects">
                <Button as="span" size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl group">
                  View My Work
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button as="span" size="lg" variant="secondary" className="w-full sm:w-auto h-16 px-10 text-lg rounded-2xl">
                  Contact Me
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">Featured Work</h2>
            <p className="text-muted-foreground">A select collection of projects demonstrating my expertise in sports graphics and branding.</p>
          </div>
          <Link to="/projects" className="text-primary font-bold group flex items-center gap-1">
            View all projects
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] bg-secondary animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground">More projects coming soon.</p>
          </div>
        )}
      </section>

      {/* Skills & Services Section */}
      <section className="bg-secondary/30 py-16 md:py-24 rounded-[4rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-primary mb-6">Core Skills</h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                From high-speed sports graphics to minimalist branding, I utilize industry-leading 
                tools to bring your vision to life.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {skills.length > 0 ? skills.map((skill) => (
                  <div key={skill.id} className="p-4 bg-white rounded-2xl border border-border/40 shadow-sm flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-semibold text-sm">{skill.skill_name}</span>
                  </div>
                )) : [
                  'Photoshop', 'Illustrator', 'After Effects', 'Sports Design', 'Branding', 'Digital Drawing'
                ].map((s) => (
                  <div key={s} className="p-4 bg-white rounded-2xl border border-border/40 shadow-sm flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-semibold text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 -rotate-3 hover:rotate-0 transition-transform duration-500">
               <div className="space-y-4">
                  <div className="aspect-square bg-secondary/60 backdrop-blur-sm rounded-3xl border border-border/40 p-8 flex flex-col justify-end hover:bg-white transition-colors duration-500">
                    <Palette className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-bold">Sports Design</h4>
                  </div>
                  <div className="aspect-[3/4] bg-primary rounded-3xl p-8 flex flex-col justify-end text-primary-foreground">
                    <User className="w-8 h-8 mb-4 opacity-50" />
                    <h4 className="font-bold">Brand Identity</h4>
                  </div>
               </div>
               <div className="space-y-4 pt-12">
                  <div className="aspect-[3/4] bg-secondary/60 backdrop-blur-sm rounded-3xl border border-border/40 p-8 flex flex-col justify-end hover:bg-white transition-colors duration-500">
                    <Mail className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-bold">Consultation</h4>
                  </div>
                  <div className="aspect-square bg-secondary/60 backdrop-blur-sm rounded-3xl border border-border/40 p-8 flex flex-col justify-end hover:bg-white transition-colors duration-500">
                    <Palette className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-bold">Illustrations</h4>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/2 aspect-square rounded-[3rem] overflow-hidden bg-secondary relative">
             <img 
               src="/logo.png" 
               alt="Portfolio Owner" 
               className="w-full h-full object-cover transition-all duration-700"
             />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-8">Passionate about <br/>Great Design</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {profile?.bio || 'With a focus on sports aesthetics, I create designs that capture the energy and intensity of the game. My process is deeply collaborative, ensuring every pixel aligns with your brand strategy.'}
            </p>
            <Link to="/about">
              <Button as="span" variant="outline" size="lg" className="rounded-2xl px-12">
                Read My Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary text-primary-foreground rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-[80px]" />
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Ready to start a project?</h2>
          <p className="text-primary-foreground/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            I'm currently available for freelance work and collaborations. Let's create something together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button as="span" size="lg" className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl h-16 px-12 text-lg">
                Send an Email
              </Button>
            </Link>
            <a href="https://www.instagram.com/ad77design?igsh=MWh6Zjk2MjlwdDU3bg==" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button as="span" variant="outline" size="lg" className="w-full border-white/20 text-white hover:bg-white/10 rounded-2xl h-16 px-12 text-lg">
                Follow on Instagram
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
