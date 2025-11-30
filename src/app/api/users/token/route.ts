import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { firebaseUid, token } = await request.json();

    // Allow token to be null to handle unsubscription
    if (!firebaseUid) {
      return NextResponse.json({ error: 'Falta firebaseUid' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');

    await db.collection('users').updateOne(
      { firebaseUid: firebaseUid },
      { 
        $set: {
          fcmToken: token, // This will set the token or set it to null
          // If token is null, also disable reminders as a good practice
          ...(token === null && { reminders: false }),
        }
      },
      { upsert: false } // Do not create a user if they don't exist
    );
    
    const message = token ? 'Token de notificación actualizado' : 'Suscripción de notificaciones eliminada';
    return NextResponse.json({ message }, { status: 200 });

  } catch (e) {
    console.error('Error in /api/users/token:', e);
    return NextResponse.json({ error: 'Error al procesar la solicitud del token' }, { status: 500 });
  }
}
