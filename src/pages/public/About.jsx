import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Briefcase, Award, Star, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

/**
 * About Page
 * Displays detailed bio, skills, and professional experience.
 */

export const About = () => {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: p } = await supabase.from('profile').select('*').single();
        const { data: s } = await supabase.from('skills').select('*').order('created_at');
        const { data: e } = await supabase.from('experience').select('*').order('year', { ascending: false });
        
        if (p) setProfile(p);
        if (s) setSkills(s);
        if (e) setExperience(e);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pb-32">
      {/* Header Section */}
      <section className="bg-secondary/30 pt-32 pb-60 -mb-40 rounded-b-[5rem]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-40 h-40 rounded-full overflow-hidden bg-primary mx-auto mb-8 border-8 border-white shadow-xl"
            >
              <img 
                 src="/logo.png" 
                 alt="Adwaid" 
                 className="w-full h-full object-cover"
              />
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black text-primary mb-6 tracking-tighter">
              I'm <span className="text-muted-foreground/40 italic">Adwaid</span>
            </h1>
            <p className="text-2xl text-primary font-bold uppercase tracking-widest opacity-60">
              Graphic Designer • Sports Specialist
            </p>
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-primary/5 p-8 md:p-20 border border-border/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Left Column: Bio */}
            <div className="lg:col-span-7 space-y-12">
              <div>
                <div className="flex items-center gap-3 text-primary mb-6">
                  <User className="w-6 h-6" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter">My Story</h2>
                </div>
                <div className="text-xl text-muted-foreground leading-relaxed space-y-6">
                  <p>
                    {profile?.bio || "Based in India, I'm a graphic designer with a burning passion for sports aesthetics and branding. I specialize in creating visual narratives that capture the raw energy and competitive spirit of athletes and teams."}
                  </p>
                  <p>
                    With years of experience handling diverse design requirements—from high-impact social media posters to complete brand identities—I've developed a signature style that balances modern minimalism with dynamic energy.
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center gap-3 text-primary mb-10">
                  <Briefcase className="w-6 h-6" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Professional Journey</h2>
                </div>
                <div className="space-y-8">
                  {experience.length > 0 ? experience.map((exp) => (
                    <div key={exp.id} className="relative pl-10 border-l-2 border-primary/10 pb-4">
                       <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
                       <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <h3 className="text-xl font-bold text-primary">{exp.title}</h3>
                          <span className="px-4 py-1.5 bg-secondary rounded-full text-xs font-black text-primary">{exp.year}</span>
                       </div>
                       <p className="text-primary/60 font-medium mb-3">{exp.organization}</p>
                       <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                    </div>
                  )) : (
                    <div className="p-8 border-2 border-dashed border-border rounded-3xl text-center">
                      <p className="text-muted-foreground">Experience details listed on request.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Skills */}
            <div className="lg:col-span-5 space-y-12">
              <div className="p-10 bg-secondary/50 rounded-[3rem] border border-border/40">
                <div className="flex items-center gap-3 text-primary mb-8">
                  <Award className="w-6 h-6" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Technical Arsenal</h2>
                </div>
                <div className="space-y-6">
                   {(skills.length > 0 ? skills : [
                     { skill_name: 'Adobe Photoshop' },
                     { skill_name: 'Adobe Illustrator' },
                     { skill_name: 'After Effects' },
                     { skill_name: 'Sports Graphic Design' },
                     { skill_name: 'Branding & Identity' },
                     { skill_name: 'Digital Drawing' }
                   ]).map((skill, idx) => (
                     <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold uppercase tracking-wider">
                           <span>{skill.skill_name}</span>
                        </div>
                        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: '100%' }}
                             transition={{ duration: 1, delay: idx * 0.1 }}
                             className="h-full bg-primary rounded-full" 
                           />
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="p-10 bg-primary text-primary-foreground rounded-[3rem] relative overflow-hidden">
                <div className="relative z-10">
                  <Star className="w-10 h-10 mb-6 text-white/50" />
                  <h3 className="text-3xl font-black mb-6 leading-tight">Let's work <br/>Together</h3>
                  <p className="text-primary-foreground/70 mb-8 leading-relaxed">
                    I'm currently open for new projects and long-term partnerships.
                  </p>
                  <Link to="/contact">
                    <Button as="span" className="bg-white text-primary hover:bg-white/90 w-full rounded-2xl h-14">
                       Get in Touch
                    </Button>
                  </Link>
                </div>
                {/* Decorative circle */}
                <div className="absolute top-[-50px] right-[-50px] w-60 h-60 bg-white/5 rounded-full blur-3xl text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
