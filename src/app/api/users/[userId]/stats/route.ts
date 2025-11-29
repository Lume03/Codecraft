import { NextResponse, type NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { message: 'Falta el ID de usuario' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('ravencode');

    const practiceHistoryRef = db.collection('practiceHistory');
    const snapshot = await practiceHistoryRef.find({ firebaseUid: userId }).toArray();

    if (snapshot.length === 0) {
      return NextResponse.json({
        averageScore: 0,
        completedSections: 0,
        totalAttempts: 0,
      });
    }

    let totalScore = 0;
    const completedSections = new Set<string>();

    snapshot.forEach((doc) => {
      const score = Number(doc.score) || 0;
      const maxScore = Number(doc.maxScore) || 5;

      const percentageScore = maxScore > 0 ? (score / maxScore) * 100 : 0;
      totalScore += percentageScore;

      if (doc.approved && doc.lessonId) {
        completedSections.add(doc.lessonId.toString());
      }
    });

    const totalAttempts = snapshot.length;
    const averageScore = totalAttempts > 0 ? totalScore / totalAttempts : 0;

    return NextResponse.json({
      averageScore,
      completedSections: completedSections.size,
      totalAttempts,
    });
  } catch (e: any) {
    console.error('Error in /api/users/stats:', e);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: e.message },
      { status: 500 }
    );
  }
}
