import { getFeaturedBlogs } from "@/lib/data/blogs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IBlog } from "@/types/api";
import BlogCard from "@/components/Common/BlogCard";

export default async function LandingPageNotelogs() {
  const blogs = await getFeaturedBlogs();

  return (
    <>
      {blogs.length > 0 && (
        <section className="py-48 px-6 relative border-t border-white/5 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
                  [ LOG.03 // WRITING ]
                </span>
                <h3 className="text-6xl md:text-9xl font-serif uppercase tracking-tighter text-white">
                  Notes &<br />Insights
                </h3>
              </div>

              <Link
                href="/notelogs"
                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-accent border-b border-white/5 pb-2 transition-all duration-500"
              >
                Read All
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog: IBlog, index: number) => (
                <BlogCard key={blog._id} blog={blog} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}