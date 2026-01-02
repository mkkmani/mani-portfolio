import Navbar from '@/components/Common/Navbar';
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
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlugServer(slug);

  if (!blog) {
    notFound();
  }

  // Check if user can access content
  const canAccess = blog.published || blog.userRole === 'admin' || blog.userRole === 'owner';

  // If user cannot access unpublished content, show PrivateSession
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Show publish action bar for admin/owner viewing unpublished content */}
      {!blog.published && blog.userRole && (
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
      )}

      <article className="max-w-4xl mx-auto px-6 pt-4 pb-20">
        <Link href="/notelogs" className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Notelogs
        </Link>

        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6 text-sm text-foreground/40">
            <Calendar size={16} />
            <time>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
            <span>•</span>
            <div className="flex gap-2">
              {blog.tags.map((tag: string) => (
                <span key={tag} className="text-accent/80">#{tag}</span>
              ))}
            </div>
            {!blog.published && (
              <span className="text-[10px] font-bold px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase tracking-wider ml-auto">
                Draft
              </span>
            )}
          </div>
          <Image src={blog.image || ''} alt={blog.title} layout="responsive"
            width={1200}
            height={800} />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">{blog.title}</h1>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      fontSize: '0.9rem',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-white/10 text-accent px-2 py-1 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
              h1: ({ children }) => <h1 className="text-4xl font-bold mt-12 mb-6 text-foreground">{children}</h1>,
              h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-5 text-foreground">{children}</h2>,
              h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">{children}</h3>,
              p: ({ children }) => <p className="mb-6 leading-relaxed text-foreground/80">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-2 text-foreground/80">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-foreground/80">{children}</ol>,
              a: ({ children, href }) => <a href={href} className="text-accent hover:text-white underline transition-colors">{children}</a>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-accent/50 pl-6 py-2 my-6 italic text-foreground/70 bg-white/5 rounded-r-lg">
                  {children}
                </blockquote>
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
