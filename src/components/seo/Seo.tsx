import { ENV_CONFIG } from "@/config/envConfig";
import Head from "next/head";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "profile" | "book" | "blog" | "contact";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export const Seo = ({
  title = "Mani | Full Stack Developer",
  description = "Experienced Full Stack Developer specializing in modern web technologies. Check out my portfolio and projects.",
  path = "/",
  keywords = [
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Node.js",
    "TypeScript",
    "Portfolio",
  ],
  image = "/images/og-image.jpg",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Mani",
}: SeoProps) => {
  const siteUrl = ENV_CONFIG.NEXT_PUBLIC_APP_URL;
  const fullUrl = `${siteUrl}${path}`;
  const fullImageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Mani",
          url: siteUrl,
          sameAs: [
            "https://github.com/yourusername",
            "https://linkedin.com/in/yourusername",
            "https://twitter.com/yourusername",
          ],
          jobTitle: "Full Stack Developer",
          worksFor: {
            "@type": "Organization",
            name: "Your Company",
          },
        })}
      </script>

      {/* Additional meta tags */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      <meta name="theme-color" content="#000000" />
    </Head>
  );
};
