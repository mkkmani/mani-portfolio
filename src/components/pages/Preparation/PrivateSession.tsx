'use client';

import { Lock, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface PrivateSessionProps {
  contentType: 'blog' | 'preparation';
  contentId: string;
  hasExistingRequest: boolean;
  requestStatus?: 'pending' | 'approved' | 'rejected';
  onRequestPublish?: () => Promise<void>;
}

export default function PrivateSession({
  contentType,
  contentId,
  hasExistingRequest,
  requestStatus,
  onRequestPublish,
}: PrivateSessionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(hasExistingRequest);

  const handleRequestPublish = async () => {
    if (isSubmitting || !onRequestPublish) return;

    setIsSubmitting(true);
    try {
      await onRequestPublish();
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit publish request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusDisplay = () => {
    if (requestStatus === 'pending' || submitted) {
      return {
        icon: Clock,
        title: 'Under Review',
        description: 'This content is currently under review by our team',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
      };
    }
    if (requestStatus === 'rejected') {
      return {
        icon: AlertCircle,
        title: 'Review Completed',
        description: 'This content was reviewed but not approved for publication',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
      };
    }
    return {
      icon: Lock,
      title: 'Private Session',
      description: `This ${contentType === 'blog' ? 'blog post' : 'interview preparation session'} is currently private`,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
    };
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className={`absolute inset-0 ${status.bgColor} blur-3xl rounded-full`} />
            <div className={`relative w-24 h-24 bg-gradient-to-br ${status.bgColor} border-2 ${status.borderColor} rounded-full flex items-center justify-center`}>
              <StatusIcon size={40} className={status.color} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {status.title}
          </h1>
          <p className="text-xl text-foreground/60 mb-2">
            {status.description}
          </p>
          {!submitted && !hasExistingRequest && (
            <p className="text-sm text-foreground/40">
              Want this content to be public? Request publication below
            </p>
          )}
        </div>

        {/* Action Button - Show for all users if no request exists */}
        {!submitted && !hasExistingRequest && onRequestPublish && (
          <div className="mb-8">
            <button
              onClick={handleRequestPublish}
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-accent text-black hover:bg-white transition-all font-bold text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Request Publication
                </>
              )}
            </button>
          </div>
        )}

        {/* Status Info */}
        {(submitted || hasExistingRequest) && (
          <div className={`${status.bgColor} border ${status.borderColor} p-6 mb-8`}>
            <div className="flex items-start gap-3">
              <StatusIcon size={20} className={`${status.color} mt-0.5`} />
              <div>
                <h3 className="font-bold mb-1">Publication Request Submitted</h3>
                <p className="text-sm text-foreground/70">
                  {requestStatus === 'pending' || submitted
                    ? 'A request has been submitted and is awaiting review by our team. You\'ll be notified once it\'s been processed.'
                    : 'This content has been reviewed. Thank you for your interest.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
