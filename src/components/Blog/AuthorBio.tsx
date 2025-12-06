import { User, Github, Linkedin, Twitter } from 'lucide-react';
import { getSiteConfig } from '@/lib/seo-config';

export default function AuthorBio() {
  const config = getSiteConfig();

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10  p-8 my-12">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-accent/10  flex items-center justify-center border-2 border-accent/20">
            <User size={40} className="text-accent" />
          </div>
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{config.author.name}</h3>
          <p className="text-accent text-sm font-medium mb-3">{config.author.jobTitle}</p>
          <p className="text-foreground/70 leading-relaxed mb-4">
            Full-stack MERN developer passionate about building exceptional digital experiences.
            I write about web development, best practices, and lessons learned from real-world projects.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {config.social.github && (
              <a
                href={config.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10  hover:bg-white/10 hover:border-accent/50 transition-all"
                aria-label="GitHub Profile"
              >
                <Github size={18} />
              </a>
            )}
            {config.social.linkedin && (
              <a
                href={config.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10  hover:bg-white/10 hover:border-accent/50 transition-all"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </a>
            )}
            {config.social.twitter && (
              <a
                href={config.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10  hover:bg-white/10 hover:border-accent/50 transition-all"
                aria-label="Twitter Profile"
              >
                <Twitter size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
