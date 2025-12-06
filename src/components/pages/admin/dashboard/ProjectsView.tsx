import { Calendar, Star } from "lucide-react";
import { Project } from "./index";

interface Props {
  projects: Project[];
  filter: 'all' | 'published' | 'draft';
  handleTogglePublish: (id: string, type: 'project' | 'blog', currentStatus: boolean) => void;
  handleToggleFavourite: (id: string, type: 'project' | 'blog', currentStatus: boolean) => void;
}

export default function ProjectsView({ projects, filter, handleTogglePublish, handleToggleFavourite }: Props) {
  return (
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
  )
}