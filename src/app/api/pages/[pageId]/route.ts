
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Update a page
export async function PUT(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const { pageId } = params;
    const { title, content } = await request.json();

    if (!ObjectId.isValid(pageId) || !title || content === undefined) {
      return NextResponse.json({ error: 'ID de página inválido o faltan datos' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    const result = await db.collection('theory-pages').updateOne(
      { _id: new ObjectId(pageId) },
      { $set: { title, content } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Página no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Página actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar la página' }, { status: 500 });
  }
}

// Delete a page
export async function DELETE(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const { pageId } = params;

    if (!ObjectId.isValid(pageId)) {
      return NextResponse.json({ error: 'ID de página inválido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');
    
    const result = await db.collection('theory-pages').deleteOne({ _id: new ObjectId(pageId) });
    
    if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Página no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Página eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar la página' }, { status: 500 });
  }
}

    