import 'server-only';
import { cache } from 'react';
import dbConnect from '@/server/db';
import Blog from '@/server/models/Blog';
import { auth } from '@/lib/auth';
import { verifyAdminCookies } from '@/lib/verify-admin';
import { IBlog } from '@/types/api';
import { serialize } from '@/lib/data/serialize';

export const getBlogBySlugServer = cache(async (slug: string): Promise<IBlog | null> => {
  await dbConnect();
  const blog = await Blog.findOne({ slug }).lean();
  if (!blog) return null;

  if (blog.published) return serialize(blog) as unknown as IBlog;

  const [isAdmin, session] = await Promise.all([verifyAdminCookies(), auth()]);
  const isOwner = !!(session?.user?.id && blog.userId?.toString() === session.user.id);
  const hasPublishRequest = (blog.publishRequests?.length ?? 0) > 0;

  if (isAdmin || isOwner) {
    return {
      ...(serialize(blog) as unknown as IBlog),
      userRole: isAdmin ? 'admin' : 'owner',
      canPublish: isAdmin,
      canRequestPublish: isOwner,
      hasPublishRequest,
      publishRequestStatus: blog.publishRequests?.[0]?.status,
    };
  }

  const safe = serialize(blog) as unknown as IBlog;
  delete safe.content;
  delete safe.publishRequests;
  return {
    ...safe,
    userRole: 'viewer',
    canPublish: false,
    canRequestPublish: true,
    hasPublishRequest,
  };
});
