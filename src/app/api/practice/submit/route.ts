import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { handlePractice, PracticeInput, PracticeOutput } from '@/ai/flows/practice-flow';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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

        // --- User progress logic moved to Firestore ---
        const userRef = adminDb.collection('users').doc(userId);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
        }

        let unlockedNextLesson = false;
        if (gradeResult.approved) {
            await userRef.update({
                completedLessons: FieldValue.arrayUnion(lessonId)
            });

            // Find next lesson in MongoDB
            const client = await clientPromise;
            const db = client.db('ravencode');
            const modulesCollection = db.collection('modules');
            const currentLesson = await modulesCollection.findOne({ _id: new ObjectId(lessonId) });
            
            if (currentLesson) {
                const nextLesson = await modulesCollection.findOne({
                    courseId: currentLesson.courseId,
                    order: { $gt: currentLesson.order }
                }, { sort: { order: 1 } });

                if (nextLesson) {
                     await userRef.update({
                        unlockedLessons: FieldValue.arrayUnion(nextLesson._id.toString())
                    });
                    unlockedNextLesson = true;
                }
            }
        }
        
        // Save practice result to Firestore (optional but recommended)
        const practiceHistoryRef = adminDb.collection('users').doc(userId).collection('practiceHistory');
        await practiceHistoryRef.add({
            courseId: courseId,
            lessonId: lessonId,
            score: gradeResult.score,
            approved: gradeResult.approved,
            results: gradeResult.results,
            createdAt: FieldValue.serverTimestamp(),
        });
        // --- End of Firestore user logic ---

        return NextResponse.json({
            ...gradeResult,
            unlockedNextLesson
        });

    } catch (e: any) {
        console.error('Error in /api/practice/submit:', e);
        return NextResponse.json({ message: 'Error interno del servidor', error: e.message }, { status: 500 });
    }
}
