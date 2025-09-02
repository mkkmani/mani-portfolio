import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-16 w-48 h-48 rounded-full bg-chart-3/20 dark:bg-chart-3/30 blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-chart-1/20 dark:bg-chart-1/30 blur-xl"></div>
      </div>
      
      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="inline-block relative mb-8">
          <div className="text-[8rem] md:text-[12rem] font-extrabold text-primary/10 dark:text-primary/20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl font-bold text-primary">
              Oops!
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Lost in the Digital Void
        </h1>
        
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          The page you're looking for seems to have taken a detour into the unknown. 
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
          
          <button 
            className="px-6 py-3 border border-border rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Go Back
          </button>
        </div>
        
        <div className="relative
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-border/50 before:to-transparent
          before:content-[''] before:h-px before:w-full before:top-1/2">
          <span className="relative px-4 bg-background text-muted-foreground text-sm">
            Or continue exploring
          </span>
        </div>
        
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: '/projects', label: 'Projects', emoji: '🚀' },
            { href: '/about', label: 'About', emoji: '👨‍💻' },
            { href: '/blog', label: 'Blog', emoji: '✍️' },
            { href: '/contact', label: 'Contact', emoji: '📬' }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 rounded-md border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <span className="text-2xl block mb-2">{item.emoji}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
