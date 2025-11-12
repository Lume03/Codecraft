import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Update a module's title
export async function PUT(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params;
    const { title } = await request.json();

    if (!ObjectId.isValid(moduleId) || !title) {
      return NextResponse.json({ error: 'ID de módulo inválido o título faltante' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    const result = await db.collection('modules').updateOne(
      { _id: new ObjectId(moduleId) },
      { $set: { title: title } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Módulo actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar el módulo' }, { status: 500 });
  }
}

// Delete a module and its associated theory and pages
export async function DELETE(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params;

    if (!ObjectId.isValid(moduleId)) {
      return NextResponse.json({ error: 'ID de módulo inválido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');
    const moduleObjectId = new ObjectId(moduleId);

    // 1. Find the module to get the theoryId
    const module = await db.collection('modules').findOne({ _id: moduleObjectId });
    if (!module) {
      return NextResponse.json({ error: 'Módulo no encontrado' }, { status: 404 });
    }

    const theoryIdString = module.contentId;
    if (theoryIdString && ObjectId.isValid(theoryIdString)) {
        const theoryId = new ObjectId(theoryIdString);
        
        // 2. Delete all pages associated with the theory
        await db.collection('theory-pages').deleteMany({ theoryId: theoryId });

        // 3. Delete the theory itself
        await db.collection('theories').deleteOne({ _id: theoryId });
    }

    // 4. Delete the module
    await db.collection('modules').deleteOne({ _id: moduleObjectId });

    return NextResponse.json({ message: 'Módulo y contenido asociado eliminados exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar el módulo' }, { status: 500 });
  }
}