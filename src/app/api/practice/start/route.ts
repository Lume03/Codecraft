import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { handlePractice } from '@/ai/flows/practice-flow';
import { adminDb } from '@/lib/firebase-admin';
import { recalculateLives, MAX_LIVES } from '@/lib/lives';

export async function POST(request: Request) {
    try {
        const { userId, courseId, lessonId } = await request.json();

        if (!userId || !courseId || !lessonId) {
            return NextResponse.json({ message: 'Faltan parámetros requeridos (userId, courseId, lessonId)' }, { status: 400 });
        }
        
        if (!ObjectId.isValid(lessonId) || !ObjectId.isValid(courseId)) {
             return NextResponse.json({ message: 'El ID de la lección o del curso es inválido.' }, { status: 400 });
        }

        // --- User logic with Firestore ---
        const userRef = adminDb.collection('users').doc(userId);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }
        
        const userData = userSnap.data()!;
        const recalculatedUser = recalculateLives(userData);

        if (recalculatedUser.lives <= 0) {
            // Save the recalculated (but still 0) lives state before returning
            await userRef.update({
                lives: recalculatedUser.lives,
                lastLifeUpdate: recalculatedUser.lastLifeUpdate,
            });
            return NextResponse.json({ message: 'No tienes vidas suficientes para iniciar la práctica.' }, { status: 403 });
        }
        
        const newLives = recalculatedUser.lives - 1;
        await userRef.update({ 
            lives: newLives,
            lastLifeUpdate: recalculatedUser.lastLifeUpdate,
        });
        // --- End of Firestore user logic ---


        // --- Course content logic from MongoDB ---
        const client = await clientPromise;
        const db = client.db('ravencode');
        
        const module = await db.collection('modules').findOne({ _id: new ObjectId(lessonId) });
        if (!module || module.type !== 'theory') {
            return NextResponse.json({ message: 'Lección no encontrada o no es de tipo teoría' }, { status: 404 });
        }

        if(module.courseId.toString() !== courseId) {
            return NextResponse.json({ message: 'La lección no pertenece al curso especificado.' }, { status: 400 });
        }

        const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
        if (!course) {
             return NextResponse.json({ message: 'Curso asociado a la lección no encontrado' }, { status: 404 });
        }

        if (!module.contentId || !ObjectId.isValid(module.contentId)) {
             return NextResponse.json({ message: 'La lección no tiene un contenido teórico válido.' }, { status: 404 });
        }

        const theoryPages = await db.collection('theory-pages').find({ theoryId: new ObjectId(module.contentId) }).sort({order: 1}).toArray();
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
