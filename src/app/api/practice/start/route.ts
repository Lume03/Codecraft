import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { handlePractice } from '@/ai/flows/practice-flow';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Simplified recalculateLives function for this context
const recalculateLives = (user: any, now: Date) => {
    const MAX_LIVES = 5;
    const REFILL_MINUTES = 20;

    if (!user.lastLifeUpdate) {
        user.lastLifeUpdate = now;
        return user;
    }
    
    // Firestore Timestamps can be converted to JS Date
    const lastUpdateDate = user.lastLifeUpdate.toDate ? user.lastLifeUpdate.toDate() : new Date(user.lastLifeUpdate);

    if (user.lives >= MAX_LIVES) {
        user.lastLifeUpdate = now;
        return user;
    }

    const diffMs = now.getTime() - lastUpdateDate.getTime();
    const livesToAdd = Math.floor(diffMs / (REFILL_MINUTES * 60 * 1000));

    if (livesToAdd > 0) {
        const newLives = Math.min(MAX_LIVES, user.lives + livesToAdd);
        // Only update lastLifeUpdate if lives were actually added and changed
        if (newLives > user.lives) {
             const newLastLifeUpdate = new Date(
                lastUpdateDate.getTime() +
                (newLives - user.lives) * REFILL_MINUTES * 60 * 1000
            );
            user.lastLifeUpdate = newLastLifeUpdate > now ? now : newLastLifeUpdate;
        }
        user.lives = newLives;
    }
    return user;
};


export async function POST(request: Request) {
    try {
        const { userId, courseId, lessonId } = await request.json();

        if (!userId || !courseId || !lessonId) {
            return NextResponse.json({ message: 'Faltan parámetros requeridos (userId, courseId, lessonId)' }, { status: 400 });
        }
        
        if (!ObjectId.isValid(lessonId) || !ObjectId.isValid(courseId)) {
             return NextResponse.json({ message: 'El ID de la lección o del curso es inválido.' }, { status: 400 });
        }

        // --- User logic moved to Firestore ---
        const userRef = adminDb.collection('users').doc(userId);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }
        
        let user = recalculateLives(userSnap.data() as any, new Date());

        if (user.lives <= 0) {
            await userRef.update({
                lives: user.lives,
                lastLifeUpdate: user.lastLifeUpdate,
            });
            return NextResponse.json({ message: 'No tienes vidas suficientes para iniciar la práctica.' }, { status: 403 });
        }

        const newLives = user.lives - 1;
        await userRef.update({ 
            lives: newLives,
            lastLifeUpdate: user.lastLifeUpdate ?? FieldValue.serverTimestamp(),
        });
        // --- End of Firestore user logic ---


        // --- Course content logic remains in MongoDB ---
        const client = await clientPromise;
        const db = client.db('ravencode');
        const modulesCollection = db.collection('modules');
        const coursesCollection = db.collection('courses');
        const theoryPagesCollection = db.collection('theory-pages');
        
        const module = await modulesCollection.findOne({ _id: new ObjectId(lessonId) });
        if (!module || module.type !== 'theory') {
            return NextResponse.json({ message: 'Lección no encontrada o no es de tipo teoría' }, { status: 404 });
        }

        if(module.courseId.toString() !== courseId) {
            return NextResponse.json({ message: 'La lección no pertenece al curso especificado.' }, { status: 400 });
        }

        const course = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
        if (!course) {
             return NextResponse.json({ message: 'Curso asociado a la lección no encontrado' }, { status: 404 });
        }

        if (!module.contentId || !ObjectId.isValid(module.contentId)) {
             return NextResponse.json({ message: 'La lección no tiene un contenido teórico válido.' }, { status: 404 });
        }

        const theoryPages = await theoryPagesCollection.find({ theoryId: new ObjectId(module.contentId) }).sort({order: 1}).toArray();
        const theoryContent = theoryPages.map(p => `## ${p.title}\n\n${p.content}`).join('\n\n---\n\n');

        if (!theoryContent) {
            return NextResponse.json({ message: 'El contenido de la lección está vacío.' }, { status: 404 });
        }
        // --- End of MongoDB content logic ---


        // --- AI Logic ---
        const aiPayload = {
            mode: 'generate' as const,
            courseTitle: course.title,
            lessonTitle: module.title,
            theoryContent: theoryContent,
        };

        const aiResult = await handlePractice(aiPayload);

        if (!('questions' in aiResult)) {
            throw new Error("La IA no devolvió las preguntas esperadas.");
        }

        return NextResponse.json({ lives: newLives, questions: aiResult.questions });

    } catch (e: any) {
        console.error('Error in /api/practice/start:', e);
        return NextResponse.json({ message: 'Error interno del servidor', error: e.message }, { status: 500 });
    }
}
