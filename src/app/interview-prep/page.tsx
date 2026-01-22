import { getPreparations } from "@/services/api/preparation";
import Link from "next/link";
import {
  BrainCircuit,
  ArrowRight,
  BookOpen,
  User,
  ArrowLeft,
} from "lucide-react";
import FAQSection from "@/components/FAQ/FAQSection";
import { interviewPrepFAQs } from "@/lib/faq-data";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { generatePageMetadata, getSiteConfig } from "@/lib/seo-config";
import { generateBreadcrumbSchema } from "@/lib/structured-data";
import PreparationsPagination from "@/components/PreparationsPagination";

export const metadata: Metadata = generatePageMetadata({
  title: "AI Interview Preparation | Manikanta Ketha",
  description:
    "Master your technical interviews with AI-powered preparation guides by Manikanta Ketha. Interactive interview coaching for MERN Stack, JavaScript, React, and software engineering roles.",
  keywords: [
    "Manikanta Ketha interview prep",
    "AI interview coach",
    "technical interview preparation",
    "MERN Stack interview",
    "JavaScript interview questions",
    "React interview prep",
    "coding interview practice",
  ],
  path: "/interview-prep",
});

export const dynamic = "force-dynamic";

export default async function PreparationPage() {
  const session = await auth();
  const allPreparations = await getPreparations();
  const config = getSiteConfig();
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", url: "/" },
      { name: "Interview Prep", url: "/interview-prep" },
    ],
    config
  );

  // const preparations = session?.user
  //   ? allPreparations // Show all sessions when user is logged in
  //   : allPreparations.filter((prep: any) => !prep.userId); // Show only public sessions when not logged in
 const preparations = allPreparations
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen bg-black pt-48 pb-24 px-6 md:pl-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
                [ SERVICE.01 // INTELLIGENCE ]
              </span>
              <h1 className="text-6xl md:text-9xl font-serif uppercase tracking-tighter text-white">
                Interview
                <br />
                Prep
              </h1>
            </div>

            <Link
              href="/"
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-accent border-b border-white/5 pb-2 transition-all duration-500"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Home
            </Link>
          </div>

          <div className="mb-32">
            <p className="text-xl md:text-2xl text-foreground/50 leading-[1.3] font-light lowercase max-w-2xl italic">
              advanced diagnostic tools for technical recruitment.{" "}
              <span className="text-white italic">ai-powered</span> simulations
              to sharpen your structural logic.
            </p>

            {session?.user ? (
              <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                <User size={14} />
                <span>USER_ACTIVE: {session.user.email}</span>
                <span className="text-foreground/20">//</span>
                <Link
                  href="/profile"
                  className="hover:text-white transition-colors"
                >
                  REGISTRY
                </Link>
              </div>
            ) : (
              <div className="mt-12">
                <Link
                  href="/sign-in"
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 hover:text-accent transition-all"
                >
                  // AUTHENTICATE TO PERSIST SESSION DATA
                </Link>
              </div>
            )}
          </div>

          <div className="mb-48">
            <PreparationsPagination
              preparations={preparations}
              isUserSession={!!session?.user}
            />
          </div>

          <div className="grid md:grid-cols-12 gap-12 items-center mb-48">
            <div className="md:col-span-8 md:col-start-3">
              <Link
                href="/interview-prep/new"
                className="group block relative p-12 md:p-24 bg-white/5 border border-white/5 overflow-hidden transition-all duration-700 hover:border-accent"
              >
                <div className="relative z-10 space-y-12">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
                      [ INITIATE.01 // NEW SESSION ]
                    </span>
                    <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white group-hover:text-accent transition-colors">
                      Custom AI
                      <br />
                      Diagnostic
                    </h3>
                  </div>

                  <p className="text-xl text-foreground/40 font-light lowercase italic max-w-xl">
                    launch a high-fidelity simulation tailored to your specific
                    technical stack and difficulty preference.
                  </p>

                  <div className="flex items-center gap-8 pt-12">
                    <span className="flex items-center gap-6 px-12 py-6 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] group-hover:bg-accent transition-all duration-500">
                      Start Session
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-2 transition-transform duration-500"
                      />
                    </span>
                  </div>
                </div>

                {/* Decorative AI Icon */}
                <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000 grayscale">
                  <BrainCircuit size={400} />
                </div>
              </Link>
            </div>
          </div>

          <FAQSection
            faqs={interviewPrepFAQs}
            title="SOP/FAQ"
            description="// OPERATIONAL PROCEDURES."
          />
        </div>
      </main>
    </>
  );
}
