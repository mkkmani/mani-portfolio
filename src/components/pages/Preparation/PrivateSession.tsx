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
        label: 'PENDING_REVIEW',
        title: 'Diagnostic Under Review',
        description: 'your request for public dissemination is currently being audited by the architectural board.',
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500/20',
        id: '02'
      };
    }
    if (requestStatus === 'rejected') {
      return {
        icon: AlertCircle,
        label: 'AUDIT_COMPLETED',
        title: 'Dissemination Denied',
        description: 'the diagnostic was reviewed but failed to meet the public dissemination protocols.',
        color: 'text-red-400',
        borderColor: 'border-red-500/20',
        id: '03'
      };
    }
    return {
      icon: Lock,
      label: 'ENCRYPTED_SESSION',
      title: 'Private Diagnostic',
      description: `this ${contentType === 'blog' ? 'mission log' : 'technical diagnostic'} is currently isolated from the public registry.`,
      color: 'text-accent',
      borderColor: 'border-white/5',
      id: '01'
    };
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black">
      <div className="max-w-2xl w-full border border-white/5 p-12 md:p-24 relative bg-black overflow-hidden">
        {/* Index */}
        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
            [ STATUS.{status.id} // {status.label} ]
          </span>
        </div>

        {/* Content */}
        <div className="space-y-8 mb-16">
          <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-tighter text-white">
            {status.title}
          </h1>
          <p className="text-xl text-foreground/40 font-light lowercase italic leading-relaxed">
            {status.description}
          </p>
          {!submitted && !hasExistingRequest && (
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
              // INITIALIZE PUBLIC DISSEMINATION PROTOCOL?
            </p>
          )}
        </div>

        {/* Action Button */}
        {!submitted && !hasExistingRequest && onRequestPublish && (
          <div className="mb-12">
            <button
              onClick={handleRequestPublish}
              disabled={isSubmitting}
              className="w-full flex items-center justify-between px-8 py-6 bg-white text-black hover:bg-accent transition-all duration-500 group disabled:opacity-50"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                {isSubmitting ? 'Processing...' : 'Request Dissemination'}
              </span>
              <CheckCircle2 size={20} className="group-hover:rotate-12 transition-transform duration-500" />
            </button>
          </div>
        )}

        {/* Status Info Badge */}
        {(submitted || hasExistingRequest) && (
          <div className={`p-8 border ${status.borderColor} bg-white/[0.02]`}>
            <div className="flex items-start gap-4">
              <StatusIcon size={20} className={`${status.color} mt-0.5`} />
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Transmission Received</h3>
                <p className="text-[10px] text-foreground/40 font-light lowercase italic leading-relaxed">
                  {requestStatus === 'pending' || submitted
                    ? 'your request has been successfully queued. further status updates will be logged in this terminal.'
                    : 'operational review is complete. no further actions required.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10" />
      </div>
    </div>
  );
}
