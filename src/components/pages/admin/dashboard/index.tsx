'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Plus,
  Calendar,
  Image as ImageIcon,
  X,
  Loader,
  Check,
  ArrowLeft,
  ArrowRight,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from './DashboardHeader';
import AdminHomeView from './HomeView';
import ContactsView from './ContactsView';
import ProjectsView from './ProjectsView';
import BlogsView from './BlogsView';
import PreparationView from './PreparationView';

export type View = 'home' | 'projects' | 'blogs' | 'contacts' | 'preparation';

export interface Contact {
  _id: string;
  name: string;
  contactValue: string;
  message: string;
  createdAt: string;
  replied: boolean;
  adminReply?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tags: string[];
  published: boolean;
  favourite: boolean;
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
  published: boolean;
  favourite: boolean;
  createdAt: string;
}

export interface Preparation {
  _id: string;
  topic: string;
  slug: string;
  title: string;
  excerpt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  messages: any[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>('preparation');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [preparations, setPreparations] = useState<Preparation[]>([]);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'project' | 'blog' | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentView !== 'home') {
      fetchData(currentView);
    }
  }, [currentView]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/status', {
        credentials: 'include',
      });
      const data = await res.json();

      if (!data.authenticated) {
        router.push('/get-access/login');
      } else {
        // Fetch initial data for the current view
        if (currentView !== 'home') {
          fetchData(currentView);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/get-access/login');
    }
  };

  const fetchData = async (view: View) => {
    setLoading(true);
    try {
      if (view === 'contacts') {
        const res = await fetch('/api/contact/admin', {
          credentials: 'include',
        });
        if (res.ok) setContacts(await res.json());
        else if (res.status === 401) router.push('/get-access/login');
      } else if (view === 'projects') {
        const res = await fetch('/api/projects?all=true', {
          credentials: 'include',
        });
        if (res.ok) setProjects(await res.json());
      } else if (view === 'blogs') {
        const res = await fetch('/api/blogs?all=true', {
          credentials: 'include',
        });
        if (res.ok) setBlogs(await res.json());
      } else if (view === 'preparation') {
        const res = await fetch('/api/interview-prep?all=true', {
          credentials: 'include',
        });
        if (res.ok) setPreparations(await res.json());
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/get-access/login');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = modalType === 'project' ? '/api/projects' : '/api/blogs';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        setFormData({});
        fetchData(currentView);
      } else if (res.status === 401) {
        router.push('/get-access/login');
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (contactId: string) => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/contact/${contactId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reply: replyText }),
      });
      if (res.ok) {
        setReplyText('');
        setSelectedContact(null);
        fetchData('contacts');
      } else if (res.status === 401) {
        router.push('/get-access/login');
      }
    } catch (error) {
      console.error('Reply error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, type: 'project' | 'blog', currentStatus: boolean) => {
    try {
      const endpoint = type === 'project' ? '/api/projects' : '/api/blogs';
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: id, published: !currentStatus }),
      });

      if (res.ok) {
        fetchData(currentView);
      } else if (res.status === 401) {
        router.push('/get-access/login');
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleTogglePreparationPublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/interview-prep', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: id, published: !currentStatus }),
      });

      if (res.ok) {
        fetchData(currentView);
      } else if (res.status === 401) {
        router.push('/get-access/login');
      }
    } catch (error) {
      console.error('Toggle preparation error:', error);
    }
  };

  const handleToggleFavourite = async (id: string, type: 'project' | 'blog', currentStatus: boolean) => {
    try {
      const endpoint = type === 'project' ? '/api/projects' : '/api/blogs';
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: id, favourite: !currentStatus }),
      });

      if (res.ok) {
        fetchData(currentView);
      } else if (res.status === 401) {
        router.push('/get-access/login');
      }
    } catch (error) {
      console.error('Toggle favourite error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground font-sans">
      {/* Header */}
      <DashboardHeader
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        setModalOpen={setModalOpen}
        setModalType={setModalType}
        setFormData={setFormData}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Home View - Card Navigation */}
        {currentView === 'home' && (
          <AdminHomeView setCurrentView={setCurrentView} />
        )}

        {/* Content Views */}
        {currentView !== 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Filters */}
            {(currentView === 'projects' || currentView === 'blogs' || currentView === 'preparation') && (
              <div className="flex items-center gap-4 mb-8">
                {['all', 'published', 'draft'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${filter === f
                      ? 'bg-accent text-black border-accent'
                      : 'bg-transparent text-foreground/60 border-white/10 hover:border-white/30'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {loading && !modalOpen && (
              <div className="flex justify-center py-20">
                <Loader className="animate-spin text-accent" size={32} />
              </div>
            )}

            {!loading && (
              <>
                {/* Contacts View */}
                {currentView === 'contacts' && (
                  <ContactsView contacts={contacts} setSelectedContact={setSelectedContact} selectedContact={selectedContact} handleReply={handleReply} replyText={replyText} setReplyText={setReplyText} />
                )}

                {/* Projects View */}
                {currentView === 'projects' && (
                  <ProjectsView projects={projects} filter={filter} handleTogglePublish={handleTogglePublish} handleToggleFavourite={handleToggleFavourite} />
                )}

                {/* Blogs View */}
                {currentView === 'blogs' && (
                  <BlogsView blogs={blogs} filter={filter} handleTogglePublish={handleTogglePublish} handleToggleFavourite={handleToggleFavourite} />
                )}

                {/* Preparation View */}
                {currentView === 'preparation' && (
                  <PreparationView preparations={preparations} filter={filter} handleTogglePublish={handleTogglePreparationPublish} />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-white/20  w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-background z-10">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold">Add New {modalType === 'project' ? 'Project' : 'Notelog'}</h3>
                  <div className="flex bg-white/5  p-1">
                    <button
                      onClick={() => setPreviewMode(false)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider  transition-colors ${!previewMode ? 'bg-accent text-black' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setPreviewMode(true)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider  transition-colors ${previewMode ? 'bg-accent text-black' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                      Preview
                    </button>
                  </div>
                </div>
                <button onClick={() => setModalOpen(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase text-foreground/50">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 p-3  focus:border-accent outline-none"
                        required
                      />
                    </div>

                    {modalType === 'project' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold mb-2 uppercase text-foreground/50">Live Link</label>
                          <input
                            type="url"
                            value={formData.link || ''}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3  focus:border-accent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-2 uppercase text-foreground/50">GitHub Link</label>
                          <input
                            type="url"
                            value={formData.github || ''}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3  focus:border-accent outline-none"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase text-foreground/50">Custom Date</label>
                      <input
                        type="datetime-local"
                        value={formData.createdAt || ''}
                        onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 p-3  focus:border-accent outline-none text-foreground-500" // Added text color class
                        style={{ colorScheme: 'dark' }} // Force dark calendar picker
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase text-foreground/50">Image</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/10  flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors overflow-hidden"
                      >
                        {formData.image ? (
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <ImageIcon className="mb-2 text-foreground/40" />
                            <span className="text-xs text-foreground/40">Click to upload</span>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-2 uppercase text-foreground/50">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="react, nextjs, design"
                        value={formData.tags ? formData.tags.join(', ') : ''}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map((t: string) => t.trim()) })}
                        className="w-full bg-white/5 border border-white/10 p-3  focus:border-accent outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 uppercase text-foreground/50">
                    {modalType === 'project' ? 'Description' : 'Excerpt'}
                  </label>
                  <textarea
                    value={modalType === 'project' ? formData.description : formData.excerpt || ''}
                    onChange={(e) => setFormData({ ...formData, [modalType === 'project' ? 'description' : 'excerpt']: e.target.value })}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 p-3  focus:border-accent outline-none"
                    required
                  />
                </div>

                {modalType === 'blog' && (
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase text-foreground/50">Content (Markdown)</label>
                    <textarea
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      className="w-full bg-white/5 border border-white/10 p-3  focus:border-accent outline-none font-mono text-sm"
                      required
                    />
                  </div>
                )}

                {previewMode && (
                  <div className="fixed inset-0 z-[70] bg-black overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-bold">Preview</h2>
                        <button onClick={() => setPreviewMode(false)} className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-accent">Close Preview</button>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <h1>{formData.title}</h1>
                        <p className="lead">{modalType === 'project' ? formData.description : formData.excerpt}</p>
                        {formData.image && <img src={formData.image} alt="Preview" className="w-full aspect-video object-cover my-8 " />}
                        {modalType === 'blog' && (
                          <div className="whitespace-pre-wrap font-mono text-sm bg-white/5 p-6  border border-white/10">
                            {formData.content}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 border border-white/10 font-bold  hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-accent text-black font-bold  hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
