import { Button } from '@/components/ui/button'
import { icons } from '@/constans/icons';
import {DashboardSidebarMenuInterface} from "@/lib/types"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
type Props = {
  menuLinks: {
    menuLinks: DashboardSidebarMenuInterface[];
  };
};
export default function SidebarNavAdmin({ menuLinks }: Props) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    return (
        <div>
            <nav className="space-y-2">    
                {menuLinks.menuLinks.map(( item, index ) => {
                  let icon;
                  const iconSearch = icons.find((icon) => icon.value === item.icon)
                  if(iconSearch) icon=<iconSearch.path/>
                  return (
                    <Button asChild key={index}
                    variant={pathname === item.link ? 'outline' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setOpen(false)}>
                      <Link href={item.link}>{icon }{item.label}</Link>
                    </Button>)})}   
        </nav> 
    </div>
  )
}
