import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const title =
  "Mani | Full Stack MERN Developer | Building Scalable Web Applications";
const description =
  "Experienced Full Stack MERN Developer specializing in building high-performance, scalable web applications. Expert in MongoDB, Express.js, React.js, and Node.js.";
const siteUrl = "https://yourportfolio.com"; // Replace with your actual domain

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | Mani - MERN Stack Developer`,
  },
  description: description,
  keywords: [
    "MERN Stack Developer",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "MongoDB Expert",
    "Express.js",
    "JavaScript",
    "TypeScript",
    "Web Development",
    "Portfolio",
  ],
  authors: [{ name: "Mani" }],
  creator: "Mani",
  publisher: "Mani",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: title,
    description: description,
    url: siteUrl,
    siteName: "Mani - MERN Stack Developer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`, // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "Mani - MERN Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    creator: "@yourtwitter", // Replace with your Twitter handle
    images: [`${siteUrl}/images/twitter-card.jpg`], // Replace with your Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Add Google Search Console verification
    yandex: "YOUR_YANDEX_VERIFICATION_CODE", // Add Yandex verification if needed
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mani - MERN Stack",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "msapplication-TileColor": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />

        {/* Structured Data for better SEO */}
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
            jobTitle: "Full Stack MERN Developer",
            worksFor: {
              "@type": "Organization",
              name: "Your Company or Freelance",
            },
            description: description,
          })}
        </script>
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,100,100,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
          </div>
          <div className="min-h-screen flex flex-col">
            {children}
            <Navbar />
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
