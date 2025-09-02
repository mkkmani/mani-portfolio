import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop";

type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  image?: string;
};

type BlogCardProps = {
  post: BlogPost;
  className?: string;
};

export const BlogCard = ({ post, className = "" }: BlogCardProps) => {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const backgroundImage = post.image || FALLBACK_IMAGE;

  return (
    <article
      className={`group relative h-full overflow-hidden rounded-lg min-h-[250px] border-l-2 border-primary ${className}`}
    >
      <Link href={`/blog/${post.slug}`} className="h-full flex">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              transform: "scale(1.05)", // Slight zoom to ensure coverage
            }}
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent" />
        </div>

        {/* Main content */}
        <div className="flex p-6 relative z-10 flex-row justify-between h-full">
          <div className="flex-1">
            {/* Date and read time */}
            <div className="flex items-center text-sm text-muted-foreground/80 mb-4">
              <CalendarDays className="w-4 h-4 mr-2" />
              <time>{formattedDate}</time>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                {post.readTime}
              </span>
            </div>

            {/* Title with hover underline */}
            <div className="mb-4">
              <h3 className="text-xl font-medium text-foreground leading-tight">
                <span className="relative">
                  {post.title}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full"></span>
                </span>
              </h3>
            </div>

            {/* Excerpt */}
            <p className="text-muted-foreground line-clamp-3 mb-6">
              {post.excerpt}
            </p>

            {/* Read more */}
            <div className="mt-6">
              <span className="inline-flex items-center text-sm font-medium text-primary">
                Read article
                <ArrowRight className="ml-2 w-4 h-4 transition-transform " />
              </span>
            </div>
          </div>
          <div className="w-8 h-full flex items-center justify-center text-nowrap">
            {post.tags.length > 0 && (
              <ul className="rotate-90 flex flex-row p-0 m-0 items-center justify-center gap-2 text-xs">
                {post.tags.slice(0, 3).map((tag, i) => (
                  <li key={i}>{tag}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};
