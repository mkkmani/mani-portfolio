import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import ProfileHeader from '@/components/pages/profile/ProfileHeader';
import ProfileStats from '@/components/pages/profile/ProfileStats';
import SessionsList from '@/components/pages/profile/SessionsList';

export default async function Profile() {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/profile');
  }

  const user = session.user;

  // Fetch user's own sessions
  const cookieStore = await cookies();
  const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/sessions`;

  let userPreparations: any[] = [];
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (response.ok) {
      userPreparations = await response.json();
    }
  } catch (error) {
    console.error('[Profile] Failed to fetch sessions:', error);
  }

  // Calculate stats
  const totalSessions = userPreparations.length;
  const difficulties = userPreparations.reduce((acc: any, prep: any) => {
    acc[prep.difficulty] = (acc[prep.difficulty] || 0) + 1;
    return acc;
  }, {});

  const mostCommonDifficulty = Object.keys(difficulties).length > 0
    ? Object.entries(difficulties).sort((a: any, b: any) => b[1] - a[1])[0][0]
    : 'N/A';

  const totalMessages = userPreparations.reduce((acc: number, prep: any) => {
    return acc + (prep.messages?.length || 0);
  }, 0);

  const joinedDate = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <main className="min-h-screen bg-background py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <ProfileHeader user={user} />

        <ProfileStats
          stats={{
            totalSessions,
            mostCommonDifficulty,
            totalMessages,
            joinedDate
          }}
        />

        <SessionsList sessions={userPreparations} />
      </div>
    </main>
  );
}
