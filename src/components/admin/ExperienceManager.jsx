import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, Briefcase, Calendar, Building, AlignLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

/**
 * ExperienceManager component
 * Manages professional experience entries.
 */

export const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    year: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data } = await supabase.from('experience').select('*').order('year', { ascending: false });
      if (data) setExperiences(data);
    } catch (error) {
      toast.error('Failed to fetch experience');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('experience').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success('Experience updated');
      } else {
        const { data, error } = await supabase.from('experience').insert([formData]).select();
        if (error) throw error;
        setExperiences([data[0], ...experiences]);
        toast.success('Experience added');
      }
      resetForm();
      fetchExperiences();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await supabase.from('experience').delete().eq('id', id);
      setExperiences(experiences.filter(exp => exp.id !== id));
      toast.success('Experience removed');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (exp) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      organization: exp.organization,
      description: exp.description,
      year: exp.year
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ title: '', organization: '', description: '', year: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter mb-2">Professional Journey</h1>
          <p className="text-muted-foreground">Manage your work history and achievements.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-2xl px-6 h-14 font-black gap-2">
            <Plus className="w-5 h-5" />
            Add Experience
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 md:p-12 rounded-[3rem] border border-border/40 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-primary/60 ml-1">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      className="w-full pl-12 pr-4 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Graphic Designer"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-primary/60 ml-1">Organization</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      className="w-full pl-12 pr-4 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Design Studio X"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-primary/60 ml-1">Year / Period</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      className="w-full pl-12 pr-4 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g. 2022 - Present"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black uppercase tracking-widest text-primary/60 ml-1">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-6 w-5 h-5 text-muted-foreground" />
                  <textarea
                    required
                    rows={4}
                    className="w-full pl-12 p-6 bg-secondary border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 font-medium leading-relaxed resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your role and key accomplishments..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border/40">
                <Button type="submit" className="rounded-2xl px-10 h-16 font-black gap-2">
                   <Save className="w-5 h-5" />
                   {editingId ? 'Update Entry' : 'Add to Journey'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-2xl px-10 h-16">
                   Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience List */}
      <div className="space-y-6">
        {loading ? (
           <div className="h-40 bg-secondary animate-pulse rounded-[3rem]" />
        ) : experiences.map((exp) => (
          <div key={exp.id} className="bg-white p-8 md:p-10 rounded-[3rem] border border-border/40 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-primary tracking-tighter">{exp.title}</h3>
                <span className="px-5 py-1.5 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest text-primary/60">{exp.year}</span>
              </div>
              <p className="text-primary/70 font-bold flex items-center gap-2">
                <Building className="w-4 h-4" />
                {exp.organization}
              </p>
              <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">{exp.description}</p>
            </div>
            <div className="flex gap-2 shrink-0 self-end md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="icon" onClick={() => startEdit(exp)} className="w-12 h-12 rounded-xl">
                 <Edit3 className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={() => handleDelete(exp.id)} className="w-12 h-12 rounded-xl text-destructive hover:bg-destructive/10">
                 <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {!loading && experiences.length === 0 && !isAdding && (
           <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
              <p className="text-muted-foreground italic">No experience entries found. Click add to begin.</p>
           </div>
        )}
      </div>
    </div>
  );
};
