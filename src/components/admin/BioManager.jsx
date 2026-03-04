import React, { useEffect, useState } from 'react';
import { Save, User, UserCircle, Type, TextQuote } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { toast } from 'react-hot-toast';

/**
 * BioManager component
 * Allows the admin to edit their public profile info (Name, Headline, Bio).
 */

export const BioManager = () => {
  const [profile, setProfile] = useState({
    name: '',
    headline: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('*').single();
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profile')
        .update({
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })
        .match({ id: profile.id || '00000000-0000-0000-0000-000000000000' });

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-8"><div className="h-20 bg-secondary rounded-3xl"/><div className="h-64 bg-secondary rounded-3xl"/></div>;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tighter mb-2">Profile & Bio Editor</h1>
        <p className="text-muted-foreground">Customize how you're introduced on the public site.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8 max-w-4xl">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-border/40 shadow-sm space-y-10">
          {/* Name & Headline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary/60 ml-1">
                <User className="w-4 h-4" /> Display Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-6 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-lg"
              />
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary/60 ml-1">
                <Type className="w-4 h-4" /> Headline / Niche
              </label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full px-6 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-lg"
              />
            </div>
          </div>

          {/* Bio Textarea */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary/60 ml-1">
              <TextQuote className="w-4 h-4" /> Full About Text
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={8}
              className="w-full p-8 bg-secondary border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 font-medium leading-relaxed resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg" className="rounded-2xl px-12 h-16 text-lg font-black gap-2">
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
