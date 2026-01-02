import BlogCard from '@/components/Common/BlogCard';
import Pagination from '@/components/Common/Pagination';
import { getBlogs } from '@/services/api';
import { IBlog } from '@/types/api';
import FAQSection from '@/components/FAQ/FAQSection';
import { notelogsFAQs } from '@/lib/faq-data';

interface PageProps {
  searchParams: { page?: string };
}

export default async function AllNotelogs({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const limit = 9;

  const response = await getBlogs(currentPage, limit);
  const { data: blogs, pagination } = response;

  return (
    <main className="min-h-screen bg-background pt-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Notelogs<span className="text-accent">.</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl font-light">
            Thoughts, tutorials, and insights for everyday learning.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/60">No blog posts found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog: IBlog, index: number) => (
                <BlogCard key={blog._id} blog={blog} index={index} />
              ))}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/notelogs"
            />

            <FAQSection
              faqs={notelogsFAQs}
              title="Notelogs FAQs"
              description="Common questions about technical articles and tutorials."
            />
          </>
        )}
      </div>
    </main>
  );
}

