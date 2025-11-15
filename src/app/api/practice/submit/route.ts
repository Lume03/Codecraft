import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { handlePractice, PracticeInput, PracticeOutput } from '@/ai/flows/practice-flow';

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

        const client = await clientPromise;
        const db = client.db('ravencode');
        const usersCollection = db.collection('users');
        
        let userObjectId;
        try {
            userObjectId = new ObjectId(userId);
        } catch (error) {
            // Fallback for Firebase UID which is not an ObjectId
            const user = await usersCollection.findOne({ firebaseUid: userId });
            if (!user) {
                 return NextResponse.json({ message: 'Usuario no encontrado con el UID proporcionado.' }, { status: 404 });
            }
            userObjectId = user._id;
        }

        // 2. If approved, update user progress
        let unlockedNextLesson = false;
        if (gradeResult.approved) {
            // Add lesson to completedLessons
            await usersCollection.updateOne(
                { _id: userObjectId },
                { $addToSet: { completedLessons: lessonId } }
            );

            // Find next lesson to unlock
            const modulesCollection = db.collection('modules');
            const currentLesson = await modulesCollection.findOne({ _id: new ObjectId(lessonId) });
            
            if (currentLesson) {
                const nextLesson = await modulesCollection.findOne({
                    courseId: currentLesson.courseId,
                    order: { $gt: currentLesson.order }
                }, { sort: { order: 1 } });

                if (nextLesson) {
                    await usersCollection.updateOne(
                        { _id: userObjectId },
                        { $addToSet: { unlockedLessons: nextLesson._id.toString() } }
                    );
                    unlockedNextLesson = true;
                }
            }
        }
        
        // 3. (Optional) Save practice result to history
        const practiceResultsCollection = db.collection('practiceResults');
        await practiceResultsCollection.insertOne({
            userId: userObjectId,
            courseId: new ObjectId(courseId),
            lessonId: new ObjectId(lessonId),
            score: gradeResult.score,
            approved: gradeResult.approved,
            results: gradeResult.results,
            createdAt: new Date(),
        });


        // 4. Return detailed results to frontend
        return NextResponse.json({
            ...gradeResult,
            unlockedNextLesson
        });

    } catch (e: any) {
        console.error('Error in /api/practice/submit:', e);
        return NextResponse.json({ message: 'Error interno del servidor', error: e.message }, { status: 500 });
    }
}
