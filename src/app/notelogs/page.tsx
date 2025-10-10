import { Seo } from "@/components/seo/Seo";
import { BlogSection } from "@/components/pages/Notelogs";
import { getNotelogs } from "@/server/services/noteLogServices";
import connectToDB from "@/server/db/mongoDb";

async function getPosts() {
  try {
    await connectToDB();
    const posts = await getNotelogs();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

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

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <Seo
        title="Blog | Notelogs | Mani - Web Development Insights"
        description="Read my latest articles on web development, programming tips, and technology insights."
        path="/blog"
        type="blog"
      />
      <main className="min-h-screen">
        <BlogSection posts={posts} />
      </main>
    </>
  );
}
