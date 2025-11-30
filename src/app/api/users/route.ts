import { NextResponse } from 'next/server';
import type { UserProfile } from '@/docs/backend-types';
import clientPromise from '@/lib/mongodb';
import { recalculateLives } from '@/lib/lives';

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
      const { firebaseUid, ...updateData } = userData;
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([, v]) => v !== undefined)
      );

      if (Object.keys(cleanUpdateData).length > 0) {
        await usersCollection.updateOne(
            { firebaseUid: userData.firebaseUid },
            { $set: cleanUpdateData }
        );
      }
      const updatedUser = await usersCollection.findOne({ firebaseUid: userData.firebaseUid });
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
        lastStreakUpdate: null, 
      };

      await usersCollection.insertOne(newUser);
      
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
    
    const client = await clientPromise;
    const db = client.db('ravencode');
    const usersCollection = db.collection<UserProfile>('users');

    const user = await usersCollection.findOne({ firebaseUid });

    if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado en MongoDB' }, { status: 404 });
    }

    // Recalculate lives on every fetch to keep them updated
    const { lives, lastLifeUpdate } = recalculateLives(user);
    const userWithRecalculatedLives = { ...user, lives, lastLifeUpdate: lastLifeUpdate.toISOString() };

    return NextResponse.json(userWithRecalculatedLives);

  } catch (e) {
    console.error('Error in GET /api/users:', e);
    return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
  }
}
