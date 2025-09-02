import { Seo } from "@/components/seo/Seo";
import { BlogSection } from "@/components/pages/Notelogs";

export const metadata = {
  title: "Blog | Notelogs | Mani - Web Development Insights",
  description:
    "Read my latest articles on web development, programming tips, and technology insights. Learn about React, Next.js, and modern web technologies.",
  keywords: [
    "Web Development Blog",
    "Programming Articles",
    "React Tutorials",
    "Next.js",
    "JavaScript",
    "Web Technologies",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/notelogs",
    title: "Blog | Notelogs | Mani - Web Development Insights",
    description:
      "Read my latest articles on web development, programming tips, and technology insights.",
    images: [
      {
        url: "/images/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Blog - Mani Web Development",
      },
    ],
    siteName: "Mani - Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Mani - Web Development Insights",
    description:
      "Read my latest articles on web development, programming tips, and technology insights.",
    images: ["/images/og-blog.jpg"],
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  // Define the type for a blog post
  interface BlogPost {
    slug: string;
    title: string;
    // Add other post properties as needed
  }

  // In a real app, you would fetch blog posts here
  const blogPosts: BlogPost[] = [];

  return (
    <>
      <Seo
        title="Blog | Notelogs | Mani - Web Development Insights"
        description="Read my latest articles on web development, programming tips, and technology insights."
        path="/blog"
        type="blog"
      />
      <main className="min-h-screen">
        <BlogSection />
      </main>
    </>
  );
}

// Generate static params for blog posts
export async function generateStaticParams() {
  // In a real app, you would fetch blog post slugs from your CMS
  const posts: Array<{ slug: string }> = [];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
