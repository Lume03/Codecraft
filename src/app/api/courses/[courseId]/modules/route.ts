import { NextResponse, type NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const { lessonTitle, moduleType, pages } = await request.json();

    if (!courseId || !lessonTitle || !moduleType || !pages || !Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: 'Faltan campos requeridos o son inválidos' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    // 1. Create Theory document
    const theoryResult = await db.collection('theories').insertOne({ title: lessonTitle });
    const theoryId = theoryResult.insertedId;

    // 2. Create TheoryPage documents
    const pagesToInsert = pages.map((page, index) => ({
      ...page,
      theoryId: theoryId,
      order: index + 1,
    }));
    await db.collection('theory-pages').insertMany(pagesToInsert);

    // 3. Create Module document in the course
    const newModule = {
      courseId: new ObjectId(courseId),
      title: lessonTitle,
      type: 'theory',
      contentId: theoryId.toString(),
      duration: 5, // Static duration
      order: Date.now(),
      moduleType,
    };
    
    await db.collection('modules').insertOne(newModule);

    return NextResponse.json({ message: 'Lección creada exitosamente' }, { status: 201 });

  } catch (e) {
    console.error(e);
    if (e instanceof Error && e.message.includes('Argument passed in must be a string')) {
         return NextResponse.json({ error: 'El ID del curso proporcionado es inválido.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al guardar la lección en el servidor' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    if (!ObjectId.isValid(courseId)) {
       return NextResponse.json({ error: 'El ID del curso proporcionado es inválido.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ravencode");

    const modules = await db
      .collection("modules")
      .find({ courseId: new ObjectId(courseId) })
      .sort({ order: 1 })
      .toArray();
    
    const modulesWithStringIds = modules.map(module => ({
        ...module,
        id: module._id.toString(),
        _id: undefined,
        courseId: module.courseId.toString(),
    }));

    return NextResponse.json(modulesWithStringIds);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error al obtener los módulos" },
      { status: 500 }
    );
  }
}
