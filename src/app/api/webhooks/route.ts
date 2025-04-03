import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { User } from "@prisma/client"
import { db } from '@/lib/db'


export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
    const eventType = evt.type
    if (eventType === 'user.created' || eventType === "user.updated") {
        console.log('user ID : ', id)
        const data = JSON.parse(body).data;
        console.log(data)

        const user: Partial<User> = {
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address,
        picture: data.image_url,
        username: data.username || null,
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        role: (data?.privateMetadata.role as 'USER' | 'ADMIN' | 'SELLER') || 'USER',
        };

        if (!user.email || !user.clerkId || !user.picture) {
        return new Response('Missing user fields', { status: 400 });
        }

        const dbUser = await db.user.upsert({
        where: { clerkId: user.clerkId },
        update: {
            email: user.email,
            picture: user.picture,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            updatedAt: new Date(),
        },
        create: {
            clerkId: user.clerkId,
            email: user.email,
            picture: user.picture,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role || 'USER',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        });

  }
    if (eventType === 'user.deleted') {
    await db.user.deleteMany({
      where: { clerkId: id}
    });
  }

  return new Response('Webhook received', { status: 200 })
}