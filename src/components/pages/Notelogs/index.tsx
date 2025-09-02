import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { CalendarDays, Clock, Tag } from "lucide-react";
import { BlogCard } from "./BlogCard";

const blogPosts = [
  {
    title: "Getting Started with Next.js 14",
    excerpt:
      "Learn the basics of Next.js 14 and how to build modern web applications with the latest features.",
    date: "2023-10-15",
    readTime: "5 min read",
    tags: ["Next.js", "React", "Web Development"],
    slug: "getting-started-with-nextjs-14",
  },
  {
    title: "Mastering TypeScript in 2023",
    excerpt:
      "Advanced TypeScript patterns and best practices for building type-safe applications at scale.",
    date: "2023-09-28",
    readTime: "8 min read",
    tags: ["TypeScript", "JavaScript", "Programming"],
    slug: "mastering-typescript-2023",
  },
  {
    title: "The Future of Web Development",
    excerpt:
      "Exploring the latest trends and technologies shaping the future of web development.",
    date: "2023-09-10",
    readTime: "6 min read",
    tags: ["Web Development", "Trends", "Technology"],
    slug: "future-of-web-dev",
  },
];

export const BlogSection = () => {
  return (
    <SectionWrapper id="blog">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Latest Articles
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Thoughts, tutorials, and insights about web development, programming,
          and technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
       <BlogCard key={index} post={post} />
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="/blog"
          className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          View All Articles
        </a>
      </div>
    </SectionWrapper>
  );
};
