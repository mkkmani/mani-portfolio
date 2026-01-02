'use client';

import { useRouter } from 'next/navigation';
import PublishActionBar from './PublishActionBar';
import { togglePreparationPublish, requestPublish as requestPreparationPublish, discardPreparation, permanentDeletePreparation } from '@/services/api/preparation';
import { requestPublish as requestBlogPublish, discardBlog, permanentDeleteBlog } from '@/services/api/blogs';

interface ClientPublishActionBarProps {
  userRole: 'admin' | 'owner' | 'viewer';
  published: boolean;
  contentType: 'blog' | 'preparation';
  contentId: string;
  contentSlug?: string; // For blogs we need the slug
  canRequestPublish: boolean;
  hasPublishRequest: boolean;
  publishRequestStatus?: 'pending' | 'approved' | 'rejected';
  canPublish: boolean;
}

export default function ClientPublishActionBar(props: ClientPublishActionBarProps) {
  const router = useRouter();

  const handlePublish = async () => {
    if (props.contentType === 'preparation') {
      await togglePreparationPublish(props.contentId, true);
    }
    // For blogs, we'll need to implement a similar toggle function
    router.push('/get-access'); // Redirect to admin panel after publish
    router.refresh();
  };

  const handleRequestPublish = async () => {
    if (props.contentType === 'preparation') {
      await requestPreparationPublish(props.contentId);
    } else {
      await requestBlogPublish(props.contentId);
    }
    router.refresh();
  };

  const handleDiscard = async () => {
    if (props.contentType === 'preparation') {
      await discardPreparation(props.contentId);
    } else if (props.contentSlug) {
      await discardBlog(props.contentSlug);
    }
    router.push('/get-access'); // Redirect to admin panel after discard
    router.refresh();
  };

  const handlePermanentDelete = async () => {
    if (props.contentType === 'preparation') {
      await permanentDeletePreparation(props.contentId);
    } else if (props.contentSlug) {
      await permanentDeleteBlog(props.contentSlug);
    }
    router.push('/get-access'); // Redirect to admin panel after delete
    router.refresh();
  };

  return (
    <PublishActionBar
      {...props}
      onPublish={props.canPublish ? handlePublish : undefined}
      onRequestPublish={props.canRequestPublish ? handleRequestPublish : undefined}
      onDiscard={props.userRole === 'admin' ? handleDiscard : undefined}
      onPermanentDelete={props.userRole === 'admin' ? handlePermanentDelete : undefined}
    />
  );
}
