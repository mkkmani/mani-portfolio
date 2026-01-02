import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  const getErrorDetails = (error?: string) => {
    switch (error) {
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to sign in or you cancelled the authorization.',
        };
      case 'OAuthAccountNotLinked':
        return {
          title: 'Account Already Exists',
          message: 'This email is already linked to another account. Please use the original sign-in method.',
        };
      case 'OAuthSignin':
      case 'OAuthCallback':
        return {
          title: 'Authentication Failed',
          message: 'An error occurred during sign-in. Please try again.',
        };
      case 'Configuration':
        return {
          title: 'Configuration Error',
          message: 'There is a server configuration issue. Please contact support.',
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'Something went wrong. Please try signing in again.',
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="bg-white/5 border border-white/10 p-8 text-center">
          {/* Error Icon */}
          <div className="inline-flex w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full items-center justify-center mb-6">
            <AlertCircle size={32} className="text-red-400" />
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold mb-3">
            {errorDetails.title}
          </h1>

          {/* Error Message */}
          <p className="text-foreground/60 mb-8 leading-relaxed">
            {errorDetails.message}
          </p>

          {/* Error Code */}
          {error && (
            <div className="mb-6 p-3 bg-black/20 border border-white/5 rounded">
              <p className="text-xs text-foreground/40 font-mono">
                Error: {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-accent text-black font-bold hover:bg-white transition-all"
            >
              <ArrowLeft size={18} />
              Try Again
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-accent/50 font-semibold transition-all"
            >
              <Home size={18} />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
