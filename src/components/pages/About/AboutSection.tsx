import { SectionWrapper } from "../../sections/SectionWrapper";
import {
  Wrench,
  Cpu,
  Coffee,
  Heart,
  Target,
  Brain,
  Shield,
  Rocket,
  Bug,
  Zap,
} from "lucide-react";

const techElements = [
  {
    symbol: "{ }",
    desc: "Frontend Magic",
    pos: { top: "12%", left: "8%" },
    size: "text-2xl lg:text-3xl",
    delay: 0,
    hoverColor: "hover:text-blue-500",
  },
  {
    symbol: "🔧",
    desc: "Old Me",
    pos: { top: "8%", left: "25%" },
    size: "text-3xl lg:text-4xl",
    delay: 100,
    hoverColor: "hover:text-orange-500",
  },
  {
    symbol: "☕",
    desc: "Fuel",
    pos: { bottom: "15%", left: "12%" },
    size: "text-xl lg:text-2xl",
    delay: 200,
    hoverColor: "hover:text-amber-500",
  },
  {
    symbol: "React",
    desc: "React.js",
    pos: { top: "35%", left: "5%" },
    size: "text-lg lg:text-xl",
    delay: 300,
    hoverColor: "hover:text-cyan-500",
  },
  {
    symbol: "{ API }",
    desc: "RESTful APIs",
    pos: { bottom: "35%", left: "30%" },
    size: "text-xl lg:text-2xl",
    delay: 400,
    hoverColor: "hover:text-green-500",
  },
  {
    symbol: "💻",
    desc: "New Me",
    pos: { top: "15%", right: "25%" },
    size: "text-xl lg:text-2xl",
    delay: 500,
    hoverColor: "hover:text-purple-500",
  },
  {
    symbol: "◉",
    desc: "Database Design",
    pos: { top: "45%", right: "8%" },
    size: "text-2xl lg:text-3xl",
    delay: 600,
    hoverColor: "hover:text-emerald-500",
  },
  {
    symbol: "Node",
    desc: "Node.js",
    pos: { bottom: "25%", right: "20%" },
    size: "text-base lg:text-lg",
    delay: 700,
    hoverColor: "hover:text-green-600",
  },
  {
    symbol: "🐛",
    desc: "My Enemy",
    pos: { top: "25%", right: "12%" },
    size: "text-xl lg:text-2xl",
    delay: 800,
    hoverColor: "hover:text-red-500",
  },
  {
    symbol: "CSS",
    desc: "Styling Magic",
    pos: { bottom: "45%", right: "30%" },
    size: "text-base lg:text-lg",
    delay: 900,
    hoverColor: "hover:text-pink-500",
  },
  {
    symbol: "404",
    desc: "My Life",
    pos: { top: "55%", left: "18%" },
    size: "text-base lg:text-lg",
    delay: 1000,
    hoverColor: "hover:text-yellow-500",
  },
  {
    symbol: "MongoDB",
    desc: "Database",
    pos: { bottom: "8%", right: "15%" },
    size: "text-sm lg:text-base",
    delay: 1100,
    hoverColor: "hover:text-green-500",
  },
];

export const AboutSection = () => {
  return (
    <SectionWrapper
      id="about"
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
      </div>

      {/* Floating Tech Elements */}
      <div className="hidden lg:block absolute inset-0 z-10">
        {techElements.map((element, index) => (
          <div key={index} className="absolute group" style={element.pos}>
            <div
              className={`${element.size} font-bold text-muted-foreground/25 
                ${element.hoverColor} hover:scale-110 transition-all duration-700 cursor-pointer
                animate-bounce select-none relative`}
              style={{
                animationDelay: `${element.delay}ms`,
                animationDuration: `${3 + index * 0.2}s`,
              }}
            >
              {element.symbol}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                <div className="bg-popover/95 backdrop-blur-sm border px-3 py-1.5 rounded-md text-xs text-popover-foreground whitespace-nowrap shadow-lg">
                  {element.desc}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Split Screen Layout */}
      <div className="container mx-auto px-6 h-full flex flex-col justify-center z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-3">About Me</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground">
            From mechanical engineer to code magician - a plot twist nobody saw
            coming
          </p>
        </div>

        {/* Split Screen Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Career Story & Philosophy */}
          <div className="space-y-6">
            {/* Career Transition Story */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl" />
              <div className="relative bg-card/80 backdrop-blur-sm border rounded-2xl p-6 lg:p-8 shadow-lg h-full">
                {/* Career Icons */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="hidden sm:block w-16 h-px bg-gradient-to-r from-orange-500 via-primary to-cyan-500" />
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border-2 border-cyan-500/20 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-cyan-500" />
                  </div>
                </div>

                {/* Story Content */}
                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-bold mb-4">
                    The Great Career Plot Twist
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Started designing gears and calculating stress
                    distributions, but apparently the real stress was trying to
                    understand why JavaScript thinks{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
                      [] == ![]
                    </code>{" "}
                    is totally fine.
                  </p>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Now I build full-stack applications where MongoDB stores my
                    data, Express handles my routes, React makes things pretty,
                    and Node.js runs the show. Debugging components is just like
                    troubleshooting mechanical systems - except Stack Overflow
                    is your new Bible.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium mt-4">
                    <Heart className="w-3 h-3 text-red-500" />
                    Professional problem solver • Coffee researcher • Stack
                    Overflow scholar
                  </div>
                </div>
              </div>
            </div>

            {/* Philosophy Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group p-4 bg-card/60 backdrop-blur-sm border rounded-xl hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Clean Code</h4>
                  <p className="text-muted-foreground text-xs">
                    Future me sends thank you notes
                  </p>
                </div>
              </div>

              <div className="group p-4 bg-card/60 backdrop-blur-sm border rounded-xl hover:shadow-lg transition-all duration-300 hover:border-accent/30">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Coffee className="w-5 h-5 text-accent" />
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Performance</h4>
                  <p className="text-muted-foreground text-xs">
                    Users have short attention spans
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Skills & Stats */}
          <div className="space-y-6">
            {/* Skills Showcase */}
            <div className="bg-card/60 backdrop-blur-sm border rounded-2xl p-6 lg:p-8 shadow-lg">
              <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Full-Stack Wizard
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-500 text-lg font-bold">R</span>
                  </div>
                  <p className="text-xs font-medium">Frontend</p>
                  <p className="text-xs text-muted-foreground">React Magic</p>
                </div>

                <div className="text-center p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-500 text-lg font-bold">N</span>
                  </div>
                  <p className="text-xs font-medium">Backend</p>
                  <p className="text-xs text-muted-foreground">Node.js Power</p>
                </div>

                <div className="text-center p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-emerald-500 text-lg font-bold">
                      M
                    </span>
                  </div>
                  <p className="text-xs font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">MongoDB Zen</p>
                </div>

                <div className="text-center p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-yellow-500 text-lg font-bold">E</span>
                  </div>
                  <p className="text-xs font-medium">Server</p>
                  <p className="text-xs text-muted-foreground">
                    Express Routes
                  </p>
                </div>
              </div>
            </div>

            {/* Developer Stats */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-gray-900/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white text-center mb-4 flex items-center justify-center gap-2">
                <Bug className="w-5 h-5 text-yellow-400" />
                Developer Stats
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-800/60 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500 mb-1">∞</div>
                  <div className="text-slate-300 text-xs mb-0.5">Lines</div>
                  <div className="text-slate-500 text-xs">(Stack Overflow)</div>
                </div>

                <div className="text-center p-3 bg-slate-800/60 rounded-lg">
                  <div className="text-2xl font-bold text-red-500 mb-1">
                    404
                  </div>
                  <div className="text-slate-300 text-xs mb-0.5">Bugs</div>
                  <div className="text-slate-500 text-xs">hidden well</div>
                </div>

                <div className="text-center p-3 bg-slate-800/60 rounded-lg">
                  <div className="text-2xl font-bold text-amber-500 mb-1">
                    ☕²
                  </div>
                  <div className="text-slate-300 text-xs mb-0.5">Coffee</div>
                  <div className="text-slate-500 text-xs">per hour</div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/40 rounded-full">
                  <div className="text-2xl font-bold text-purple-500">NaN</div>
                  <div className="text-slate-300 text-xs">Sanity Level</div>
                </div>
              </div>
            </div>

            {/* Additional Philosophy */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-card/40 border rounded-xl text-center hover:bg-card/60 transition-colors duration-300">
                <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs font-medium mb-1">UX First</p>
                <p className="text-xs text-muted-foreground">
                  Usability pays bills
                </p>
              </div>

              <div className="p-4 bg-card/40 border rounded-xl text-center hover:bg-card/60 transition-colors duration-300">
                <Brain className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs font-medium mb-1">Always Learning</p>
                <p className="text-xs text-muted-foreground">
                  JS waits for no one
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
