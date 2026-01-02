// Server-only functions for blog API
import { cookies } from 'next/headers';
import { apiRequest } from './base';
import { IBlog } from '@/types/api';

// Server-side function for fetching blog data in Server Components
export async function getBlogBySlugServer(slug: string): Promise<IBlog | null> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    return await apiRequest<IBlog>(`/api/blogs/${slug}`, {
      headers: {
        Cookie: cookieString,
      },
      cache: 'no-store',
    });
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
}
