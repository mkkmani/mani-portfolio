'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Secret keyboard shortcut component for admin access
 * Listens for Ctrl+Shift+A (or Cmd+Shift+A on Mac) to navigate to /get-access
 * This component is completely invisible and leaves no UI footprint
 */
export default function SecretAdminAccess() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check for Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac)
      const isModifierPressed = event.ctrlKey || event.metaKey;
      const isShiftPressed = event.shiftKey;
      const isAPressed = event.key.toLowerCase() === 'a';

      if (isModifierPressed && isShiftPressed && isAPressed) {
        event.preventDefault();
        router.push('/get-access');
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [router]);

  // Render nothing - completely invisible
  return null;
}
