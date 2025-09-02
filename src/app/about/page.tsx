import { Seo } from "@/components/seo/Seo";
import { AboutSection } from "@/components/pages/About/AboutSection";

export const metadata = {
  title: "About Me | Mani - Full Stack Developer",
  description:
    "Learn more about my skills, experience, and journey as a Full Stack Developer. Discover what drives me in the world of web development.",
  keywords: [
    "About Me",
    "Full Stack Developer",
    "Web Developer Skills",
    "Experience",
    "Mani Portfolio",
  ],
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "/about",
    title: "About Me | Mani - Full Stack Developer",
    description:
      "Learn more about my skills, experience, and journey as a Full Stack Developer.",
    images: [
      {
        url: "/images/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Mani - Full Stack Developer",
      },
    ],
    siteName: "Mani - Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me | Mani - Full Stack Developer",
    description:
      "Learn more about my skills, experience, and journey as a Full Stack Developer.",
    images: ["/images/og-about.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Me | Mani - Full Stack Developer"
        description="Learn more about my skills, experience, and journey as a Full Stack Developer."
        path="/about"
        type="profile"
      />
      <main className="min-h-screen">
        <AboutSection />
      </main>
    </>
  );
}
