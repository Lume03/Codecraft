import { NextResponse } from 'next/server';
import type { UserProfile } from '@/docs/backend-types';
import clientPromise from '@/lib/mongodb';
import { adminMessaging } from '@/lib/firebase-admin';

// This function can be called by a cron job service (e.g., Vercel Cron Jobs, typically every 1-5 minutes)
export async function GET(request: Request) {
  // Optional: Add a secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    const currentUtcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    
    console.log(`[Cron Job] Running at UTC: ${now.toUTCString()}`);
    
    const client = await clientPromise;
    const db = client.db('ravencode');

    // Fetch all users who have reminders enabled and have a token from MongoDB
    const usersCursor = db
      .collection<UserProfile>('users')
      .find({ reminders: true, fcmToken: { $ne: null, $exists: true } });
      
    const users = await usersCursor.toArray();

    if (users.length === 0) {
      console.log('[Cron Job] No users with reminders enabled found.');
      return NextResponse.json({ success: true, message: 'No users with reminders enabled.' });
    }

    const tokensToSend: string[] = [];
    
    users.forEach(user => {
      if (user.fcmToken && user.reminderTime) {
        const [reminderHours, reminderMinutes] = user.reminderTime.split(':').map(Number);
        const reminderTotalMinutes = reminderHours * 60 + reminderMinutes;
        
        // Check if the reminder time was in the last 5 minutes
        const diff = currentUtcMinutes - reminderTotalMinutes;

        if (diff >= 0 && diff < 5) {
           tokensToSend.push(user.fcmToken);
           console.log(`[Cron Job] User ${user.firebaseUid} matched. Reminder time: ${user.reminderTime} UTC.`);
        }
      }
    });

    console.log(`[Cron Job] Found ${tokensToSend.length} users to notify.`);

    if (tokensToSend.length > 0) {
      const message = {
        notification: {
          title: '🔥 ¡Es hora de practicar en RavenCode!',
          body: 'No pierdas tu racha. ¡Una lección rápida puede hacer la diferencia!',
        },
        tokens: tokensToSend,
      };

      const response = await adminMessaging.sendEachForMulticast(message);
      console.log(`[Cron Job] Successfully sent ${response.successCount} messages.`);
      if (response.failureCount > 0) {
          console.warn(`[Cron Job] Failed to send ${response.failureCount} messages.`);
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              console.error(`  - Token ${idx}: ${resp.error}`);
            }
          });
      }
    }

    return NextResponse.json({ success: true, sent: tokensToSend.length });
  } catch (error) {
    console.error('[Cron Job] Error sending notifications:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
