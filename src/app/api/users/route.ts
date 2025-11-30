import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { UserProfile } from '@/docs/backend-types';

export async function POST(request: Request) {
  try {
    const userData: Partial<UserProfile> & { firebaseUid: string; email: string } = await request.json();

    if (!userData.firebaseUid || !userData.email) {
      return NextResponse.json({ error: 'Faltan firebaseUid o email' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ravencode');
    const usersCollection = db.collection<UserProfile>('users');

    const existingUser = await usersCollection.findOne({ firebaseUid: userData.firebaseUid });

    if (existingUser) {
      // --- Lógica de Actualización ---
      const { _id, createdAt, firebaseUid, ...updateData } = userData as any;
      
      const result = await usersCollection.updateOne(
        { firebaseUid: userData.firebaseUid },
        { $set: updateData }
      );
      
      const updatedUser = await usersCollection.findOne({ firebaseUid: userData.firebaseUid });
      return NextResponse.json(updatedUser, { status: 200 });

    } else {
      // --- Lógica de Creación (Insert) ---
      const newUser: UserProfile = {
        firebaseUid: userData.firebaseUid,
        email: userData.email,
        displayName: userData.displayName || 'Nuevo Usuario',
        username: userData.username,
        photoURL: userData.photoURL,
        createdAt: new Date(),
        level: 1,
        streak: 0,
        achievements: [],
        lives: 5,
        lastLifeUpdate: new Date().toISOString(),
        lastStreakUpdate: undefined, // Explicitly undefined
        progress: {},
        reminders: userData.reminders ?? true,
        reminderTime: userData.reminderTime || "21:00", // Use provided or default
        fcmToken: userData.fcmToken,
      };

      const result = await usersCollection.insertOne(newUser);
      
      // MongoDB no devuelve el documento insertado directamente, así que lo devolvemos nosotros
      const { ...insertedUser } = newUser;
      return NextResponse.json(insertedUser, { status: 201 });
    }

  } catch (e: any) {
    console.error('Error in /api/users:', e);
    // Devuelve un error más detallado si es posible
    const errorMessage = e.code === 11000 
      ? 'Error de duplicado. El usuario ya podría existir.' 
      : `Error al procesar la solicitud del usuario: ${e.message}`;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
