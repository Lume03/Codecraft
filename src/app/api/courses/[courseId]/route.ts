import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Get a single course
export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });

    if (!course) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
        ...course,
        id: course._id.toString(),
        _id: undefined
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener el curso' }, { status: 500 });
  }
}


// Update a course
export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const { title, description, imageId } = await request.json();

    if (!ObjectId.isValid(courseId) || !title || !description || !imageId) {
      return NextResponse.json({ error: 'ID de curso inválido o faltan datos' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    const result = await db.collection('courses').updateOne(
      { _id: new ObjectId(courseId) },
      { $set: { title, description, imageId } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Curso actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar el curso' }, { status: 500 });
  }
}

// Delete a course and all its related content
export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;

    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');
    const courseObjectId = new ObjectId(courseId);

    // 1. Find all modules for the course
    const modules = await db.collection('modules').find({ courseId: courseObjectId }).toArray();
    const theoryIds = modules
      .map(m => m.type === 'theory' && m.contentId && ObjectId.isValid(m.contentId) ? new ObjectId(m.contentId) : null)
      .filter(id => id !== null) as ObjectId[];

    // 2. Delete all pages associated with the theories from this course
    if (theoryIds.length > 0) {
        await db.collection('theory-pages').deleteMany({ theoryId: { $in: theoryIds } });
    }
    
    // 3. Delete all the theories themselves
    if (theoryIds.length > 0) {
        await db.collection('theories').deleteMany({ _id: { $in: theoryIds } });
    }

    // 4. Delete all modules for the course
    await db.collection('modules').deleteMany({ courseId: courseObjectId });

    // 5. Delete the course itself
    const courseDeletionResult = await db.collection('courses').deleteOne({ _id: courseObjectId });
    if (courseDeletionResult.deletedCount === 0) {
        return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Curso y todo su contenido asociado eliminados exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar el curso' }, { status: 500 });
  }
}
