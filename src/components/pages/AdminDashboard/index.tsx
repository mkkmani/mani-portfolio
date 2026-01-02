'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, FolderKanban, MessageSquare, Search, LogOut } from 'lucide-react';
import DashboardNavCard from './NavCard';
import type { NavCard } from './types';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    blogs: { total: 0, published: 0 },
    projects: { total: 0, published: 0 },
    preparations: { total: 0, published: 0 },
    contacts: { total: 0, unread: 0 }
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogsRes, projectsRes, prepsRes, contactsRes] = await Promise.all([
        fetch('/api/blogs?all=true'),
        fetch('/api/projects?all=true'),
        fetch('/api/interview-prep'),
        fetch('/api/contact/admin')
      ]);

      if (blogsRes.ok) {
        const blogs = await blogsRes.json();
        setStats(prev => ({
          ...prev,
          blogs: {
            total: blogs.length,
            published: blogs.filter((b: any) => b.published).length
          }
        }));
      }

      if (projectsRes.ok) {
        const projects = await projectsRes.json();
        setStats(prev => ({
          ...prev,
          projects: {
            total: projects.length,
            published: projects.filter((p: any) => p.published).length
          }
        }));
      }

      if (prepsRes.ok) {
        const preps = await prepsRes.json();
        setStats(prev => ({
          ...prev,
          preparations: {
            total: preps.length,
            published: preps.filter((p: any) => p.published).length
          }
        }));
      }

      if (contactsRes.ok) {
        const contacts = await contactsRes.json();
        setStats(prev => ({
          ...prev,
          contacts: {
            total: contacts.length,
            unread: contacts.filter((c: any) => !c.replied).length
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      router.push('/get-access/login');
    }
  };

  const navCards: NavCard[] = [
    {
      id: 'blogs',
      label: 'Notelogs',
      description: 'Manage your blog posts and articles',
      icon: FileText,
      href: '/get-access/blogs',
      stats: stats.blogs
    },
    {
      id: 'projects',
      label: 'Projects',
      description: 'Showcase your portfolio work',
      icon: FolderKanban,
      href: '/get-access/projects',
      stats: stats.projects
    },
    {
      id: 'interview-prep',
      label: 'Interview Prep',
      description: 'AI-powered interview preparation',
      icon: FileText,
      href: '/get-access/interview-prep',
      stats: stats.preparations
    },
    {
      id: 'contacts',
      label: 'Contacts',
      description: 'View and respond to inquiries',
      icon: MessageSquare,
      href: '/get-access/contacts',
      stats: stats.contacts
    },
    {
      id: 'seo',
      label: 'SEO Tools',
      description: 'Verify and optimize SEO configuration',
      icon: Search,
      href: '/get-access/seo'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Admin <span className="text-accent">Dashboard</span>
            </h1>
            <p className="text-foreground/60 text-lg">
              Manage your content and site configuration
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-foreground/60 hover:text-accent transition-colors text-sm font-bold uppercase tracking-wider"
            >
              ← Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-bold uppercase tracking-wider"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navCards.map((card) => (
            <DashboardNavCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
