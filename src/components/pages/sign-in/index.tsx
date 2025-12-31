import { signIn } from '@/lib/auth';
import { Github, Chrome, AlertCircle } from 'lucide-react';
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
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Sign in to access your interview preparation sessions and track your progress.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400 leading-relaxed">
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
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-accent/50 transition-all group"
              >
                <Github size={20} className="group-hover:text-accent transition-colors" />
                <span className="font-semibold">Continue with GitHub</span>
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
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-accent/50 transition-all group"
              >
                <Chrome size={20} className="group-hover:text-accent transition-colors" />
                <span className="font-semibold">Continue with Google</span>
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-foreground/40 font-bold tracking-wider">
                Secure Authentication
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-foreground/40 text-xs leading-relaxed">
              By signing in, you agree to our terms of service and privacy policy.
              Your data is secure and never shared.
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-foreground/60 hover:text-accent transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-accent/10 via-transparent to-transparent blur-3xl opacity-30" />
      </div>
    </main>
  );
}
