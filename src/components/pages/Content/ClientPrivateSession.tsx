'use client';

import { useRouter } from 'next/navigation';
import PrivateSession from '../Preparation/PrivateSession';
import { requestPublish as requestPreparationPublish } from '@/services/api/preparation';
import { requestPublish as requestBlogPublish } from '@/services/api/blogs';

interface ClientPrivateSessionProps {
  contentType: 'blog' | 'preparation';
  contentId: string;
  hasExistingRequest: boolean;
  requestStatus?: 'pending' | 'approved' | 'rejected';
  canRequestPublish: boolean;
}

export default function ClientPrivateSession(props: ClientPrivateSessionProps) {
  const router = useRouter();

  const handleRequestPublish = async () => {
    if (props.contentType === 'preparation') {
      await requestPreparationPublish(props.contentId);
    } else {
      await requestBlogPublish(props.contentId);
    }
    router.refresh();
  };

  return (
    <PrivateSession
      contentType={props.contentType}
      contentId={props.contentId}
      hasExistingRequest={props.hasExistingRequest}
      requestStatus={props.requestStatus}
      onRequestPublish={handleRequestPublish}
    />
  );
}
