import 'server-only';
import { cache } from 'react';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import { auth } from '@/lib/auth';
import { verifyAdminCookies } from '@/lib/verify-admin';
import { IPreparation, IMessage } from './preparation';
import { serialize } from '@/lib/data/serialize';

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function normalize(doc: Record<string, unknown>): IPreparation {
  const d = serialize(doc) as Record<string, unknown>;
  const prepData = (d.preparationData ?? {}) as { practicalExamples?: IMessage[] };
  const messages =
    (Array.isArray(d.messages) && d.messages.length
      ? (d.messages as IMessage[])
      : prepData.practicalExamples) ?? [];
  return {
    ...(d as unknown as IPreparation),
    title: (d.topic as string) ?? '',
    difficulty: cap((d.difficulty as string) ?? 'intermediate') as IPreparation['difficulty'],
    messages,
  };
}

export const getPreparationBySlugServer = cache(async (slug: string): Promise<IPreparation | null> => {
  await dbConnect();
  const prep = await Preparation.findOne({ slug }).lean();
  if (!prep) return null;

  if (prep.published) return normalize(prep as unknown as Record<string, unknown>);

  const [isAdmin, session] = await Promise.all([verifyAdminCookies(), auth()]);
  const isOwner = !!(session?.user?.id && prep.userId?.toString() === session.user.id);
  const hasPublishRequest = (prep.publishRequests?.length ?? 0) > 0;

  if (isAdmin || isOwner) {
    return {
      ...normalize(prep as unknown as Record<string, unknown>),
      userRole: isAdmin ? 'admin' : 'owner',
      canPublish: isAdmin,
      canRequestPublish: isOwner && !prep.published,
      hasPublishRequest,
      publishRequestStatus: prep.publishRequests?.[0]?.status,
    };
  }

  const safe = normalize(prep as unknown as Record<string, unknown>);
  safe.messages = [];
  return {
    ...safe,
    userRole: 'viewer',
    canPublish: false,
    canRequestPublish: true,
    hasPublishRequest,
  };
});
