import BlogCard from '@/components/Common/BlogCard';
import Pagination from '@/components/Common/Pagination';
import { getPublishedBlogs } from '@/lib/data/blogs';
import { IBlog } from '@/types/api';
import FAQSection from '@/components/FAQ/FAQSection';
import { notelogsFAQs } from '@/lib/faq-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  searchParams: { page?: string };
}

export default async function AllNotelogs({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const limit = 18;

  const { data: blogs, pagination } = await getPublishedBlogs(currentPage, limit);

  return (
    <main className="min-h-screen bg-black pt-8 md:pt-12 pb-24 px-6 md:pl-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ JOURNAL.01 // INSIGHTS ]
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif uppercase tracking-tighter text-white whitespace-nowrap">
              Notelogs
            </h1>
          </div>

          <Link
            href="/"
            className="group flex items-center gap-3 shrink-0 px-5 py-3 border border-white/10 hover:border-accent hover:bg-accent/5 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 hover:text-accent transition-all duration-500"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>

        <div className="mb-32">
          <p className="text-xl md:text-2xl text-foreground/50 leading-[1.3] font-light lowercase max-w-2xl italic">
            technical documentation and editorial reflections. <span className="text-white italic">logic</span> captured in <span className="text-white/80">notations</span>.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="py-24 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/20 italic">
              // NO_LOGS_FOUND_IN_REGISTRY
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {blogs.map((blog: IBlog, index: number) => (
                <BlogCard key={blog._id} blog={blog} index={index} />
              ))}
            </div>

            <div className="mt-24">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                basePath="/notelogs"
              />
            </div>

            <FAQSection
              faqs={notelogsFAQs}
              title="Notelogs FAQs"
              description="// TECHNICAL KNOWLEDGE BASE."
            />
          </>
        )}
      </div>
    </main>
  );
}

