import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, User, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

/**
 * Contact Page
 * Features a modern contact form with Supabase integration.
 */
export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('messages').insert([formData]);
      
      if (error) throw error;

      setIsSuccess(true);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <span className="px-5 py-2 bg-secondary rounded-full text-xs font-black uppercase tracking-[0.2em] text-primary/60 inline-block mb-6">
                  Get in Touch
                </span>
                <h1 className="text-6xl md:text-7xl font-black text-primary tracking-tighter leading-[0.9]">
                  Let's create <br />
                  <span className="text-primary/30">something</span> <br />
                  meaningful.
                </h1>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                Have a sports project, a brand identity, or just a cool idea? I'm always open to new opportunities and collaborations.
              </p>

              <div className="space-y-4 pt-8">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-border/40 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Direct Email</p>
                    <p className="text-lg font-bold text-primary">adwaidpc0704@gmail.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-border/40 shadow-2xl relative"
            >
              {isSuccess ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-primary tracking-tighter">Message Received!</h2>
                    <p className="text-muted-foreground mt-2">Thanks for reaching out, Adwaid will get back to you soon.</p>
                  </div>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-2xl">
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                          required
                          type="text"
                          className="w-full pl-12 pr-6 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                          placeholder="e.g. John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                          required
                          type="email"
                          className="w-full pl-12 pr-6 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Subject</label>
                    <input
                      required
                      type="text"
                      className="w-full px-6 h-16 bg-secondary border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      placeholder="What project are you thinking of?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full p-6 bg-secondary border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 font-medium leading-relaxed resize-none"
                      placeholder="Tell me more about your requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-18 rounded-3xl text-lg font-black gap-3 shadow-xl shadow-primary/10"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 animate-pulse">Sending...</span>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
