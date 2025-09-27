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
    // { id: "projects", name: "Projects", href: "/projects", icon: Briefcase },
    { id: "notelogs", name: "Notelogs", href: "/notelogs", icon: FileText },
    { id: "contact", name: "Contact", href: "/contact", icon: Mail },
  ];

  useEffect(() => {
    const activeItem = navItems.findIndex((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    );
    setActiveIndex(activeItem >= 0 ? activeItem : 0);
  }, [pathname,navItems]);

  if (!mounted || pathname === "/notelogs/add") return null;

  return (
    <nav
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        scrolled ? "scale-100" : "scale-95"
      }`}
      aria-label="Main navigation"
    >
      <div className="relative flex items-center p-1.5 bg-background/90 backdrop-blur-lg rounded-full border border-border/50 shadow-xl">
        <div className="flex items-center gap-2 px-1">
          {navItems.map((item, index) => {
            const isActive = activeIndex === index;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 z-10 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                  aria-hidden="true"
                />
                <span className="sr-only">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
