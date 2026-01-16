'use client';

import { ArrowLeft, User, Code, Rocket, Brain, Heart, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const skills = [
  { name: 'MERN Stack', icon: Code, color: 'text-green-500' },
  { name: 'Next.js 15+', icon: Rocket, color: 'text-blue-500' },
  { name: 'TypeScript', icon: Brain, color: 'text-blue-400' },
  { name: 'AI Integration', icon: Brain, color: 'text-purple-500' },
  { name: 'UI/UX Design', icon: Heart, color: 'text-red-500' },
  { name: 'Cloud Architecture', icon: Globe, color: 'text-cyan-500' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
            About <span className="text-accent">Me</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
            Full-stack developer architecting scalable digital solutions with a focus on modern aesthetics and high performance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-32">
          {/* Bio Section */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="relative aspect-square md:aspect-video grayscale border border-white/10 p-3 bg-white/5 overflow-hidden group">
              <Image
                src="/mani.png"
                alt="Manikanta Ketha"
                fill
                className="object-cover group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-accent/5 mix-blend-overlay" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-foreground/80 leading-relaxed font-serif text-lg italic border-l-4 border-accent pl-6 py-2">
                "I believe that code is an art form, and every pixel should serve a purpose. My goal is to build digital experiences that are not just functional, but also beautiful and intuitive."
              </p>

              <p className="text-foreground/70 leading-relaxed mt-8">
                I am <span className="text-white font-bold">Manikanta Ketha</span>, a passionate Software Engineer based in India. With a deep expertise in the MERN stack and Next.js, I specialize in building robust applications that solve real-world problems.
              </p>

              <p className="text-foreground/70 leading-relaxed">
                Currently, I'm working at <span className="text-accent">PureCode Software</span>, where I architect AI tools and extensions that empower developers to build faster and better. My journey has been driven by a constant desire to learn and push the boundaries of modern web technologies.
              </p>

              <p className="text-foreground/70 leading-relaxed">
                When I'm not coding, I contribute to open-source projects, write technical blogs (Notelogs), and explore the latest advancements in AI and cloud computing.
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                Core <span className="text-accent">Expertise</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-accent/30 transition-all group">
                    <div className={`p-2 bg-white/5 ${skill.color} group-hover:scale-110 transition-transform`}>
                      <skill.icon size={20} />
                    </div>
                    <span className="font-bold text-sm tracking-wide uppercase">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 p-8 relative overflow-hidden group">
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 relative z-10">
                The <span className="text-accent">Approach</span>
              </h2>
              <ul className="space-y-4 relative z-10">
                <li className="flex gap-4">
                  <span className="text-accent font-mono">01.</span>
                  <div>
                    <span className="block font-bold uppercase text-xs mb-1">Architecture First</span>
                    <p className="text-sm text-foreground/60 leading-relaxed">Planning scalable systems before writing a single line of code.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-accent font-mono">02.</span>
                  <div>
                    <span className="block font-bold uppercase text-xs mb-1">Performance Oriented</span>
                    <p className="text-sm text-foreground/60 leading-relaxed">Optimizing for Core Web Vitals and lightning-fast load times.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-accent font-mono">03.</span>
                  <div>
                    <span className="block font-bold uppercase text-xs mb-1">AI Enhanced</span>
                    <p className="text-sm text-foreground/60 leading-relaxed">Leveraging the latest AI models to deliver intelligent user experiences.</p>
                  </div>
                </li>
              </ul>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="text-center py-20 border-t border-white/10">
          <h2 className="text-3xl font-bold mb-8 uppercase tracking-widest">Available for Remote Opportunities</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/contact"
              className="px-8 py-4 bg-accent text-background font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Start a Project
            </Link>
            <Link
              href="/work"
              className="px-8 py-4 border border-white/20 hover:border-accent hover:text-accent font-bold uppercase tracking-widest transition-all"
            >
              View Work Log
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
