// Server-only functions for preparation API
import { cookies } from 'next/headers';
import { apiRequest } from './base';
import { IPreparation } from './preparation';

// Server-side function for fetching preparation data in Server Components
export async function getPreparationBySlugServer(slug: string): Promise<IPreparation | null> {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    return await apiRequest<IPreparation>(`/api/interview-prep?slug=${slug}`, {
      headers: {
        Cookie: cookieString,
      },
      cache: 'no-store',
    });
  } catch (error) {
    console.error(`Error fetching preparation ${slug}:`, error);
    return null;
  }
}
