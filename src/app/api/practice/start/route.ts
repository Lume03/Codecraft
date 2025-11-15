import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { handlePractice } from '@/ai/flows/practice-flow';

// Simplified recalculateLives function for this context
const recalculateLives = (user: any, now: Date) => {
    const MAX_LIVES = 5;
    const REFILL_MINUTES = 20;

    if (!user.lastLifeUpdate) {
        user.lastLifeUpdate = now;
    }

    if (user.lives >= MAX_LIVES) {
        user.lastLifeUpdate = now;
        return user;
    }

    const diffMs = now.getTime() - new Date(user.lastLifeUpdate).getTime();
    const livesToAdd = Math.floor(diffMs / (REFILL_MINUTES * 60 * 1000));

    if (livesToAdd > 0) {
        user.lives = Math.min(MAX_LIVES, user.lives + livesToAdd);
        user.lastLifeUpdate = new Date(
            new Date(user.lastLifeUpdate).getTime() +
            livesToAdd * REFILL_MINUTES * 60 * 1000
        );
    }
    return user;
};


export async function POST(request: Request) {
    try {
        const { userId, courseId, lessonId } = await request.json();

        if (!userId || !courseId || !lessonId) {
            return NextResponse.json({ message: 'Faltan parámetros requeridos (userId, courseId, lessonId)' }, { status: 400 });
        }
        
        const client = await clientPromise;
        const db = client.db('ravencode');
        const usersCollection = db.collection('users');
        const modulesCollection = db.collection('modules');
        const coursesCollection = db.collection('courses');
        const theoriesCollection = db.collection('theories');
        const theoryPagesCollection = db.collection('theory-pages');

        // 1. Fetch user and recalculate lives
        let user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            // As a fallback, try finding user by clerk/firebase ID if you store it differently
             user = await usersCollection.findOne({ firebaseUid: userId });
             if(!user) {
                return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
             }
        }
        
        user = recalculateLives(user, new Date());

        // 2. Check if user has lives
        if (user.lives <= 0) {
            await usersCollection.updateOne({ _id: user._id }, { $set: { lives: user.lives, lastLifeUpdate: user.lastLifeUpdate } });
            return NextResponse.json({ message: 'No tienes vidas suficientes para iniciar la práctica.' }, { status: 403 });
        }

        // 3. Decrement life and update user in DB
        const newLives = user.lives - 1;
        await usersCollection.updateOne({ _id: user._id }, { $set: { lives: newLives } });

        // 4. Fetch lesson content
        const module = await modulesCollection.findOne({ _id: new ObjectId(lessonId) });
        if (!module || module.type !== 'theory') {
            return NextResponse.json({ message: 'Lección no encontrada o no es de tipo teoría' }, { status: 404 });
        }

        const course = await coursesCollection.findOne({ _id: module.courseId });
        if (!course) {
             return NextResponse.json({ message: 'Curso asociado a la lección no encontrado' }, { status: 404 });
        }

        const theoryPages = await theoryPagesCollection.find({ theoryId: new ObjectId(module.contentId) }).sort({order: 1}).toArray();
        const theoryContent = theoryPages.map(p => `## ${p.title}\n\n${p.content}`).join('\n\n---\n\n');

        if (!theoryContent) {
            return NextResponse.json({ message: 'El contenido de la lección está vacío.' }, { status: 404 });
        }

        // 5. Call AI agent to generate questions
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

        // 6. Return questions and new life count to the frontend
        return NextResponse.json({ lives: newLives, questions: aiResult.questions });

    } catch (e: any) {
        console.error('Error in /api/practice/start:', e);
        return NextResponse.json({ message: 'Error interno del servidor', error: e.message }, { status: 500 });
    }
}
