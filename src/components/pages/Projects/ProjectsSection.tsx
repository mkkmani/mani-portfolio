import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform with user authentication, product catalog, and payment integration.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: '#',
    demo: '#',
    image: '/project1.jpg'
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    tags: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    github: '#',
    demo: '#',
    image: '/project2.jpg'
  },
  {
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with Next.js and Tailwind CSS, featuring smooth animations and responsive design.',
    tags: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    github: '#',
    demo: '#',
    image: '/project3.jpg'
  },
];

export const ProjectsSection = () => {
  return (
    <SectionWrapper id="projects" className="bg-muted/10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">My Projects</h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was built to solve specific problems and improve user experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div 
            key={index}
            className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group"
          >
            <div className="h-48 bg-muted/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-background/80 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="View on GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {project.demo && (
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-background/80 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label="View Live Demo"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};
