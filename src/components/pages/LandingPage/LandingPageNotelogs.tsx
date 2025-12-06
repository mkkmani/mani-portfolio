import { getFeaturedBlogs } from "@/services/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IBlog } from "@/types/api";
import BlogCard from "@/components/Common/BlogCard";

export default async function LandingPageNotelogs() {

  const blogsResponse = await getFeaturedBlogs();
  const blogs = blogsResponse.data;

  return (
    <>
      {blogs.length > 0 && (
        <section className="py-24 px-6 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-accent font-bold tracking-widest mb-2 uppercase text-sm">Writing</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground">Recent Notelogs</h3>
              </div>
              <Link
                href="/notelogs"
                className="hidden md:flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium"
              >
                View All <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog: IBlog, index: number) => (
                <BlogCard key={blog._id} blog={blog} index={index} />
              ))}
            </div>

            <div className="mt-12 md:hidden flex justify-center">
              <Link
                href="/notelogs"
                className="flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors font-medium"
              >
                View All <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

    </>
  )
}