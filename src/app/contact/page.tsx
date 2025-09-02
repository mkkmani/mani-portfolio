import { Seo } from "@/components/seo/Seo";
// import ContactSectionCard from "@/components/sections/contact";
import ContactMe from "@/components/pages/contact/ContactMe";
export const metadata = {
  title: "Contact Me | Mani - Full Stack Developer",
  description:
    "Get in touch with me for collaboration, job opportunities, or just to say hello. I'd love to hear from you!",
  keywords: [
    "Contact",
    "Hire Me",
    "Get in Touch",
    "Full Stack Developer",
    "Web Development",
    "Mani Contact",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/contact",
    title: "Contact Me | Mani - Full Stack Developer",
    description:
      "Get in touch with me for collaboration, job opportunities, or just to say hello!",
    images: [
      {
        url: "/images/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Mani - Full Stack Developer",
      },
    ],
    siteName: "Mani - Contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Me | Mani - Full Stack Developer",
    description:
      "Get in touch with me for collaboration, job opportunities, or just to say hello!",
    images: ["/images/og-contact.jpg"],
  },
};

export default function ContactPage() {
  // In a real app, you would get this from environment variables or config
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yourportfolio.com";

  return (
    <>
      <Seo
        title="Contact Me | Mani - Full Stack Developer"
        description="Get in touch with me for collaboration, job opportunities, or just to say hello!"
        path="/contact"
      />
      <main className="min-h-screen">
        {/* <ContactSectionCard /> */}
        <ContactMe />
      </main>

      {/* Structured Data for Contact Information */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Mani",
            description: "Contact page for Mani, Full Stack Developer",
            url: `${siteUrl}/contact`,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              email: "hello@example.com",
              availableLanguage: "English",
              contactOption: "TollFree",
            },
          }),
        }}
      />
    </>
  );
}
