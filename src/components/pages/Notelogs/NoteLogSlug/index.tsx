import { getBlogBySlugServer } from '@/services/api/blogs.server';
import ClientPrivateSession from '@/components/pages/Content/ClientPrivateSession';
import ClientPublishActionBar from '@/components/pages/Content/ClientPublishActionBar';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getSiteConfig } from '@/lib/seo-config';
import { generateBlogPostingSchema, generateBreadcrumbSchema } from '@/lib/structured-data';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlugServer(slug);

  if (!blog) {
    notFound();
  }

  const canAccess = blog.published || blog.userRole === 'admin' || blog.userRole === 'owner';

  if (!canAccess) {
    return (
      <ClientPrivateSession
        contentType="blog"
        contentId={blog._id}
        hasExistingRequest={blog.hasPublishRequest || false}
        requestStatus={blog.publishRequestStatus}
        canRequestPublish={blog.canRequestPublish || false}
      />
    );
  }

  const formattedDate = new Date(blog.customDate || blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const config = getSiteConfig();
  const jsonLd = blog.published
    ? [
        generateBlogPostingSchema(blog, config),
        generateBreadcrumbSchema(
          [
            { name: 'Home', url: '/' },
            { name: 'Notelogs', url: '/notelogs' },
            { name: blog.title, url: `/notelogs/${blog.slug}` },
          ],
          config
        ),
      ]
    : [];

  return (
    <main className="min-h-screen bg-black pt-8 md:pt-12 pb-24 px-6 md:pl-24">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="max-w-4xl mx-auto">
        {/* Publish action bar for admin/owner viewing unpublished content */}
        {!blog.published && blog.userRole && (
          <div className="mb-12">
            <ClientPublishActionBar
              userRole={blog.userRole}
              published={blog.published}
              contentType="blog"
              contentId={blog._id}
              contentSlug={blog.slug}
              canRequestPublish={blog.canRequestPublish || false}
              hasPublishRequest={blog.hasPublishRequest || false}
              publishRequestStatus={blog.publishRequestStatus}
              canPublish={blog.canPublish || false}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ LOG.ENTRY // {formattedDate} ]
            </span>
            <h1 className="text-4xl md:text-7xl font-serif uppercase tracking-tighter text-white leading-[1.1]">
              {blog.title}
            </h1>
          </div>

          <Link
            href="/notelogs"
            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-accent border-b border-white/5 pb-2 transition-all duration-500"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Archive
          </Link>
        </div>

        <div className="relative aspect-video mb-24 grayscale-[0.2] border border-white/5 overflow-hidden group">
          {blog.image && (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-all duration-1000"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12">
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-foreground/70 prose-p:font-light prose-p:leading-relaxed prose-p:lowercase prose-strong:text-white prose-strong:font-black prose-a:text-accent prose-blockquote:border-accent prose-blockquote:font-serif prose-blockquote:italic">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative my-12 group">
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-accent text-black text-[8px] font-black uppercase tracking-[0.3em] z-10">
                          {match[1]}
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            background: '#050505',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            padding: '2.5rem 1.5rem 1.5rem',
                            fontSize: '0.85rem',
                            margin: '0',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="text-accent bg-white/5 px-1.5 py-0.5 font-bold" {...props}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter text-white mt-24 mb-12">{children}</h2>,
                  h2: ({ children }) => <h3 className="text-3xl md:text-4xl font-serif uppercase tracking-tighter text-white mt-20 mb-10">{children}</h3>,
                  h3: ({ children }) => <h4 className="text-2xl md:text-3xl font-serif uppercase tracking-tighter text-white mt-16 mb-8">{children}</h4>,
                  p: ({ children }) => <p className="mb-8">{children}</p>,
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="mt-48 pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] font-black tracking-[0.3em] text-accent/40 uppercase">
                #{tag}
              </span>
            ))}
          </div>

          <Link
            href="/notelogs"
            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-accent transition-all duration-500"
          >
            All Insights
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform rotate-180" />
          </Link>
        </div>
      </div>
    </main>
  );
}
