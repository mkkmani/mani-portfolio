import SignIn from '@/components/pages/sign-in';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  return <SignIn searchParams={params} />;
}
