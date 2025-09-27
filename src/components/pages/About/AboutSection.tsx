/* eslint-disable react/no-unescaped-entities */

import { SectionWrapper } from "../../sections/SectionWrapper";
import { Code, Server, Database, GitBranch, Type, Coffee } from "lucide-react";

const techStack = [
  {
    name: "React/Next.js",
    icon: <Code className="w-5 h-5" />,
    description: "Where I make buttons do things",
  },
  {
    name: "Node.js",
    icon: <Server className="w-5 h-5" />,
    description: "JavaScript, but for servers (and my sleep schedule)",
  },
  {
    name: "MongoDB",
    icon: <Database className="w-5 h-5" />,
    description: "Where I store all my 'temporary' solutions",
  },
  {
    name: "TypeScript",
    icon: <Type className="w-5 h-5" />,
    description: "Because I like my bugs to be type-safe",
  },
  {
    name: "Tailwind",
    icon: (
      <span className="w-5 h-5 rounded-md bg-cyan-500 flex items-center justify-center text-white">
        T
      </span>
    ),
    description: "CSS that doesn't make me question my life choices",
  },
  {
    name: "Git",
    icon: <GitBranch className="w-5 h-5" />,
    description: "Ctrl+Z for my entire career",
  },
];

const devConfessions = [
  "I've committed 'asdf' and pushed it. We've all been there.",
  "My rubber duck has heard things no one should ever hear.",
  "I Google 'how to center a div' at least once a month.",
  "I've pretended to know how regex works.",
  "My commit messages range from 'fix bug' to 'please work'.",
  "I've deployed to production on a Friday. Twice.",
  "I've spent hours debugging only to realize I was using the wrong terminal tab.",
  "I've fixed a bug by randomly changing code until it worked.",
  "I've named a variable 'temp' that's been in production for 3 years.",
  "I've written code so bad, I had to rewrite it the next day.",
  "I've used 'copy-paste' from Stack Overflow more than I'd like to admit.",
  "I've deleted the database. More than once.",
  "I've spent 4 hours on a bug that was just a missing semicolon.",
  "I've committed commented-out code 'for future reference'.",
  "I've pushed to main instead of a feature branch. Oops.",
  "I've written a script to do something that would've taken 5 minutes manually.",
  "I've used 'fix' as a commit message. More than once.",
  "I've broken production by 'just making a small change'.",
  "I've spent more time writing tests than the actual code.",
  "I've used 'temporary' workarounds that are still in production.",
];

const currentProject = {
  status: "In Progress (Mostly)",
  description: "Trying to make this code work while my chai gets cold",
  tech: ["Next.js", "TypeScript", "Too much coffee"],
};

export const AboutSection = () => {
  const randomConfession =
    devConfessions[Math.floor(Math.random() * devConfessions.length)];

  return (
    <SectionWrapper id="about" className="py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              about_me.md
            </div>
            <div className="w-12"></div> {/* Spacer */}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Terminal-like intro */}
          <div className="mb-8 p-4 rounded-lg bg-muted/30 border border-border">
            <p className="font-mono text-sm">
              <span className="text-green-500">$</span> whoami
            </p>
            <p className="font-mono text-sm mt-2">
              Full Stack Developer | Professional Problem Solver | Chai
              Connoisseur
            </p>
            <p className="font-mono text-sm mt-4 text-muted-foreground">
              # {randomConfession}
            </p>
          </div>

          {/* About Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border flex items-center gap-2">
              <span className="text-muted-foreground">##</span> About Me
            </h2>
            <p className="mb-4">
              Hey there! I&apos;m Mani, a developer who believes the best code
              is written between sips of chai. I used to build things with
              wrenches, now I build them with code (and slightly fewer bruises).
            </p>
            <div className="p-4 my-4 rounded-lg border-l-4 border-primary bg-muted/20 italic">
              <span className="text-muted-foreground">💡 Fun fact:</span>{" "}
              {randomConfession}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border flex items-center gap-2">
              <span className="text-muted-foreground">##</span> My Digital
              Toolbox
            </h2>
            <p className="mb-4">
              These are the tools that keep me (mostly) sane:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="p-4 rounded-lg border border-border bg-background hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
                      {tech.icon}
                    </span>
                    <span className="font-medium text-foreground">
                      {tech.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 pl-11">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Project */}
          <div className="mb-10 p-4 rounded-lg bg-muted/20 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-sm font-medium">Currently Working On</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{currentProject.status}</h3>
            <p className="text-muted-foreground text-sm mb-3">
              {currentProject.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentProject.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border flex items-center gap-2">
              <span className="text-muted-foreground">##</span> Let's Connect
            </h2>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="font-mono text-sm">
                <span className="text-green-500">$</span> echo "Let's build
                something awesome together" | mail -s "Hello!" mani@example.com
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                (P.S. I don't actually use the terminal for email... usually)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 text-center text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()} | Made with{" "}
          <span className="text-red-500">❤️</span> and{" "}
          <Coffee className="inline w-4 h-4" />
        </div>
      </div>
    </SectionWrapper>
  );
};

// CSS animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInLeft {
    from { 
      opacity: 0;
      transform: translateX(-20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from { 
      opacity: 0;
      transform: translateX(20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out forwards;
  }
  
  .animate-slide-in-right {
    animation: slideInRight 0.6s ease-out forwards;
  }
`;

// Add styles to the document head
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
