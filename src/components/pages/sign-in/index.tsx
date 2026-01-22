import { signIn } from '@/lib/auth';
import { Github, Chrome, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SignInProps {
  searchParams: { callbackUrl?: string; error?: string };
}

export default function SignIn({ searchParams }: SignInProps) {
  const callbackUrl = searchParams.callbackUrl || '/';
  const error = searchParams.error;

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'An account with this email already exists. Please sign in with the same provider you used originally.';
      case 'OAuthSignin':
        return 'Error occurred during sign-in. Please try again.';
      case 'OAuthCallback':
        return 'Error occurred during the OAuth callback. Please try again.';
      case 'AccessDenied':
        return 'Access denied. You cancelled the sign-in process.';
      default:
        return 'An error occurred during sign-in. Please try again.';
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-black">
      <div className="w-full max-w-2xl border border-white/5 relative bg-black p-8 md:p-16">
        {/* Header */}
        <div className="space-y-6 mb-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ AUTH.SYSTEM // ACCESS ]
            </span>
            <h1 className="text-5xl md:text-8xl font-serif uppercase tracking-tighter text-white">
              Identity<br />Verification
            </h1>
          </div>
          <p className="text-xl text-foreground/40 font-light lowercase italic leading-relaxed max-w-md">
            authenticate to synchronize your technical diagnostics and persistent mission logs.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-12 p-8 bg-red-500/5 border border-red-500/20 flex items-start gap-4">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 leading-relaxed">
              {getErrorMessage(error)}
            </p>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-4">
          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-between px-8 py-6 bg-white text-black hover:bg-accent transition-all duration-500 group"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Continue with GitHub</span>
              <Github size={20} className="group-hover:rotate-12 transition-transform duration-500" />
            </button>
          </form>

          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-between px-8 py-6 border border-white/10 text-white hover:border-white transition-all duration-500 group"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Continue with Google</span>
              <Chrome size={20} className="group-hover:rotate-12 transition-transform duration-500" />
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="relative my-12 border-t border-white/5">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-6 text-[8px] font-black uppercase tracking-[0.5em] text-foreground/20">
            Secure Terminal
          </div>
        </div>

        {/* Footer */}
        <div className="mb-12">
          <p className="text-[10px] text-foreground/20 font-light lowercase italic leading-loose text-center">
            by initiating access, you acknowledge the terms of operational security.
            data encryption is enforced at all protocol layers.
          </p>
        </div>

        {/* Back Link */}
        <div className="pt-12 border-t border-white/5 flex justify-center">
          <Link
            href="/"
            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-white transition-all duration-500"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Abort Transition
          </Link>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10" />
      </div>
    </main>
  );
}
