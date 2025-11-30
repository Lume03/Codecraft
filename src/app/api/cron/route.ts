import { NextResponse } from 'next/server';
import { adminDb, adminMessaging } from '@/lib/firebase-admin';
import type { UserProfile } from '@/docs/backend-types';

// This function can be called by a cron job service (e.g., Vercel Cron Jobs)
export async function GET(request: Request) {
  // Optional: Add a secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    // Get current time in 'HH:MM' format, adjusted for UTC
    // We store user preferences in their local time, but the server runs in UTC.
    // This is a simplification. A robust solution needs user-specific timezones.
    // For now, we assume server and user are in roughly similar timezones or the user
    // sets the time understanding it might be based on a fixed zone.
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    console.log(`[Cron Job] Running at UTC time: ${currentTime}`);

    const usersSnapshot = await adminDb
      .collection('users')
      .where('reminders', '==', true)
      .where('fcmToken', '!=', null)
      .where('reminderTime', '==', currentTime)
      .get();

    if (usersSnapshot.empty) {
      console.log('[Cron Job] No users to notify at this time.');
      return NextResponse.json({ success: true, message: 'No users to notify.' });
    }

    const tokens: string[] = [];
    usersSnapshot.forEach(doc => {
      const user = doc.data() as UserProfile;
      if (user.fcmToken) {
        tokens.push(user.fcmToken);
      }
    });
    
    console.log(`[Cron Job] Found ${tokens.length} users to notify.`);

    if (tokens.length > 0) {
      const message = {
        notification: {
          title: '🔥 ¡Es hora de practicar en RavenCode!',
          body: 'No pierdas tu racha. ¡Una lección rápida puede hacer la diferencia!',
        },
        tokens: tokens,
      };

      const response = await adminMessaging.sendEachForMulticast(message);
      console.log(`[Cron Job] Successfully sent ${response.successCount} messages.`);
      if (response.failureCount > 0) {
          console.warn(`[Cron Job] Failed to send ${response.failureCount} messages.`);
          // Optional: Handle failed tokens (e.g., remove from DB)
      }
    }

    return NextResponse.json({ success: true, sent: tokens.length });
  } catch (error) {
    console.error('[Cron Job] Error sending notifications:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
