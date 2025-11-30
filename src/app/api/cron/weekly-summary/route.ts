'use server';

import { NextResponse } from 'next/server';
import type { UserProfile } from '@/docs/backend-types';
import clientPromise from '@/lib/mongodb';
import { subDays } from 'date-fns';
import { render } from '@react-email/render';
import { WeeklySummaryEmail } from '@/components/email/weekly-summary-email';
import { Resend } from 'resend';

// This function can be called by a cron job service (e.g., Vercel Cron Jobs, typically once a week)
// Example cron schedule for Vercel: "0 22 * * 0" (Every Sunday at 10 PM UTC)
export async function GET(request: Request) {
  // Optional: Add a secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("[Cron Weekly] Resend API key is not configured.");
    return NextResponse.json({ success: false, error: "Resend API key is missing." }, { status: 500 });
  }
  const resend = new Resend(resendApiKey);

  try {
    const now = new Date();
    const oneWeekAgo = subDays(now, 7);

    const client = await clientPromise;
    const db = client.db('ravencode');
    
    // 1. Fetch all users who have email notifications enabled from MongoDB
    const usersCursor = db
      .collection<UserProfile>('users')
      .find({ emailNotifications: true });

    const users = await usersCursor.toArray();

    if (users.length === 0) {
      console.log('[Cron Weekly] No users with email notifications enabled.');
      return NextResponse.json({
        success: true,
        message: 'No users to notify.',
      });
    }

    const practiceHistoryCollection = db.collection('practiceHistory');
    let emailsSent = 0;
    const errors: string[] = [];

    // 2. For each user, calculate their weekly stats
    for (const user of users) {
      if (!user.email || !user.displayName || !user.firebaseUid) continue;

      try {
        const weeklyHistory = await practiceHistoryCollection
          .find({
            firebaseUid: user.firebaseUid,
            createdAt: { $gte: oneWeekAgo },
          })
          .toArray();

        // If no activity, don't send an email
        if (weeklyHistory.length === 0) {
          continue;
        }

        const totalPractices = weeklyHistory.length;
        const totalScore = weeklyHistory.reduce((sum, h) => sum + (h.score || 0), 0);
        const totalMaxScore = weeklyHistory.reduce(
          (sum, h) => sum + (h.maxScore || 0),
          0
        );
        const averageScore =
          totalMaxScore > 0
            ? Math.round((totalScore / totalMaxScore) * 100)
            : 0;
        const lessonsCompleted = weeklyHistory.filter((h) => h.approved).length;

        // 3. Generate email HTML using a React component
        const emailHtml = render(
          <WeeklySummaryEmail
            username={user.displayName}
            averageScore={averageScore}
            lessonsCompleted={lessonsCompleted}
            totalPractices={totalPractices}
          />
        );

        // 4. Send the email using Resend
        await resend.emails.send({
          from: 'RavenCode <onboarding@resend.dev>',
          to: [user.email],
          subject: `🚀 Tu resumen semanal de RavenCode`,
          html: emailHtml,
        });

        emailsSent++;

      } catch (error) {
        console.error(`[Cron Weekly] Failed to process user ${user.firebaseUid}:`, error);
        errors.push(user.firebaseUid);
      }
    }

    console.log(`[Cron Weekly] Job finished. Sent ${emailsSent} emails. Failed for ${errors.length} users.`);

    return NextResponse.json({
      success: true,
      sent: emailsSent,
      failed_uids: errors,
    });

  } catch (error) {
    console.error('[Cron Weekly] Unhandled error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
