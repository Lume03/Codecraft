import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Course } from '@/lib/data';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('ravencode'); // Asegúrate de que este es el nombre de tu BD

    const courses = await db
      .collection<Course>('courses')
      .find({})
      .sort({ title: 1 })
      .toArray();

    return NextResponse.json(courses);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Error al conectar con la base de datos' },
      { status: 500 }
    );
  }
}
