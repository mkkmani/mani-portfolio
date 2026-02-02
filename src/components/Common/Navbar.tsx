"use client";

import { Github, Linkedin, Mail, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { SOCIAL_LINKS } from "@/lib/config";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = status === "authenticated";

  const navItems = [
    { name: "Home", path: "/", index: "00" },
    { name: "Work", path: "/work", index: "01" },
    { name: "Projects", path: "/projects", index: "02" },
    { name: "About", path: "/about", index: "03" },
    { name: "Notelogs", path: "/notelogs", index: "04" },
    { name: "Interview Prep", path: "/interview-prep", index: "05" },
    { name: "Contact", path: "/contact", index: "06" },
  ];

  if (pathname?.startsWith("/get-access")) return null;

  return (
    <>
      {/* Desktop Sidebar (Fixed Drawer) */}
      <nav className="fixed left-0 top-0 h-screen z-50 bg-black border-r border-white/5 hidden md:flex flex-col group/sidebar w-20 hover:w-80 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden">
        {/* Logo / Index */}
        <div className="p-8 h-32 flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-6">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <span className="text-[18px] font-black text-accent">MK</span>
            </div>
            <span className="text-[10px] font-black tracking-[0.5em] text-white opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-500 delay-200">
              MANIKANTA
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col justify-center gap-2 px-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="group/item flex items-center gap-6 py-4 relative"
              >
                <span
                  className={`text-[10px] font-black tracking-widest shrink-0 w-8 transition-colors duration-300 ${isActive
                    ? "text-accent"
                    : "text-foreground/60 group-hover/item:text-white"
                    }`}
                >
                  {item.index}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500 delay-100 ${isActive
                    ? "text-white"
                    : "text-foreground/60 group-hover/item:text-white"
                    }`}
                >
                  [ {item.name} ]
                </span>
                {isActive && (
                  <div className="absolute left-[-24px] w-1 h-4 bg-accent" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Social / Auth Links */}
        <div className="p-8 flex flex-col gap-8 shrink-0 border-t border-white/5">
          <div className="flex flex-col gap-6">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-6 group/soc"
            >
              <Github
                size={16}
                className="shrink-0 text-foreground/60 group-hover/soc:text-white transition-colors"
              />
              <span className="text-[8px] font-black tracking-[0.5em] text-foreground/60 group-hover/soc:text-white opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500">
                GITHUB
              </span>
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-6 group/soc"
            >
              <Linkedin
                size={16}
                className="shrink-0 text-foreground/60 group-hover/soc:text-white transition-colors"
              />
              <span className="text-[8px] font-black tracking-[0.5em] text-foreground/60 group-hover/soc:text-white opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500">
                LINKEDIN
              </span>
            </a>
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="flex items-center gap-6 group/soc"
              >
                <User size={16} className="shrink-0 text-accent" />
                <span className="text-[8px] font-black tracking-[0.5em] text-accent opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500">
                  PROFILE
                </span>
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="flex items-center gap-6 group/soc"
              >
                <User
                  size={16}
                  className="shrink-0 text-foreground/60 group-hover/soc:text-white transition-colors"
                />
                <span className="text-[8px] font-black tracking-[0.5em] text-foreground/60 group-hover/soc:text-white opacity-0 group-hover/sidebar:opacity-100 transition-all duration-500">
                  SIGN_IN
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 md:hidden flex items-center justify-between px-6">
        <Link href="/" className="w-10 h-px bg-white/20" />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[49] bg-black flex flex-col pt-32 px-12 md:hidden">
          <div className="flex flex-col gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-baseline gap-4 group"
              >
                <span className="text-[10px] font-black text-accent">
                  {item.index}
                </span>
                <span
                  className={`text-4xl font-serif uppercase tracking-tighter ${pathname === item.path ? "text-white" : "text-foreground/20"
                    }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-auto mb-12 flex gap-8 border-t border-white/5 pt-8">
            <a
              href={SOCIAL_LINKS.github}
              className="text-[10px] font-black tracking-[0.3em] text-foreground/40"
            >
              GITHUB
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              className="text-[10px] font-black tracking-[0.3em] text-foreground/40"
            >
              LINKEDIN
            </a>
          </div>
        </div>
      )}
    </>
  );
}
