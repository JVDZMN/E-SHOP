'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SyncUser() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/sync-user');
    }
  }, [isSignedIn]);

  return null;
}
