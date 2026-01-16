'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Calendar, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import CreateProjectModal from './CreateProjectModal';
import type { Project, FilterType } from './types';
import { Plus } from 'lucide-react';

export default function ProjectsManagement() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?all=true');
      if (res.ok) setProjects(await res.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, field: 'published' | 'favourite', currentStatus: boolean) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, [field]: !currentStatus })
      });
      if (res.ok) fetchProjects();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'published') return p.published;
    return !p.published;
  });

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/get-access" className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-4 text-sm font-bold uppercase tracking-wider">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Projects <span className="text-accent">Management</span>
            </h1>
            <p className="text-foreground/60 text-lg">Manage your portfolio projects ({projects.length})</p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs hover:bg-accent/90 transition-colors"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {(['all', 'published', 'draft'] as FilterType[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-accent text-background' : 'border border-foreground/10 text-foreground/60 hover:border-foreground/30'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project._id} className="border border-foreground/10 bg-foreground/[0.02] overflow-hidden group hover:border-accent/30 transition-all">
                <div className="aspect-video bg-background relative overflow-hidden">
                  {project.image && (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => handleToggle(project._id, 'favourite', project.favourite)} className={`p-1.5 transition-all ${project.favourite ? 'bg-accent text-background' : 'bg-background/80 text-foreground border border-foreground/20 hover:bg-foreground/10'}`}>
                      <Star size={14} fill={project.favourite ? 'currentColor' : 'none'} />
                    </button>
                    <span className={`text-xs font-bold px-2 py-1 uppercase tracking-wider ${project.published ? 'bg-accent text-background' : 'bg-background/80 text-foreground border border-foreground/20'}`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                  <p className="text-sm text-foreground/60 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-foreground/10 uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                    <span className="flex items-center gap-1 text-xs text-foreground/40">
                      <Calendar size={12} />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <button onClick={() => handleToggle(project._id, 'published', project.published)} className="text-xs font-bold uppercase tracking-wider hover:text-accent transition-colors">
                      {project.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                  {(project.link || project.github) && (
                    <div className="flex gap-2 pt-3 border-t border-foreground/10 mt-3">
                      {project.link && (
                        <a href={project.link} target="_blank" className="flex items-center gap-1 text-xs text-accent hover:text-foreground transition-colors">
                          <ExternalLink size={12} /> Live
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" className="flex items-center gap-1 text-foreground/60 hover:text-foreground transition-colors">
                          <Github size={12} /> Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center py-12 text-foreground/40">No projects found</div>
            )}
          </div>
        )}

        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchProjects}
        />
      </div>
    </div>
  );
}
