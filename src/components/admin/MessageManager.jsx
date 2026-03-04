import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Trash2, 
  User, 
  Clock, 
  MessageSquare, 
  Search,
  ChevronRight,
  Inbox
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

/**
 * MessageManager component
 * Admin view to read and manage contact form submissions.
 */
export const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-primary tracking-tighter mb-2">Inquiry Inbox</h1>
        <p className="text-muted-foreground">Manage messages sent via your contact form.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Messages List */}
        <div className="xl:col-span-1 bg-white rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden h-[600px] flex flex-col">
          <div className="p-6 border-b border-border/40 bg-secondary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={18} className="text-primary" />
              <span className="font-bold">Messages ({messages.length})</span>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-secondary/50 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                   <MessageSquare size={32} />
                </div>
                <p className="text-muted-foreground italic text-sm">No messages yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-left p-6 transition-all hover:bg-secondary/20 flex gap-4 ${
                      selectedMessage?.id === msg.id ? 'bg-secondary/40' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <User size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{msg.name}</p>
                      <p className="text-xs text-muted-foreground truncate mb-1">{msg.subject}</p>
                      <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="xl:col-span-2 bg-white rounded-[3rem] border border-border/40 shadow-sm min-h-[600px] flex flex-col overflow-hidden">
          {selectedMessage ? (
            <>
              <div className="p-10 border-b border-border/40 flex justify-between items-start bg-secondary/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <User size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tighter leading-none">{selectedMessage.name}</h2>
                      <p className="text-muted-foreground font-medium mt-1">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                     <span className="px-4 py-1.5 bg-secondary text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                        <Clock size={12} />
                        {new Date(selectedMessage.created_at).toLocaleString()}
                     </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="p-4 bg-destructive/10 text-destructive rounded-2xl hover:bg-destructive hover:text-white transition-all shadow-sm"
                  title="Delete message"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="p-10 flex-grow space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Subject</p>
                  <p className="text-xl font-bold text-primary">{selectedMessage.subject || 'No subject'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Message Content</p>
                  <div className="bg-secondary/30 p-8 rounded-[2rem] text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedMessage.message}
                  </div>
                </div>
                <div className="pt-8">
                   <a 
                     href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                     className="inline-flex items-center gap-3 px-8 h-14 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                   >
                     <Mail size={18} />
                     Reply to Inquiry
                   </a>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-20 space-y-6">
              <div className="w-24 h-24 bg-secondary rounded-[2.5rem] flex items-center justify-center text-muted-foreground/20">
                <Mail size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Select a message to read</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2">New inquiries from your contact form will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
