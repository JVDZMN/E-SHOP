'use client';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import SidebarNavAdmin from './navadmin';
import { adminDashboardSidebarOptions } from '@/constans/data';




type Props = {
  role: string;
};

export default function Sidebar({role} : Props) {
  const [open, setOpen] = useState(false);
  const isAdmin = role === "ADMIN"

  return (
    <>
      {/* Mobile Sheet Trigger */}
      <div className="lg:hidden p-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            {/* ✅ REQUIRED: SheetTitle for accessibility */}
            <SheetTitle className="text-lg font-bold mb-4">{ role}</SheetTitle>
            <Separator className="mb-4" />
            {isAdmin && <SidebarNavAdmin menuLinks={{ menuLinks: adminDashboardSidebarOptions }} />}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-muted border-r h-screen p-4">
          <div className="mb-4 flex justify-center">
            {/* Light mode icon */}
            <Image
              src="/e-shop.png"
              alt="E-Shop Icon"
              width={64}
              height={64}
              className="block dark:hidden w-12 h-12 lg:w-16 lg:h-16"
            />

            {/* Dark mode icon */}
            <Image
              src="/e-shop-white.png"
              alt="E-Shop Icon White"
              width={64}
              height={64}
              className="hidden dark:block w-12 h-12 lg:w-16 lg:h-16"
            />
          </div>
        <h2 className="text-2xl font-bold mb-6">{ role}</h2>
        <Separator className="mb-4" />
        {isAdmin && <SidebarNavAdmin menuLinks={{ menuLinks: adminDashboardSidebarOptions }} />}
      </aside>
    </>
  );
}
