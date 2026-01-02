import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '@/lib/config';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token');

  // Check if token exists
  if (!token) {
    redirect('/get-access/login');
  }

  // Verify token
  try {
    await jwtVerify(token.value, JWT_SECRET);
  } catch (error) {
    redirect('/get-access/login');
  }

  return <>{children}</>;
}
