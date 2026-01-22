'use client';

import { CheckCircle2, Send, Clock, Trash2, ChevronDown, ShieldAlert } from 'lucide-react';
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
      <div className="sticky top-0 md:top-0 z-40 bg-black border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 md:pl-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ShieldAlert size={16} className="text-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
              [ SYSTEM.ADMIN // DRAFT_OVERRIDE ]
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Delete Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                className="flex items-center gap-2 px-6 py-3 border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                disabled={isProcessing}
              >
                <Trash2 size={14} />
                Delete
                <ChevronDown size={14} className={`transition-transform duration-300 ${showDeleteMenu ? 'rotate-180' : ''}`} />
              </button>

              {showDeleteMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-black border border-white/10 p-2 z-50">
                  <button
                    onClick={() => setShowConfirmDialog('discard')}
                    className="w-full px-4 py-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 group"
                  >
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-accent">Discard</div>
                    <div className="text-[8px] text-foreground/40 mt-1 font-light italic lowercase">// move to recycle bin</div>
                  </button>
                  <button
                    onClick={() => setShowConfirmDialog('permanent')}
                    className="w-full px-4 py-4 text-left hover:bg-red-500/10 transition-colors group"
                  >
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Permanent Delete</div>
                    <div className="text-[8px] text-red-500/40 mt-1 font-light italic lowercase">// erase from registry forever</div>
                  </button>
                </div>
              )}
            </div>

            {/* Publish Button */}
            <button
              onClick={() => handleAction(onPublish)}
              disabled={isProcessing}
              className="flex items-center gap-4 px-8 py-3 bg-white text-black hover:bg-accent transition-all duration-500 text-[10px] font-black uppercase tracking-[0.4em] disabled:opacity-50"
            >
              {isProcessing ? 'Processing' : 'Initialize Publish'}
              <CheckCircle2 size={16} />
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-6">
            <div className="bg-black border border-white/10 p-12 max-w-lg w-full relative">
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent block mb-4">[ CRITICAL.ACTION ]</span>
                <h3 className="text-3xl font-serif uppercase tracking-tighter text-white mb-4">
                  Confirm {showConfirmDialog === 'discard' ? 'Discard' : 'Purge'}?
                </h3>
                <p className="text-lg text-foreground/40 font-light lowercase italic leading-relaxed">
                  {showConfirmDialog === 'discard'
                    ? 'this state change will isolate the content from public view but retain the data in the backup registry.'
                    : 'this intervention is irreversible. the specific data entry will be permanently purged from the system.'}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDialog(null)}
                  className="flex-1 px-8 py-4 border border-white/10 hover:border-white transition-all text-[10px] font-black uppercase tracking-[0.3em] text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showConfirmDialog)}
                  className={`flex-1 px-8 py-4 transition-all text-[10px] font-black uppercase tracking-[0.3em] ${showConfirmDialog === 'permanent'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-black hover:bg-accent'
                    }`}
                >
                  {showConfirmDialog === 'discard' ? 'Discard' : 'Purge Entry'}
                </button>
              </div>

              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20" />
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
        <div className="sticky top-0 z-40 bg-black border-b border-yellow-500/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 md:pl-24 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock size={16} className="text-yellow-500 animate-pulse" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white block">
                  [ TRANS.STATUS // PENDING_REVIEW ]
                </span>
                <span className="text-[8px] text-foreground/40 font-light italic lowercase block mt-1">
                  awaiting administrative authorization
                </span>
              </div>
            </div>
            <div className="px-4 py-2 border border-yellow-500/20 bg-yellow-500/5 text-[8px] font-black uppercase tracking-[0.3em] text-yellow-500">
              In Review
            </div>
          </div>
        </div>
      );
    }

    if (canRequestPublish && onRequestPublish) {
      return (
        <div className="sticky top-0 z-40 bg-black border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 md:pl-24 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                [ USER.DRAFT // PERSISTENT ]
              </span>
            </div>
            <button
              onClick={() => handleAction(onRequestPublish)}
              disabled={isProcessing}
              className="flex items-center gap-4 px-8 py-3 bg-white text-black hover:bg-accent transition-all duration-500 text-[10px] font-black uppercase tracking-[0.4em]"
            >
              {isProcessing ? 'Submitting' : 'Request Publish'}
              <Send size={16} />
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
}
