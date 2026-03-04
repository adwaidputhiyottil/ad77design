import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Image as ImageIcon, 
  Link as LinkIcon,
  Tag,
  PenTool,
  Calendar,
  Home,
  EyeOff,
  Eye,
  Settings2,
  Images,
  Upload,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';
import { useRef } from 'react';

/**
 * ProjectManager component
 * Full CRUD for projects with homepage visibility and hidden toggles.
 */

export const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  /**
   * Helper to upload file to Supabase Storage
   */
  const handleFileUpload = async (e, mode = 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('project-assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('project-assets')
        .getPublicUrl(filePath);

      if (mode === 'cover') {
        setFormData(prev => ({ ...prev, cover_image: publicUrl }));
        toast.success('Cover image uploaded');
      } else {
        setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, publicUrl] }));
        toast.success('Gallery image added');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Ensure "project-assets" bucket exists.');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Sports',
    description: '',
    tools: [],
    cover_image: '',
    gallery_images: [],
    date: new Date().toISOString().split('T')[0],
    show_on_homepage: false,
    is_hidden: false,
    external_link: ''
  });

  const [toolInput, setToolInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTool = () => {
    if (!toolInput.trim()) return;
    setFormData({ ...formData, tools: [...formData.tools, toolInput.trim()] });
    setToolInput('');
  };

  const removeTool = (idx) => {
    setFormData({ ...formData, tools: formData.tools.filter((_, i) => i !== idx) });
  };

  const handleAddGalleryImage = () => {
    if (!galleryInput.trim()) return;
    setFormData({ ...formData, gallery_images: [...formData.gallery_images, galleryInput.trim()] });
    setGalleryInput('');
  };

  const removeGalleryImage = (idx) => {
    setFormData({ ...formData, gallery_images: formData.gallery_images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('projects').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success('Project updated');
      } else {
        const { error } = await supabase.from('projects').insert([formData]);
        if (error) throw error;
        toast.success('Project created');
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const toggleStatus = async (project, field) => {
    try {
      const newVal = !project[field];
      const { error } = await supabase.from('projects').update({ [field]: newVal }).eq('id', project.id);
      if (error) throw error;
      setProjects(projects.map(p => p.id === project.id ? { ...p, [field]: newVal } : p));
      toast.success(`Updated ${field}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project forever?')) return;
    try {
      await supabase.from('projects').delete().eq('id', id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      category: p.category,
      description: p.description,
      tools: p.tools || [],
      cover_image: p.cover_image || '',
      gallery_images: p.gallery_images || [],
      date: p.date || new Date().toISOString().split('T')[0],
      show_on_homepage: p.show_on_homepage || false,
      is_hidden: p.is_hidden || false,
      external_link: p.external_link || ''
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Sports',
      description: '',
      tools: [],
      cover_image: '',
      gallery_images: [],
      date: new Date().toISOString().split('T')[0],
      show_on_homepage: false,
      is_hidden: false,
      external_link: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter mb-2">Project Repository</h1>
          <p className="text-muted-foreground">Showcase your best design works to the world.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-2xl px-8 h-14 font-black gap-2">
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-border/40 shadow-2xl relative z-10"
          >
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                  <Settings2 className="w-6 h-6 text-primary" />
                  {editingId ? 'Edit Project' : 'Create New Project'}
               </h2>
               <button onClick={resetForm} className="p-2 hover:bg-secondary rounded-full">
                  <X className="w-6 h-6" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
                 <div className="space-y-3">
                   <label className="text-xs uppercase tracking-widest text-primary/50 ml-1">Project Title</label>
                   <input
                     required
                     className="w-full px-6 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20"
                     value={formData.title}
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     placeholder="e.g. World Cup 2026 Visuals"
                   />
                 </div>
                 <div className="space-y-3">
                   <label className="text-xs uppercase tracking-widest text-primary/50 ml-1">Category</label>
                   <select
                     className="w-full px-6 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 appearance-none"
                     value={formData.category}
                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                   >
                      <option value="Sports">Sports</option>
                      <option value="Poster">Poster</option>
                      <option value="Brand Identity">Brand Identity</option>
                      <option value="Illustration">Illustration</option>
                      <option value="Motion">Motion</option>
                   </select>
                 </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                 <label className="text-xs uppercase tracking-widest text-primary/50 ml-1">Detailed Description</label>
                 <textarea
                   required
                   rows={5}
                   className="w-full p-8 bg-secondary border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 leading-relaxed font-medium"
                   value={formData.description}
                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                   placeholder="Describe requested goals, process, and final outcome..."
                 />
              </div>

              {/* Media Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
                 <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-primary/50 ml-1 flex items-center gap-2">
                       <ImageIcon className="w-4 h-4" /> Cover Image URL
                    </label>
                    <div className="relative group/field">
                      <input
                        required
                        className="w-full pl-6 pr-16 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20"
                        value={formData.cover_image}
                        onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm hover:text-primary transition-all disabled:opacity-50"
                        title="Upload from device"
                      >
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      </button>
                      <input
                        type="file"
                        ref={coverInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'cover')}
                      />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-primary/50 ml-1 flex items-center gap-2">
                       <LinkIcon className="w-4 h-4" /> External Link (Optional)
                    </label>
                    <input
                      className="w-full px-6 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20"
                      value={formData.external_link}
                      onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                      placeholder="https://behance.net/..."
                    />
                 </div>
              </div>

              {/* Tools Tag System */}
              <div className="space-y-4">
                 <label className="text-xs uppercase tracking-widest text-primary/50 ml-1 flex items-center gap-2">
                    <PenTool className="w-4 h-4" /> Tools & Software
                 </label>
                 <div className="flex gap-2">
                    <input
                      className="flex-grow px-6 h-14 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      value={toolInput}
                      onChange={(e) => setToolInput(e.target.value)}
                      placeholder="Press add or Enter..."
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                    />
                    <Button type="button" onClick={handleAddTool} className="h-14 px-6 rounded-2xl">Add</Button>
                 </div>
                 <div className="flex flex-wrap gap-2 pt-2">
                    {formData.tools.map((tool, idx) => (
                      <span key={idx} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-2">
                        {tool}
                        <button type="button" onClick={() => removeTool(idx)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                 </div>
              </div>

              {/* Gallery Images List */}
              <div className="space-y-4">
                 <label className="text-xs uppercase tracking-widest text-primary/50 ml-1 flex items-center gap-2">
                    <Images className="w-4 h-4" /> Gallery Images
                 </label>
                 <div className="flex gap-2">
                    <div className="relative flex-grow group/field">
                      <input
                        className="w-full pl-6 pr-16 h-14 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                        value={galleryInput}
                        onChange={(e) => setGalleryInput(e.target.value)}
                        placeholder="Add image URL or upload..."
                      />
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm hover:text-primary transition-all disabled:opacity-50"
                        title="Upload from device"
                      >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      </button>
                      <input
                        type="file"
                        ref={galleryInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'gallery')}
                      />
                    </div>
                    <Button type="button" onClick={handleAddGalleryImage} className="h-14 px-6 rounded-2xl">Add</Button>
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {formData.gallery_images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border group/img">
                         <img src={img} className="w-full h-full object-cover" />
                         <button 
                           type="button" 
                           onClick={() => removeGalleryImage(idx)}
                           className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-10 bg-secondary/30 p-8 rounded-[2rem]">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                       type="checkbox" 
                       className="w-6 h-6 rounded-lg text-primary focus:ring-primary/20"
                       checked={formData.show_on_homepage}
                       onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                    />
                    <span className="font-bold text-primary group-hover:text-primary/70 transition-colors">Show on Homepage</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                       type="checkbox" 
                       className="w-6 h-6 rounded-lg text-primary focus:ring-primary/20"
                       checked={formData.is_hidden}
                       onChange={(e) => setFormData({ ...formData, is_hidden: e.target.checked })}
                    />
                    <span className="font-bold text-primary group-hover:text-primary/70 transition-colors">Hide Project</span>
                 </label>
                 <div className="flex items-center gap-3 ml-auto">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <input 
                      type="date"
                      className="bg-transparent border-none font-bold text-primary focus:ring-0"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                 </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="rounded-2xl px-12 h-16 text-lg font-black gap-2">
                  <Save className="w-5 h-5" />
                  {editingId ? 'Save Project' : 'Publish Project'}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={resetForm} className="rounded-2xl px-12 h-16 text-lg">
                  Discard
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Display Table/List */}
      <div className="bg-white rounded-[3.5rem] border border-border/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-black text-primary/50">Project</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-black text-primary/50">Category</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-black text-primary/50">Status</th>
                <th className="px-8 py-6 text-xs uppercase tracking-widest font-black text-primary/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-12 rounded-xl bg-secondary overflow-hidden shrink-0">
                          <img src={p.cover_image} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-black text-primary truncate max-w-[200px]">{p.title}</p>
                          <p className="text-[10px] text-muted-foreground font-bold">{new Date(p.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest">
                       {p.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex gap-3">
                        <button 
                          onClick={() => toggleStatus(p, 'show_on_homepage')}
                          className={`p-2 rounded-xl transition-all ${p.show_on_homepage ? 'bg-amber-100 text-amber-600' : 'bg-secondary text-muted-foreground opacity-40 hover:opacity-100'}`}
                          title="Toggle Homepage"
                        >
                           <Home className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleStatus(p, 'is_hidden')}
                          className={`p-2 rounded-xl transition-all ${p.is_hidden ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground opacity-40 hover:opacity-100'}`}
                          title="Toggle Hidden"
                        >
                           {p.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex gap-2 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(p)} className="p-3 bg-white border border-border/40 rounded-xl hover:text-primary hover:shadow-md transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-3 bg-white border border-border/40 rounded-xl hover:text-destructive hover:shadow-md transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && projects.length === 0 && (
             <div className="py-20 text-center text-muted-foreground italic">No projects found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
