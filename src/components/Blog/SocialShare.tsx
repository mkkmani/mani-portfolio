'use client';

import { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://manikantaketha.in'}${url}`;
  const shareText = description || title;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10  hover:bg-white/10 hover:border-accent/50 transition-all text-sm font-medium"
        aria-label="Share this article"
      >
        <Share2 size={16} />
        Share
      </button>

      {showMenu && (
        <div className="absolute top-full mt-2 right-0 bg-black border border-white/10  shadow-xl p-3 z-10 min-w-[200px]">
          <div className="flex flex-col gap-2">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2  hover:bg-white/5 transition-colors"
            >
              <Twitter size={18} className="text-[#1DA1F2]" />
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2  hover:bg-white/5 transition-colors"
            >
              <Linkedin size={18} className="text-[#0A66C2]" />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2  hover:bg-white/5 transition-colors"
            >
              <Facebook size={18} className="text-[#1877F2]" />
              <span className="text-sm">Facebook</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 px-3 py-2  hover:bg-white/5 transition-colors text-left"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-green-400" />
                  <span className="text-sm text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <LinkIcon size={18} />
                  <span className="text-sm">Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
