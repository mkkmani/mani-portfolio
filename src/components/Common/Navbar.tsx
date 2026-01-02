'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';


export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthenticated = status === 'authenticated';

  if (pathname?.startsWith('/get-access')) return null;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Notelogs', path: '/notelogs' },
    { name: 'Interview Prep', path: '/interview-prep' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-6">
      <div className="max-w-7xl mx-auto bg-black border border-white/10 px-8 h-16 flex items-center justify-between relative group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-accent transition-colors" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-accent transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-accent transition-colors" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-accent transition-colors" />

        <Link href="/" className="text-xl font-bold tracking-tight hover:text-accent transition-colors flex items-center gap-2">
          <div className="w-8 h-8 bg-accent flex items-center justify-center">
            <span className="text-black font-black">M</span>
          </div>
          MANI
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${pathname === item.path ? 'text-accent' : 'text-foreground/80 hover:text-accent'
                }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Show Profile Link when authenticated */}
          {isAuthenticated && (
            <Link
              href="/profile"
              className={`flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 transition-all ${pathname === '/profile' ? 'bg-accent/20 border-accent/40' : ''
                }`}
            >
              <User size={16} className="text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Profile</span>
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 text-foreground/80 hover:text-accent transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div
          className="md:hidden absolute top-24 left-6 right-6 bg-black border-2 border-white/20 p-6 flex flex-col gap-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-bold uppercase ${pathname === item.path ? 'text-accent' : 'text-foreground/70 hover:text-accent'
                }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Profile Link */}
          {isAuthenticated && (
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className={`text-lg font-bold uppercase flex items-center gap-2 ${pathname === '/profile' ? 'text-accent' : 'text-foreground/70 hover:text-accent'
                }`}
            >
              <User size={20} />
              Profile
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
