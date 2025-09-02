"use client";

import { useState, useEffect } from "react";
import { Home, User, Briefcase, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", name: "Home", href: "/", icon: Home },
    { id: "about", name: "About", href: "/about", icon: User },
    { id: "projects", name: "Projects", href: "/projects", icon: Briefcase },
    { id: "notelogs", name: "Notelogs", href: "/notelogs", icon: FileText },
    { id: "contact", name: "Contact", href: "/contact", icon: Mail },
  ];

  useEffect(() => {
    const activeItem = navItems.findIndex((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    );
    setActiveIndex(activeItem >= 0 ? activeItem : 0);
  }, [pathname]);

  if (!mounted || pathname === '/notelogs/add') return null;

  return (
    <nav
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        scrolled ? "scale-100 translate-y-0" : "scale-95 translate-y-1"
      }`}
      aria-label="Main navigation"
    >
      <div className="relative flex items-center gap-1 px-2 py-2 bg-background/80 backdrop-blur-xl rounded-full border border-border/50">
        {/* Active item indicator */}
        <div
          className="absolute bg-primary rounded-full transition-all duration-300 ease-out"
          style={{
            left: `${8 + activeIndex * 48}px`,
            top: "8px",
            width: "40px",
            height: "40px",
          }}
          aria-hidden="true"
        />

        {navItems.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 z-10 ${
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
