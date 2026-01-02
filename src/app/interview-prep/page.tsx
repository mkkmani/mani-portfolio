import { getPreparations } from '@/services/api/preparation';
import Link from 'next/link';
import { BrainCircuit, ArrowRight, BookOpen, User } from 'lucide-react';
import FAQSection from '@/components/FAQ/FAQSection';
import { interviewPrepFAQs } from '@/lib/faq-data';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateBreadcrumbSchema } from '@/lib/structured-data';
import PreparationsPagination from '@/components/PreparationsPagination';

export const metadata: Metadata = generatePageMetadata({
  title: 'AI Interview Preparation | Manikanta Ketha',
  description: 'Master your technical interviews with AI-powered preparation guides by Manikanta Ketha. Interactive interview coaching for MERN Stack, JavaScript, React, and software engineering roles.',
  keywords: [
    'Manikanta Ketha interview prep',
    'AI interview coach',
    'technical interview preparation',
    'MERN Stack interview',
    'JavaScript interview questions',
    'React interview prep',
    'coding interview practice',
  ],
  path: '/interview-prep',
});

export const dynamic = 'force-dynamic';

export default async function PreparationPage() {
  const session = await auth();
  const allPreparations = await getPreparations();
  const config = getSiteConfig();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview-prep' }
  ], config);

  const preparations = session?.user
    ? allPreparations.filter((prep: any) =>
      prep.userId?.toString() === session.user.id
    )
    : allPreparations.filter((prep: any) => !prep.userId); // Show only anonymous preps when not logged in

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="max-w-7xl mx-auto px-6 md:px-0 py-12 md:py-16">
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-6 border border-accent/20">
            <BrainCircuit size={14} />
            AI Interview Prep
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Master Your <span className="text-accent">Interview</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Explore curated preparation guides or start a new interactive session with our AI interviewer.
          </p>

          {/* Auth Status */}
          {session?.user ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/60">
              <User size={16} className="text-accent" />
              <span>Signed in as <span className="text-accent font-semibold">{session.user.email}</span></span>
              <span className="mx-2">•</span>
              <Link href="/profile" className="text-accent hover:underline">
                View Profile
              </Link>
            </div>
          ) : (
            <div className="mt-6">
              <Link href="/sign-in" className="text-sm text-foreground/60 hover:text-accent transition-colors">
                Sign in to save and track your sessions →
              </Link>
            </div>
          )}
        </div>

        <PreparationsPagination
          preparations={preparations}
          isUserSession={!!session?.user}
        />

        <div className="mb-16 mt-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <BrainCircuit size={24} className="text-accent" />
            Start a New Practice Session
          </h2>
          <Link
            href="/interview-prep/new"
            className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
          >
            <div className="relative z-10 text-center md:text-left flex-1">
              <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight text-foreground group-hover:text-accent transition-colors">
                Custom AI Interview Session
              </h3>
              <p className="text-foreground/60 font-medium leading-relaxed">
                Launch a personalized interview session tailored to your topic and difficulty level.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-3 font-bold mt-6 text-accent uppercase tracking-wider text-sm">
                <span className="bg-accent text-black px-5 py-2.5 hover:bg-white transition-colors flex items-center gap-2">
                  Start Session <ArrowRight size={16} />
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-accent/20">
                <BrainCircuit size={40} className="text-accent" />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>

        <FAQSection
          faqs={interviewPrepFAQs}
          title="Interview Prep FAQs"
          description="Common questions about AI-powered interview preparation."
        />
      </main>
    </>
  );
}
