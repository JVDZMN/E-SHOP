// File: src/app/dashboard/admin/layout.tsx
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  const role = user?.privateMetadata?.role;

  if (!user || role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at top */}
      <Navbar userName={user.fullName || 'Admin'} />

      {/* Main content: sidebar + page */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <Sidebar role={role} />

        {/* Page content on the right */}
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
