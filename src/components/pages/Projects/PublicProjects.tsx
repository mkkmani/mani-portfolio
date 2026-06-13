import ProjectCard from '@/components/Common/ProjectCard';
import { IProject } from '@/types/api';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PublicProjectsProps {
  projects: IProject[];
}

export default function PublicProjects({ projects }: PublicProjectsProps) {
  return (
    <div className="min-h-screen bg-black pt-8 md:pt-12 pb-24 px-6 md:pl-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ ARCHIVE.01 // WORKS ]
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif uppercase tracking-tighter text-white whitespace-nowrap">
              Selected Works
            </h1>
          </div>

          <Link
            href="/"
            className="group flex items-center gap-3 shrink-0 px-5 py-3 border border-white/10 hover:border-accent hover:bg-accent/5 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 hover:text-accent transition-all duration-500"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>

        <div className="mb-32">
          <p className="text-xl md:text-2xl text-foreground/50 leading-[1.3] font-light lowercase max-w-2xl italic">
            a curated collection of digital monoliths. exploring the intersection of <span className="text-white italic">technical depth</span> and visual <span className="text-white/80">precision</span>.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="py-24 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/20 italic">
              // NO_PROJECTS_FOUND_IN_REGISTRY
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {[...projects].reverse().map((project, index) => (
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
