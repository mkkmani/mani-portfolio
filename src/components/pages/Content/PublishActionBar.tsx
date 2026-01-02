'use client';

import { CheckCircle2, Send, Clock, Trash2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface PublishActionBarProps {
  userRole: 'admin' | 'owner' | 'viewer';
  published: boolean;
  contentType: 'blog' | 'preparation';
  contentId: string;
  canRequestPublish: boolean;
  hasPublishRequest: boolean;
  publishRequestStatus?: 'pending' | 'approved' | 'rejected';
  onPublish?: () => Promise<void>;
  onRequestPublish?: () => Promise<void>;
  onDiscard?: () => Promise<void>;
  onPermanentDelete?: () => Promise<void>;
}

export default function PublishActionBar({
  userRole,
  published,
  contentType,
  contentId,
  canRequestPublish,
  hasPublishRequest,
  publishRequestStatus,
  onPublish,
  onRequestPublish,
  onDiscard,
  onPermanentDelete,
}: PublishActionBarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<'discard' | 'permanent' | null>(null);

  if (published || userRole === 'viewer') {
    return null;
  }

  const handleAction = async (action: () => Promise<void> | undefined) => {
    if (!action || isProcessing) return;

    setIsProcessing(true);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (type: 'discard' | 'permanent') => {
    setShowConfirmDialog(null);
    setShowDeleteMenu(false);

    if (type === 'discard' && onDiscard) {
      await handleAction(onDiscard);
    } else if (type === 'permanent' && onPermanentDelete) {
      await handleAction(onPermanentDelete);
    }
  };

  // Admin view - show publish button and delete options
  if (userRole === 'admin' && onPublish) {
    return (
      <div className="sticky top-20 z-10 bg-accent/10 border-b border-accent/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm uppercase tracking-wide">
              Draft Content - Admin View
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Delete Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 transition-all font-semibold text-sm uppercase tracking-wide"
                disabled={isProcessing}
              >
                <Trash2 size={18} />
                Delete
                <ChevronDown size={16} />
              </button>

              {showDeleteMenu && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-background border border-white/10 shadow-lg z-20">
                  <button
                    onClick={() => setShowConfirmDialog('discard')}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/10"
                  >
                    <div className="font-semibold text-sm">Discard</div>
                    <div className="text-xs text-foreground/60 mt-1">Mark as discarded (soft delete)</div>
                  </button>
                  <button
                    onClick={() => setShowConfirmDialog('permanent')}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors text-red-400"
                  >
                    <div className="font-semibold text-sm">Permanent Delete</div>
                    <div className="text-xs text-red-400/80 mt-1">Remove from database forever</div>
                  </button>
                </div>
              )}
            </div>

            {/* Publish Button */}
            <button
              onClick={() => handleAction(onPublish)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent text-black hover:bg-white transition-all font-bold text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                'Publishing...'
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Publish Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border border-white/10 p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-2">
                {showConfirmDialog === 'discard' ? 'Discard Content?' : 'Permanently Delete?'}
              </h3>
              <p className="text-foreground/70 mb-6">
                {showConfirmDialog === 'discard'
                  ? 'This will mark the content as discarded. You can restore it later from the admin dashboard.'
                  : 'This action is IRREVERSIBLE. The content will be permanently removed from the database.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(null)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showConfirmDialog)}
                  className={`flex-1 px-4 py-2 transition-colors ${showConfirmDialog === 'permanent'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-accent hover:bg-white text-black'
                    }`}
                >
                  {showConfirmDialog === 'discard' ? 'Discard' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Owner view - show request publish button or status (no delete)
  if (userRole === 'owner') {
    if (hasPublishRequest && publishRequestStatus === 'pending') {
      return (
        <div className="sticky top-20 z-10 bg-yellow-500/10 border-b border-yellow-500/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-yellow-400" />
              <div>
                <span className="font-semibold text-sm uppercase tracking-wide block">
                  Publish Request Submitted
                </span>
                <span className="text-xs text-foreground/60">
                  Awaiting admin review
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wider">
              Under Review
            </span>
          </div>
        </div>
      );
    }

    if (canRequestPublish && onRequestPublish) {
      return (
        <div className="sticky top-20 z-10 bg-white/5 border-b border-white/10 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="font-semibold text-sm uppercase tracking-wide">
                Your Draft - Owner View
              </span>
            </div>
            <button
              onClick={() => handleAction(onRequestPublish)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 transition-all font-semibold text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                'Submitting...'
              ) : (
                <>
                  <Send size={18} />
                  Request Publish
                </>
              )}
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
}
