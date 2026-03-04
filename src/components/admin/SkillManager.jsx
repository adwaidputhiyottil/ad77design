import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, Wrench, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

/**
 * SkillManager component
 * Allows the admin to Add, Edit, and Delete skills.
 */

export const SkillManager = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await supabase.from('skills').select('*').order('created_at');
      if (data) setSkills(data);
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([{ skill_name: newSkill.trim() }])
        .select();

      if (error) throw error;
      setSkills([...skills, ...data]);
      setNewSkill('');
      toast.success('Skill added');
    } catch (error) {
      toast.error(error.message || 'Duplicate skill or error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      setSkills(skills.filter(s => s.id !== id));
      toast.success('Skill deleted');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill.id);
    setEditValue(skill.skill_name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleUpdate = async (id) => {
    if (!editValue.trim()) return;
    try {
      const { error } = await supabase
        .from('skills')
        .update({ skill_name: editValue.trim() })
        .eq('id', id);

      if (error) throw error;
      setSkills(skills.map(s => s.id === id ? { ...s, skill_name: editValue.trim() } : s));
      setEditingId(null);
      toast.success('Skill updated');
    } catch (error) {
      toast.error('Failed to update skill');
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter mb-2">Technical Skills</h1>
          <p className="text-muted-foreground">Manage your design arsenal and tools.</p>
        </div>
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAdd} className="bg-white p-8 rounded-[2.5rem] border border-border/40 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. Cinema 4D, Typography, Octane Render"
            className="w-full pl-12 pr-4 h-14 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
          />
        </div>
        <Button disabled={!newSkill.trim()} className="h-14 px-8 rounded-2xl font-black gap-2">
          <Plus className="w-5 h-5" />
          Add Skill
        </Button>
      </form>

      {/* Skills Grid/List */}
      <div className="bg-white rounded-[3rem] p-4 md:p-8 border border-border/40 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {skills.map((skill) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                  editingId === skill.id ? 'border-primary ring-2 ring-primary/10' : 'border-border/40 hover:bg-secondary/50'
                }`}
              >
                {editingId === skill.id ? (
                  <div className="flex items-center gap-2 flex-grow mr-2">
                    <input
                      autoFocus
                      type="text"
                      className="w-full bg-transparent border-none focus:ring-0 p-0 font-bold"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <div className="flex shrink-0">
                       <button onClick={() => handleUpdate(skill.id)} className="p-1.5 text-primary hover:bg-white rounded-lg"><Save className="w-4 h-4" /></button>
                       <button onClick={cancelEdit} className="p-1.5 text-muted-foreground hover:bg-white rounded-lg"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-primary">{skill.skill_name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => startEdit(skill)} className="p-2 text-muted-foreground hover:text-primary hover:bg-white rounded-xl transition-colors"><Edit3 className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(skill.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-white rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {!loading && skills.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground italic">
               No skills added yet. Start by adding your first skill above.
            </div>
          )}

          {loading && [1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-secondary animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
