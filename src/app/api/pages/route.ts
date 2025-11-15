import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { title, content, theoryId } = await request.json();

    if (!title || !content || !theoryId || !ObjectId.isValid(theoryId)) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos o el ID de la lección es inválido' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('ravencode');
    const theoryObjectId = new ObjectId(theoryId);

    // Get the highest order number for the existing pages in the theory
    const lastPage = await db.collection('theory-pages').find({ theoryId: theoryObjectId }).sort({ order: -1 }).limit(1).toArray();
    const newOrder = lastPage.length > 0 ? lastPage[0].order + 1 : 1;

    const newPage = {
      title,
      content,
      theoryId: theoryObjectId,
      order: newOrder,
    };

    const result = await db.collection('theory-pages').insertOne(newPage);

    return NextResponse.json({ ...newPage, id: result.insertedId.toString() }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Error al crear la página' },
      { status: 500 }
    );
  }
}
