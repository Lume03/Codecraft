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

    // Prepare update fields, excluding firebaseUid from $set
    const { firebaseUid, reminderTime, ...updateData } = userData;
    const update: { $set: Partial<UserProfile>, $setOnInsert?: Partial<UserProfile> } = {
        $set: updateData
    };
    
    // If reminderTime is explicitly provided, add it to the $set operator.
    if (reminderTime) {
      update.$set.reminderTime = reminderTime;
    }

    // Set initial values only on creation
    update.$setOnInsert = {
        firebaseUid: userData.firebaseUid,
        createdAt: new Date(),
        level: 1,
        streak: 0,
        achievements: [],
        lives: 5,
        lastLifeUpdate: new Date(),
        lastStreakUpdate: null,
        progress: {},
        reminders: true, // Default reminders to true
        reminderTime: "21:00", // Default reminder time ONLY on insert
    };
    
    // Use upsert to create or update the user document based on firebaseUid
    const result = await usersCollection.updateOne(
      { firebaseUid: userData.firebaseUid },
      update,
      { upsert: true }
    );

    const updatedUser = await usersCollection.findOne({ firebaseUid: userData.firebaseUid });

    if (result.upsertedId) {
      return NextResponse.json(updatedUser, { status: 201 });
    } else {
      return NextResponse.json(updatedUser, { status: 200 });
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
