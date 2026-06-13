import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  index: number;
}

export default function ProjectCard({
  title,
  description,
  image,
  tags,
  link,
  github,
  index,
}: ProjectCardProps) {
  const projectNumber = (index + 1).toString().padStart(2, '0');

  return (
    <div className="group relative bg-black flex flex-col h-full border-white/5 overflow-hidden transition-all duration-700">
      <div className="relative h-64 md:h-80 w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-700" />

        {/* Project Index Overlay */}
        <div className="absolute top-6 right-6 mix-blend-difference">
          <span className="text-4xl font-black text-white/20 group-hover:text-accent transition-colors duration-500">
            {projectNumber}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1 gap-6 bg-black z-10 transition-transform duration-500">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[8px] font-black tracking-[0.2em] text-foreground/20 uppercase">
                {tag}
              </span>
            ))}
          </div>
          <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:text-accent transition-colors duration-300">
            {title}
          </h4>
        </div>

        <p className="text-foreground/40 text-sm leading-relaxed lowercase italic flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex gap-4">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/40 hover:text-accent transition-colors duration-300"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/40 hover:text-accent transition-colors duration-300"
              >
                <Github size={16} />
              </a>
            )}
          </div>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="group/link flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 group-hover:text-accent transition-colors duration-300"
            >
              VIEW CASE
              <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
