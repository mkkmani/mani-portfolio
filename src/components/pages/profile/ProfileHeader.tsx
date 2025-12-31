'use client';

import Image from 'next/image';
import { User as UserIcon, Mail, LogOut, Plus, Settings } from 'lucide-react';
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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-zinc-800 overflow-hidden relative">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'User'}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                <UserIcon size={32} />
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {user.name || 'User'}
          </h1>
          <div className="flex items-center gap-2 text-zinc-400 mt-1">
            <Mail size={14} />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-400">
              {user.role || 'User'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-950 text-emerald-500">
              {user.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Link
          href="/interview-prep/new"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} />
          <span>New Session</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-white/10 text-zinc-400 text-sm font-medium rounded hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
