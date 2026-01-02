import ProjectCard from '@/components/Common/ProjectCard';
import { getProjects } from '@/services/api';
import { IProject } from '@/types/api';

export default async function Projects() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-background pt-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-foreground/60 max-w-2xl">
            A collection of my work, experiments, and open source contributions.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/60">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {projects.map((project: IProject, index: number) => (
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
    </main>
  );
}

