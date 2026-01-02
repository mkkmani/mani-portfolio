import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';
import { getSiteConfig } from '@/lib/seo-config';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const config = getSiteConfig();
  const breadcrumbSchema = generateBreadcrumbSchema(
    [{ name: 'Home', url: '/' }, ...items],
    config
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-foreground/60">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-accent transition-colors"
              aria-label="Home"
            >
              <Home size={16} />
            </Link>
          </li>

          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronLeft size={14} className="text-accent" />
              {item.url && index < items.length - 1 ? (
                <Link
                  href={item.url}
                  className="hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
