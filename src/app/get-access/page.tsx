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
import PreparationView from '@/components/pages/admin/dashboard/PreparationView';
import { IPreparation } from '@/services/api/preparation';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'home' | 'projects' | 'blogs' | 'contacts' | 'preparation';

interface Contact {
  _id: string;
  name: string;
  contactValue: string;
  message: string;
  createdAt: string;
  replied: boolean;
  adminReply?: string;
}

interface Project {
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

interface Blog {
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

export default function AdminDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>('home');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [preparations, setPreparations] = useState<IPreparation[]>([]);

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
        const res = await fetch('/api/interview-prep', {
          credentials: 'include',
        });
        console.log("response for the preparation", res);
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
    <div className="min-h-screen bg-black text-foreground font-sans font-cormorant">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView !== 'home' && (
              <button
                onClick={() => setCurrentView('home')}
                className="p-2 hover:bg-white/10  transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold tracking-tight">
              Admin<span className="text-accent">Panel</span>
              {currentView !== 'home' && <span className="text-foreground/40 ml-2 capitalize">/ {currentView}</span>}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Home Button */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-foreground/60 hover:text-accent transition-colors text-sm font-medium"
              title="Back to Home"
            >
              <ArrowLeft size={16} />
              Home
            </Link>
            {(currentView === 'projects' || currentView === 'blogs') && (
              <button
                onClick={() => {
                  setModalType(currentView === 'projects' ? 'project' : 'blog');
                  setModalOpen(true);
                  setFormData({});
                }}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-bold  hover:bg-white transition-colors text-sm"
              >
                <Plus size={16} />
                Add New
              </button>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-red-400 hover:bg-red-500/10  transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Home View - Card Navigation */}
        {currentView === 'home' && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { id: 'contacts', label: 'Contacts', icon: Users, desc: 'Manage inquiries' },
              { id: 'projects', label: 'Projects', icon: LayoutDashboard, desc: 'Showcase work' },
              { id: 'blogs', label: 'Notelogs', icon: FileText, desc: 'Write thoughts' },
              { id: 'preparation', label: 'Preparation', icon: FileText, desc: 'Write thoughts' },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView(item.id as View)}
                className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10  hover:border-accent/50 hover:bg-white/10 transition-all group text-center"
              >
                <div className="p-4 bg-black  mb-6 group-hover:text-accent transition-colors">
                  <item.icon size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">{item.label}</h2>
                <p className="text-foreground/60">{item.desc}</p>
              </motion.button>
            ))}
          </div>
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
                  <div className="grid gap-4">
                    {contacts.map((contact) => (
                      <div key={contact._id} className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 p-8 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex-1 space-y-6">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-2xl font-bold mb-2">{contact.name}</h3>
                                <p className="text-accent text-sm font-medium">{contact.contactValue}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-3 py-1.5 bg-black/40 border border-white/10 text-foreground/60">
                                  {new Date(contact.createdAt).toLocaleDateString()}
                                </span>
                                {contact.replied && (
                                  <span className="text-[10px] font-bold px-3 py-1.5 bg-accent/20 text-accent flex items-center gap-1.5 uppercase">
                                    <Check size={10} /> Replied
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Message */}
                            <div className="bg-black/30 border-l-2 border-accent/30 p-6">
                              <p className="text-foreground/90 leading-relaxed">
                                {contact.message}
                              </p>
                            </div>

                            {/* Admin Reply */}
                            {contact.adminReply && (
                              <div className="bg-accent/5 border-l-2 border-accent p-6">
                                <p className="text-[10px] text-accent font-bold mb-2 uppercase tracking-widest">Your Reply</p>
                                <p className="text-foreground/80 leading-relaxed">{contact.adminReply}</p>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="flex items-start">
                            <button
                              onClick={() => setSelectedContact(selectedContact?._id === contact._id ? null : contact)}
                              className="px-6 py-3 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/20 hover:bg-accent hover:text-black hover:border-accent transition-all"
                            >
                              {selectedContact?._id === contact._id ? 'Close' : 'Reply'}
                            </button>
                          </div>
                        </div>

                        {/* Reply Form */}
                        {selectedContact?._id === contact._id && (
                          <div className="mt-8 pt-8 border-t border-white/10">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              className="w-full bg-black/50 border border-white/20 p-4 text-sm mb-4 focus:border-accent focus:bg-black/70 outline-none transition-all"
                              rows={4}
                            />
                            <button
                              onClick={() => handleReply(contact._id)}
                              disabled={!replyText.trim()}
                              className="px-8 py-3 bg-accent text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Send Reply
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects View */}
                {currentView === 'projects' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects
                      .filter(p => filter === 'all' ? true : filter === 'published' ? p.published : !p.published)
                      .map((project) => (
                        <div key={project._id} className="bg-white/5 border border-white/10  overflow-hidden group hover:border-accent/50 transition-all">
                          <div className="aspect-video bg-black/50 relative overflow-hidden">
                            {project.image && (
                              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                              <button
                                onClick={() => handleToggleFavourite(project._id, 'project', project.favourite)}
                                className={`p-1.5  transition-all ${project.favourite ? 'bg-accent text-black' : 'bg-black/50 text-white border border-white/20 hover:bg-white/10'}`}
                                title={project.favourite ? 'Remove from favourites' : 'Add to favourites'}
                              >
                                <Star size={14} fill={project.favourite ? 'currentColor' : 'none'} />
                              </button>
                              <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${project.published ? 'bg-accent text-black' : 'bg-black/50 text-white border border-white/20'}`}>
                                {project.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                            <p className="text-sm text-foreground/60 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] px-2 py-1 bg-white/10  uppercase tracking-wider">{tag}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                              <div className="flex items-center gap-2 text-xs text-foreground/40 font-mono">
                                <Calendar size={12} />
                                {new Date(project.createdAt).toLocaleDateString()}
                              </div>
                              <button
                                onClick={() => handleTogglePublish(project._id, 'project', project.published)}
                                className="text-xs font-bold uppercase tracking-wider hover:text-accent"
                              >
                                {project.published ? 'Unpublish' : 'Publish'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Preparations View */}
                {currentView === 'preparation' && (
                  <PreparationView
                    preparations={preparations}
                    filter={filter}
                    handleTogglePublish={async (id: string, currentStatus: boolean) => {
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
                        console.error('Toggle error:', error);
                      }
                    }}
                  />
                )}

                {/* Blogs View */}
                {currentView === 'blogs' && (
                  <div className="grid gap-4">
                    {blogs
                      .filter(b => filter === 'all' ? true : filter === 'published' ? b.published : !b.published)
                      .map((blog) => (
                        <div key={blog._id} className="group bg-black border border-white/10 p-6 hover:border-accent/50 transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors">{blog.title}</h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleFavourite(blog._id, 'blog', blog.favourite)}
                                className={`p-1.5  transition-all ${blog.favourite ? 'bg-accent text-black' : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'}`}
                                title={blog.favourite ? 'Remove from favourites' : 'Add to favourites'}
                              >
                                <Star size={14} fill={blog.favourite ? 'currentColor' : 'none'} />
                              </button>
                              <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider border ${blog.published ? 'text-accent border-accent' : 'text-yellow-500 border-yellow-500'}`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>

                          <p className="text-foreground/60 text-sm leading-relaxed mb-6 font-serif italic border-l-2 border-white/10 pl-4">
                            {blog.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-1 bg-white/5 text-[10px] font-mono text-foreground/40 border border-white/5">{blog.slug}</span>
                              <span className="text-[10px] font-mono text-foreground/40">{new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleTogglePublish(blog._id, 'blog', blog.published)}
                                className="text-xs font-bold uppercase tracking-wider hover:text-accent text-foreground/60"
                              >
                                {blog.published ? 'Unpublish' : 'Publish'}
                              </button>
                              <a
                                href={`/notelogs/${blog.slug}`}
                                target="_blank"
                                className="text-accent hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all"
                              >
                                View Post <ArrowRight size={14} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
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
                        className="w-full bg-white/5 border border-white/10 p-3  focus:border-accent outline-none text-foreground-500"
                        style={{ colorScheme: 'dark' }}
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
