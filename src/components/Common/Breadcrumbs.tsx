'use client';

import Link from 'next/link';
import { ChevronLeft,Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page or get-access pages
  if (pathname === '/' || pathname?.startsWith('/get-access')) return null;

  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    // Format label: capitalize and replace hyphens with spaces
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { label, href };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-foreground/50 pt-28 pb-4 px-6 max-w-7xl mx-auto w-full"
    >
      <Link
        href="/"
        className="flex items-center hover:text-accent transition-colors"
        title="Home"
      >
        <Home size={14} />
        <span className="sr-only">Home</span>
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          <ChevronLeft size={14} className="text-accent" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground/80 font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
