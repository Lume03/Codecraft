import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

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

    const practiceHistoryRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('practiceHistory');
    const snapshot = await practiceHistoryRef.get();

    if (snapshot.empty) {
      return NextResponse.json({
        averageScore: 0,
        completedSections: 0,
        totalAttempts: 0,
      });
    }

    let totalScore = 0;
    const completedSections = new Set<string>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Asegurarse de que el score sea un número y no NaN o undefined
      const score = Number(data.score) || 0;
      const maxScore = Number(data.maxScore) || 5; // Asumir 5 si no está presente

      // Calcular el score porcentual para normalizarlo
      const percentageScore = maxScore > 0 ? (score / maxScore) * 100 : 0;
      totalScore += percentageScore;

      if (data.approved && data.lessonId) {
        completedSections.add(data.lessonId);
      }
    });

    const totalAttempts = snapshot.size;
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
