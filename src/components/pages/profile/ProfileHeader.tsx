'use client';

import Image from 'next/image';
import { User as UserIcon, Mail, LogOut, Plus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    status?: string;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 pb-12 border-b border-white/5">
      <div className="flex items-end gap-8">
        <div className="relative">
          <div className="w-32 h-32 bg-white/5 border border-white/5 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'User'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground/20">
                <UserIcon size={48} />
              </div>
            )}
          </div>
          <div className="absolute -top-3 -left-3 px-3 py-1 bg-accent text-black text-[8px] font-black uppercase tracking-[0.3em]">
            Identity
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.5em] text-accent uppercase">
              [ {user.role || 'User'} ]
            </span>
            <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-tighter text-white">
              {user.name || 'User'}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-foreground/40">
            <Mail size={12} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-4 w-full md:w-auto">
        <Link
          href="/interview-prep/new"
          className="group flex items-center justify-center gap-4 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all duration-500"
        >
          <Plus size={14} className="group-hover:rotate-90 transition-transform duration-500" />
          Initialize Session
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center justify-center gap-4 px-8 py-4 border border-white/10 text-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] hover:border-white hover:text-white transition-all duration-500"
        >
          <LogOut size={14} />
          Terminate
        </button>
      </div>
    </div>
  );
}
