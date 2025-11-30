import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { UserProfile } from '@/docs/backend-types';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const userData: Partial<UserProfile> & { firebaseUid: string; email: string } = await request.json();

    if (!userData.firebaseUid || !userData.email) {
      return NextResponse.json({ error: 'Faltan firebaseUid o email' }, { status: 400 });
    }

    const userRef = adminDb.collection('users').doc(userData.firebaseUid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // --- Lógica de Actualización ---
      const { firebaseUid, ...updateData } = userData;
      await userRef.update(updateData);
      const updatedUser = (await userRef.get()).data();
      return NextResponse.json(updatedUser, { status: 200 });

    } else {
      // --- Lógica de Creación (Insert) ---
      const newUser: UserProfile = {
        firebaseUid: userData.firebaseUid,
        email: userData.email,
        displayName: userData.displayName || 'Nuevo Usuario',
        username: userData.username || userData.email.split('@')[0],
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
        emailNotifications: userData.emailNotifications ?? true,
        reminderTime: userData.reminderTime || "21:00", // Use provided or default
        fcmToken: userData.fcmToken,
      };

      await userRef.set(newUser);
      
      // Devolvemos el objeto que acabamos de crear
      return NextResponse.json(newUser, { status: 201 });
    }

  } catch (e: any) {
    console.error('Error in /api/users:', e);
    const errorMessage = `Error al procesar la solicitud del usuario: ${e.message}`;
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
    
    const userDoc = await adminDb.collection('users').doc(firebaseUid).get();

    if (!userDoc.exists) {
      // Fallback to MongoDB for users that might not have been migrated
        const client = await clientPromise;
        const db = client.db('ravencode');
        const mongoUser = await db.collection('users').findOne({ firebaseUid: firebaseUid });

        if (!mongoUser) {
            return NextResponse.json({ error: 'Usuario no encontrado en ninguna base de datos' }, { status: 404 });
        }
         const { _id, ...userWithoutId } = mongoUser;
         return NextResponse.json(userWithoutId);
    }

    return NextResponse.json(userDoc.data());

  } catch (e) {
    console.error('Error in GET /api/users:', e);
    return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
  }
}
