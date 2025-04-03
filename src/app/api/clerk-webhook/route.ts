import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  return new Response("✅ Webhook endpoint is live and ready (POST only)", { status: 200 });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
    const headerList = await headers();
    const clerkSignature = headerList.get('svix-signature');

  const event = JSON.parse(rawBody);
  const { type, data } = event;

  const clerkId = data.id;
  const email = data.email_addresses?.[0]?.email_address || '';
  const picture = data.image_url || '';
  const username = data.username || null;
  const firstName = data.first_name || null;
  const lastName = data.last_name || null;

  // Default role, or pull from Clerk metadata (optional)
  const role = (data.public_metadata?.role as 'ADMIN' | 'SELLER' | 'USER') || 'USER';

  switch (type) {
    case 'user.created':
    case 'user.updated':
      await prisma.user.upsert({
        where: { clerkId },
        update: {
          email,
          picture,
          username,
          firstName,
          lastName,
          role,
          updatedAt: new Date(),
        },
        create: {
          clerkId,
          email,
          picture,
          username,
          firstName,
          lastName,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      break;

    case 'user.deleted':
      await prisma.user.deleteMany({
        where: { clerkId },
      });
      break;

    default:
      console.log(`Unhandled event: ${type}`);
  }

  return new Response('Webhook received', { status: 200 });
}
