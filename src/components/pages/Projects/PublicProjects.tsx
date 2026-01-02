'use client';

import ProjectCard from '@/components/Common/ProjectCard';
import { IProject } from '@/types/api';
import { LayoutGrid } from 'lucide-react';

interface PublicProjectsProps {
  projects: IProject[];
}

export default function PublicProjects({ projects }: PublicProjectsProps) {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-2 text-accent font-bold tracking-widest mb-4 uppercase text-sm">
            <LayoutGrid size={16} />
            <span>Showcase</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            My <span className="text-accent">Projects</span>
          </h1>
          <p className="text-foreground/60 text-lg max-w-2xl leading-relaxed">
            A collection of my work, ranging from full-stack applications to open-source tools and experimental projects.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 border border-foreground/10 bg-foreground/[0.02]">
            <p className="text-foreground/40 text-lg italic">No projects found. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                link={project.link}
                github={project.github}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
