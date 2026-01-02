import { LucideIcon } from 'lucide-react';

export interface NavCard {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
  stats?: {
    total: number;
    published?: number;
    unread?: number;
  };
}
