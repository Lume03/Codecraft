import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'El ID de la lección proporcionado es inválido.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('ravencode');
        const theoryId = new ObjectId(id);

        const theory = await db.collection('theories').findOne({ _id: theoryId });

        if (!theory) {
            return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
        }

        const pages = await db.collection('theory_pages').find({ theoryId: theoryId }).sort({ order: 1 }).toArray();

        const theoryWithStringId = {
            ...theory,
            id: theory._id.toString(),
            _id: undefined,
        };

        const pagesWithStringIds = pages.map(page => ({
            ...page,
            id: page._id.toString(),
            _id: undefined,
            theoryId: page.theoryId.toString(),
        }));

        return NextResponse.json({ theory: theoryWithStringId, pages: pagesWithStringIds });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Error al obtener la lección' }, { status: 500 });
    }
}
