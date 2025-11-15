import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    if (!userData.firebaseUid || !userData.email) {
      return NextResponse.json({ error: 'Faltan firebaseUid o email' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    // Use upsert to create or update the user document based on firebaseUid
    const result = await db.collection('users').updateOne(
      { firebaseUid: userData.firebaseUid },
      { $set: userData, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    if (result.upsertedId) {
      return NextResponse.json({ message: 'Usuario creado en MongoDB', userId: result.upsertedId }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Usuario actualizado en MongoDB' }, { status: 200 });
    }

  } catch (e) {
    console.error('Error in /api/users:', e);
    return NextResponse.json({ error: 'Error al procesar la solicitud del usuario' }, { status: 500 });
  }
}
