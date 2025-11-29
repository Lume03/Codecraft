import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId, WithId } from 'mongodb';
import { handlePractice, PracticeInput, PracticeOutput } from '@/ai/flows/practice-flow';
import { isSameDay, subDays } from 'date-fns';
import type { UserProfile } from '@/docs/backend-types';

export async function POST(request: Request) {
    try {
        const { userId, courseId, lessonId, submission } = await request.json();

         if (!userId || !courseId || !lessonId || !submission) {
            return NextResponse.json({ message: 'Faltan parámetros requeridos' }, { status: 400 });
        }

        // 1. Call AI agent to grade the answers
        const gradePayload: Extract<PracticeInput, { mode: 'grade' }> = submission;
        const gradeResult = await handlePractice(gradePayload) as Extract<PracticeOutput, { score: number }>;

        if (!gradeResult || typeof gradeResult.score === 'undefined') {
            throw new Error("La IA no devolvió un resultado de calificación válido.");
        }

        const { approved, score, results, maxScore } = gradeResult;
        
        const client = await clientPromise;
        const db = client.db('ravencode');
        const usersCollection = db.collection<UserProfile>('users');
        const practiceHistoryCollection = db.collection('practiceHistory');

        const user = await usersCollection.findOne({ firebaseUid: userId });
        if (!user) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }
        
        let unlockedNextLessonId: string | null = null;
        const updates: { $set: any, $addToSet?: any, $inc?: any } = { $set: {} };
        
        if (approved) {
            const modulesCollection = db.collection('modules');
            const currentLesson = await modulesCollection.findOne({ _id: new ObjectId(lessonId) });
            
            if (currentLesson) {
                const nextLesson = await modulesCollection.findOne({
                    courseId: new ObjectId(courseId),
                    order: { $gt: currentLesson.order }
                }, { 
                    sort: { order: 1 } 
                });

                if (nextLesson) {
                    unlockedNextLessonId = nextLesson._id.toString();
                    updates.$addToSet = { [`progress.${courseId}.unlockedLessons`]: unlockedNextLessonId };
                }
            }

            if (!updates.$addToSet) {
                 updates.$addToSet = {};
            }
            updates.$addToSet[`progress.${courseId}.completedLessons`] = lessonId;
        }

        // Streak Logic
        const now = new Date();
        const lastStreakUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null;
        let currentStreak = user.streak || 0;

        if (!lastStreakUpdate || !isSameDay(now, lastStreakUpdate)) {
          if (lastStreakUpdate && isSameDay(subDays(now, 1), lastStreakUpdate)) {
              // Practiced yesterday, increment streak
              updates.$inc = { streak: 1 };
          } else {
              // Did not practice yesterday or first practice ever, reset streak to 1
              updates.$set.streak = 1;
          }
          updates.$set.lastStreakUpdate = now;
        }
        
        // Atomically update user document if there are changes
        if (Object.keys(updates.$set).length > 0 || updates.$addToSet || updates.$inc) {
            await usersCollection.updateOne({ firebaseUid: userId }, updates);
        }

        // Save practice result to a separate collection
        await practiceHistoryCollection.insertOne({
            userId: user._id, // Link with MongoDB user ID
            firebaseUid: userId,
            courseId: new ObjectId(courseId),
            lessonId: new ObjectId(lessonId),
            score,
            maxScore,
            approved,
            results,
            createdAt: new Date(),
        });

        return NextResponse.json({
            ...gradeResult,
            unlockedNextLessonId: unlockedNextLessonId
        });

    } catch (e: any) {
        console.error('Error in /api/practice/submit:', e);
        return NextResponse.json({ message: 'Error interno del servidor', error: e.message }, { status: 500 });
    }
}
