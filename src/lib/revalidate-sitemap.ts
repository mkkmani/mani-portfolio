import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

/**
 * Revalidate the sitemap to include newly added content
 * Call this after creating or publishing new blogs/interview prep content
 *
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function revalidateSitemap(): Promise<{ success: boolean; message: string }> {
  try {
    revalidateTag(CACHE_TAGS.blogs, 'max');
    revalidateTag(CACHE_TAGS.preparations, 'max');
    revalidatePath('/sitemap.xml');
    revalidatePath('/feed.xml');

    console.log('[SEO] Sitemap revalidated successfully');

    return {
      success: true,
      message: 'Sitemap revalidated successfully'
    };
  } catch (error) {
    console.error('[SEO] Error revalidating sitemap:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to revalidate sitemap'
    };
  }
}

/**
 * Revalidate specific blog or preparation page
 * 
 * @param {string} type - 'blog' or 'preparation'
 * @param {string} slug - The slug of the content
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function revalidateContentPage(
  type: 'blog' | 'preparation',
  slug: string
): Promise<{ success: boolean; message: string }> {
  try {
    const path = type === 'blog' ? `/notelogs/${slug}` : `/interview-prep/${slug}`;

    revalidatePath(path);
    console.log(`[SEO] Page revalidated: ${path}`);

    return {
      success: true,
      message: `Page ${path} revalidated successfully`
    };
  } catch (error) {
    console.error('[SEO] Error revalidating page:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to revalidate page'
    };
  }
}

/**
 * Revalidate both sitemap and content page
 * Use this as a comprehensive update after publishing content
 * 
 * @param {string} type - 'blog' or 'preparation'
 * @param {string} slug - The slug of the content
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function revalidateContentAndSitemap(
  type: 'blog' | 'preparation',
  slug: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Revalidate the content page
    await revalidateContentPage(type, slug);

    // Revalidate the sitemap
    await revalidateSitemap();

    // Revalidate the list pages
    if (type === 'blog') {
      revalidatePath('/notelogs');
    } else {
      revalidatePath('/interview-prep');
    }

    console.log(`[SEO] Full revalidation completed for ${type}: ${slug}`);

    return {
      success: true,
      message: `Content and sitemap revalidated successfully for ${slug}`
    };
  } catch (error) {
    console.error('[SEO] Error in full revalidation:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to revalidate content and sitemap'
    };
  }
}
