import ProjectCard from "@/components/Common/ProjectCard";
import { getFeaturedProjects } from "@/services/api";
import { IProject } from "@/types/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function LandingPageProjects() {
  const projects = await getFeaturedProjects();

  return (
    <>
      {projects.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-accent font-bold tracking-widest mb-2 uppercase text-sm">Selected Work</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground">Featured Projects</h3>
              </div>
              <Link
                href="/projects"
                className="hidden md:flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium"
              >
                View All Projects <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                />))}
            </div>

            <div className="mt-12 md:hidden flex justify-center">
              <Link
                href="/projects"
                className="flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium"
              >
                View All Projects <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}