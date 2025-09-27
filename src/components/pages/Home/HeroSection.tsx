import React from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const socialLinks = [
  { name: "GitHub", url: "https://github.com", icon: Github },
  { name: "LinkedIn", url: "https://linkedin.com", icon: Linkedin },
  { name: "Twitter", url: "https://twitter.com", icon: Twitter },
  { name: "Email", url: "mailto:hello@example.com", icon: Mail },
];

const funFacts = [
  "I write code that sometimes works on the first try (but we all know that's a lie)",
  "Professional Googler with a side of coding",
  "I put the 'pro' in procrastination",
  "My code is like a fine wine - it gets better with age (and several refactors)",
  "I don't always test my code, but when I do, I do it in production",
];

const sarcasticTitles = [
  { big: "FULL", small: "(mostly)" },
  { big: "STACK", small: "(when I'm not stuck in a tutorial)" },
  { big: "DEVELOPER", small: "(and professional stack overflow copy-paster)" },
  { big: "& COFFEE", small: "(the real MVP)" },
];

export const HeroSection = () => {
  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden relative px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0000_21px,transparent_1%)_center,linear-gradient(#0000_21px,transparent_1%)_center,#e5e7eb"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)/3%,transparent_0)]"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto text-left px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 md:space-y-16">
          <div className="space-y-2">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none">
              <span className="block">HELLO,</span>
              <span className="block text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] text-primary">
                I&apos;M MANI
              </span>
            </h1>

            <div className="mt-6 space-y-1">
              {sarcasticTitles.map((item, index) => (
                <div key={index} className="flex items-baseline gap-3 group">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.big}
                  </span>
                  <span className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.small}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl space-y-6">
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              I write code that somehow turns into things people actually use.
              Currently making the internet a more interesting place, one bug at
              a time.
            </p>

            <div className="inline-block px-4 py-3 bg-muted/30 text-muted-foreground border border-border/30 rounded-lg text-sm sm:text-base">
              <span className="mr-2">🤔</span> {randomFact}
            </div>

            {/* <div className="pt-6">
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:bg-accent/50 hover:border-accent-foreground/20 transition-colors text-muted-foreground hover:text-foreground"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  );
                })}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
