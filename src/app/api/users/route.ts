import { NextResponse } from 'next/server';
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
      // Filtramos cualquier campo `undefined` para no sobreescribir datos existentes con `undefined`
      const { firebaseUid, ...updateData } = userData;
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([, v]) => v !== undefined)
      );

      if (Object.keys(cleanUpdateData).length > 0) {
        await userRef.update(cleanUpdateData);
      }
      const updatedUser = (await userRef.get()).data();
      return NextResponse.json(updatedUser, { status: 200 });

    } else {
      // --- Lógica de Creación (Insert) ---
      const newUser: UserProfile = {
        firebaseUid: userData.firebaseUid,
        email: userData.email,
        displayName: userData.displayName || 'Nuevo Usuario',
        username: userData.username || userData.email.split('@')[0],
        photoURL: userData.photoURL || '',
        createdAt: new Date(),
        level: 1,
        streak: 0,
        achievements: [],
        lives: 5,
        lastLifeUpdate: new Date().toISOString(),
        reminders: userData.reminders ?? true,
        emailNotifications: userData.emailNotifications ?? true,
        reminderTime: userData.reminderTime || "21:00", // Default a 9 PM UTC
        progress: {},
        fcmToken: userData.fcmToken || null,
        lastStreakUpdate: null, // explícitamente nulo al crear
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
        // Si el usuario no existe en Firestore, retornamos 404.
        // Esta es la única fuente de verdad para el perfil.
        return NextResponse.json({ error: 'Usuario no encontrado en Firestore' }, { status: 404 });
    }

    return NextResponse.json(userDoc.data());

  } catch (e) {
    console.error('Error in GET /api/users:', e);
    return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
  }
}
