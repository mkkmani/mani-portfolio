import { apiRequest } from './base';
import { IBlog, IPaginatedResponse } from '@/types/api';

export async function getBlogs(
  page: number = 1,
  limit: number = 9
): Promise<IPaginatedResponse<IBlog>> {
  try {
    return await apiRequest<IPaginatedResponse<IBlog>>('/api/blogs', {
      params: { page, limit },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        limit,
        hasMore: false,
      },
    };
  }
}

export async function getAllBlogs(): Promise<IBlog[]> {
  try {
    return await apiRequest<IBlog[]>('/api/blogs', {
      params: { all: true },
    });
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  try {
    return await apiRequest<IBlog>(`/api/blogs/${slug}`);
  } catch (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedBlogs(): Promise<IPaginatedResponse<IBlog>> {
  try {
    const response = await apiRequest<IPaginatedResponse<IBlog>>('/api/blogs', {
      params: { page: 1, limit: 100 },
    });

    const favourites = response.data.filter(b => b.favourite);

    if (favourites.length > 0) {
      return {
        data: favourites.slice(0, 3),
        pagination: {
          total: favourites.length,
          totalPages: 1,
          currentPage: 1,
          limit: 3,
          hasMore: false,
        },
      };
    }

    return {
      data: response.data.slice(0, 3),
      pagination: {
        total: response.data.length,
        totalPages: 1,
        currentPage: 1,
        limit: 3,
        hasMore: false,
      },
    };
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return {
      data: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 3,
        hasMore: false,
      },
    };
  }
}

export async function requestPublish(id: string): Promise<void> {
  try {
    await apiRequest(`/api/publish-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: 'blog',
        contentId: id,
      }),
    });
  } catch (error) {
    console.error('Request publish error:', error);
    throw error;
  }
}

export async function discardBlog(slug: string): Promise<void> {
  try {
    await apiRequest(`/api/blogs/${slug}?type=discard`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Discard blog error:', error);
    throw error;
  }
}

export async function permanentDeleteBlog(slug: string): Promise<void> {
  try {
    await apiRequest(`/api/blogs/${slug}?type=permanent`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Permanent delete blog error:', error);
    throw error;
  }
}
