import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';


export default async function handler(req: any, res:any) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Fetch full user data from Clerk
  const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  const userData = await clerkRes.json();

  const email = userData.email_addresses[0]?.email_address || '';
  const firstName = userData.first_name || '';
  const lastName = userData.last_name || '';

  // Sync user with MongoDB using Prisma
  const user = await db.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      firstName,
      lastName,
    },
    create: {
    clerkId: userId,
    email,
    picture: userData.image_url || '',
    username: userData.username || null,
    firstName,
    lastName,
    role: 'USER', // default role
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  });

  return res.status(200).json({ message: 'User synced', user });
}
