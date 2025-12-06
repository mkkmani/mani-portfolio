'use client';

import { motion } from 'framer-motion';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <div className="h-full flex flex-col bg-background border border-foreground/10 overflow-hidden">

        <div className="relative h-[220px] bg-foreground/5">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex-1 flex flex-col p-6">

          <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
            {title}
          </h3>

          <p className="text-sm text-foreground/60 leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs text-foreground/50 bg-foreground/5 border border-foreground/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-3 pt-4 border-t border-foreground/10">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/70 hover:text-foreground flex items-center gap-1"
              >
                View Project
                <ExternalLink size={14} />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 hover:text-foreground"
              >
                <Github size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
