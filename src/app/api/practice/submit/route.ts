import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { handlePractice, PracticeInput, PracticeOutput } from '@/ai/flows/practice-flow';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { isSameDay, subDays } from 'date-fns';

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

        const { approved, score, results } = gradeResult;

        // --- User progress and streak logic in Firestore ---
        const userRef = adminDb.collection('users').doc(userId);
        
        let unlockedNextLessonId: string | null = null;
        
        if (approved) {
            const userSnap = await userRef.get();
            const userData = userSnap.data();

            const client = await clientPromise;
            const db = client.db('ravencode');
            const modulesCollection = db.collection('modules');

            // Find current lesson to get its order
            const currentLesson = await modulesCollection.findOne({ _id: new ObjectId(lessonId) });
            
            if (currentLesson) {
                // Find next lesson in the same course with a higher order
                const nextLesson = await modulesCollection.findOne({
                    courseId: new ObjectId(courseId),
                    order: { $gt: currentLesson.order }
                }, { 
                    sort: { order: 1 } 
                });

                if (nextLesson) {
                    unlockedNextLessonId = nextLesson._id.toString();
                }
            }
             // Atomically update user document
            const updates: { [key: string]: any } = {
                [`progress.${courseId}.completedLessons`]: FieldValue.arrayUnion(lessonId),
            };
            if (unlockedNextLessonId) {
                updates[`progress.${courseId}.unlockedLessons`] = FieldValue.arrayUnion(unlockedNextLessonId);
            }

            // Streak Logic
            const now = new Date();
            const lastStreakUpdate = (userData?.lastStreakUpdate as Timestamp)?.toDate();
            let currentStreak = userData?.streak || 0;

            if (lastStreakUpdate && isSameDay(now, lastStreakUpdate)) {
                // Already practiced today, do nothing to the streak
            } else if (lastStreakUpdate && isSameDay(subDays(now, 1), lastStreakUpdate)) {
                // Practiced yesterday, increment streak
                updates['streak'] = FieldValue.increment(1);
                updates['lastStreakUpdate'] = Timestamp.fromDate(now);
            } else {
                // Did not practice yesterday, reset streak to 1
                updates['streak'] = 1;
                updates['lastStreakUpdate'] = Timestamp.fromDate(now);
            }
            
            await userRef.update(updates);
        }
        
        // Save practice result to a subcollection (optional but good for history)
        const practiceHistoryRef = userRef.collection('practiceHistory');
        await practiceHistoryRef.add({
            courseId,
            lessonId,
            score,
            approved,
            results,
            createdAt: FieldValue.serverTimestamp(),
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
