import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Course } from '@/lib/data';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('ravencode');

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

    return NextResponse.json({ ...newCourse, _id: result.insertedId }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Error al crear el curso' },
      { status: 500 }
    );
  }
}
