import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function DashboardPage() {
  const user = await currentUser();
  const role = user?.privateMetadata?.role;

  console.log(`${user?.fullName} : ${role}`);
  console.log(user?.privateMetadata)
  if (!role || role === 'USER') {
    redirect('/');
  } else if (role === 'ADMIN') {
    redirect('/dashboard/admin');
  } else if (role === 'SELLER') {
    redirect('/dashboard/seller');
  }
  return (
    <div>
      dashboard
    </div>
  )
}
