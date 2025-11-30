import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { firebaseUid, token } = await request.json();

    if (!firebaseUid || !token) {
      return NextResponse.json({ error: 'Faltan firebaseUid o token' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    await db.collection('users').updateOne(
      { firebaseUid: firebaseUid },
      { 
        $set: {
          fcmToken: token,
          // You might also want to set a flag indicating notifications are enabled
          reminders: true,
        }
      },
      { upsert: false } // Do not create a user if they don't exist
    );

    return NextResponse.json({ message: 'Token de notificación actualizado' }, { status: 200 });

  } catch (e) {
    console.error('Error in /api/users/token:', e);
    return NextResponse.json({ error: 'Error al procesar la solicitud del token' }, { status: 500 });
  }
}
