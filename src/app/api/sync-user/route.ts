import { PrismaClient } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress || '';
  const picture = user.imageUrl;
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  const syncedUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
        email,
        username : user.username,
      picture,
      firstName,
      lastName,
      updatedAt: new Date(),
    },
      create: {
        
      clerkId: user.id,
        email,
      username : user.username,
      picture,
      firstName,
      lastName,
      role: 'USER', // default role
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return new Response(JSON.stringify({ message: 'User synced', user: syncedUser }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
