"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/" || pathname?.startsWith("/get-access")) return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return { label, href };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-6 pt-32 pb-4 px-6 md:pl-24 max-w-7xl mx-auto w-full relative z-10"
    >
      <Link
        href="/"
        className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 hover:text-accent transition-all duration-500"
      >
        <Home size={12} />
        [ ROOT ]
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center gap-6">
          <span className="text-[10px] text-accent font-black tracking-widest">//</span>
          {index === breadcrumbs.length - 1 ? (
            <span
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white"
              aria-current="page"
            >
              [ {item.label} ]
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 hover:text-white transition-all duration-500"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
