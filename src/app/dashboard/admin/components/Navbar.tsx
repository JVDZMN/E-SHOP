// src/components/dashboard/admin/Navbar.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserButton } from '@clerk/nextjs';
import ThemeToggle from '@/components/shared/theme-toggle';

type NavbarProps = {
  userName: string;
};

export default function Navbar({ userName }: NavbarProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="w-full bg-background border-b px-4 py-3 flex items-center justify-between">
      <h1 className="text-base sm:text-lg font-semibold truncate">Welcome, {userName}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
          < UserButton />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
