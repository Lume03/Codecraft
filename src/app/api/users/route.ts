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
      { 
        $set: {
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
          username: userData.username,
        },
        $setOnInsert: { 
          firebaseUid: userData.firebaseUid,
          createdAt: new Date(),
          level: 1,
          streak: 0,
          achievements: [],
          lives: 5,
          lastLifeUpdate: new Date(),
          lastStreakUpdate: null,
          progress: {},
        }
      },
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


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const firebaseUid = searchParams.get('firebaseUid');

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Falta el parámetro firebaseUid' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('ravencode');
    
    const user = await db.collection('users').findOne({ firebaseUid: firebaseUid });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const { _id, ...userWithoutId } = user;

    return NextResponse.json(userWithoutId);

  } catch (e) {
    console.error('Error in GET /api/users:', e);
    return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
  }
}
