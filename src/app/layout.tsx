import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Common/Navbar";
import Footer from "@/components/Common/Footer";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import Providers from "@/components/Providers";
import { getSiteConfig } from "@/lib/seo-config";
import { generatePersonSchema, generateOrganizationSchema, generateWebsiteSchema, generateProfessionalServiceSchema, generateNavigationSchema } from "@/lib/structured-data";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteConfig = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Manikanta Ketha',
    'Mani Kanta',
    'Full Stack Developer',
    'MERN Stack Developer',
    'Next.js Developer',
    'React Developer',
    'Node.js Developer',
    'MongoDB Expert',
    'TypeScript Developer',
    'JavaScript Developer',
    'India Developer',
    'Remote Developer',
    'Software Engineer',
    'Web Developer',
    'Responsive Web Design',
    'API Development',
  ],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = generatePersonSchema(siteConfig);
  const organizationSchema = generateOrganizationSchema(siteConfig);
  const websiteSchema = generateWebsiteSchema(siteConfig);
  const professionalServiceSchema = generateProfessionalServiceSchema(siteConfig);
  const navigationSchema = generateNavigationSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Work', url: '/work' },
    { name: 'Projects', url: '/projects' },
    { name: 'Notelogs', url: '/notelogs' },
    { name: 'Interview Prep', url: '/interview-prep' },
    { name: 'Contact', url: '/contact' },
  ], siteConfig);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="alternate" type="application/rss+xml" title="Notelogs by Manikanta Ketha" href="/feed.xml" />
        <link rel="alternate" type="application/rss+xml" title="Notelogs by Manikanta Ketha" href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
        />
      </head>
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <Providers>
          <Navbar />
          <Breadcrumbs />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
