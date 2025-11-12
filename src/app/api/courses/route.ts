import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Course } from '@/lib/data';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const client = await clientPromise;
        const db = client.db('ravencode');

        if (id) {
             if (!ObjectId.isValid(id)) {
                return NextResponse.json({ error: 'El ID del curso proporcionado es inválido.' }, { status: 400 });
            }
            const course = await db.collection('courses').findOne({ _id: new ObjectId(id) });
            if (!course) {
                return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
            }
             const courseWithStringId = {
                ...course,
                id: course._id.toString(),
                _id: undefined,
            };
            return NextResponse.json(courseWithStringId);
        }

        const courses = await db
            .collection('courses')
            .find({})
            .sort({ title: 1 })
            .toArray();

        // Convert ObjectId to string for client-side consumption
        const coursesWithStringId = courses.map(course => ({
            ...course,
            id: course._id.toString(),
            _id: undefined, // remove original _id
        }));


        return NextResponse.json(coursesWithStringId);
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: 'Error al conectar con la base de datos' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
  try {
    const { title, description, imageId } = await request.json();
    if (!title || !description || !imageId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: title, description, imageId' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    const newCourse = {
      title,
      description,
      imageId,
    };

    const result = await db.collection('courses').insertOne(newCourse);

    return NextResponse.json({ ...newCourse, id: result.insertedId.toString() }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Error al crear el curso' },
      { status: 500 }
    );
  }
}
