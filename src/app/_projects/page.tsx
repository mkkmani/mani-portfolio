import { Seo } from "@/components/seo/Seo";
import { ProjectsSection } from "@/components/pages/Projects/ProjectsSection";

export const metadata = {
  title: "Projects | Mani - Full Stack Developer",
  description:
    "Explore my portfolio of web development projects. See examples of my work with React, Node.js, and other modern web technologies.",
  keywords: [
    "Projects",
    "Portfolio",
    "Web Development Projects",
    "React Projects",
    "Full Stack Projects",
    "Mani Work",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/projects",
    title: "Projects | Mani - Full Stack Developer",
    description:
      "Explore my portfolio of web development projects built with modern technologies.",
    images: [
      {
        url: "/images/og-projects.jpg",
        width: 1200,
        height: 630,
        alt: "Projects - Mani Portfolio",
      },
    ],
    siteName: "Mani - Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Mani - Full Stack Developer",
    description:
      "Explore my portfolio of web development projects built with modern technologies.",
    images: ["/images/og-projects.jpg"],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <Seo
        title="Projects | Mani - Full Stack Developer"
        description="Explore my portfolio of web development projects built with modern technologies."
        path="/projects"
      />
      <main className="min-h-screen">
        <ProjectsSection />
      </main>
    </>
  );
}
