'use client';

import { useState, useTransition } from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { courses, user as mockUser } from '@/lib/data';
import type { PersonalizedCourseRecommendationsOutput } from '@/ai/flows/personalized-course-recommendations';
import { getPersonalizedCourseRecommendations } from '@/ai/flows/personalized-course-recommendations';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Recommendations() {
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] =
    useState<PersonalizedCourseRecommendationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = () => {
    startTransition(async () => {
      setError(null);
      try {
        const userProgress = courses.reduce((acc, course) => {
          acc[course.id] = course.progress;
          return acc;
        }, {} as Record<string, number>);

        const result = await getPersonalizedCourseRecommendations({
          userId: mockUser.id,
          learningHistory: courses.map((c) => c.id),
          progressData: userProgress,
        });
        setRecommendations(result);
      } catch (e) {
        console.error(e);
        setError('No se pudieron obtener recomendaciones. Por favor, inténtalo de nuevo.');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesión sugerida</CardTitle>
        <CardDescription>
          Obtén recomendaciones de cursos según tu progreso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations ? (
          <div className="space-y-2">
            <p className="font-semibold">Aquí tienes algunos cursos que te podrían gustar:</p>
            <ul className="list-disc space-y-1 pl-5">
              {recommendations.courseRecommendations.map((courseId) => {
                const course = courses.find((c) => c.id === courseId);
                return course ? (
                  <li key={courseId}>
                    <Link href={`/course/${course.id}`} className="underline hover:text-primary">
                      {course.title}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
             <Button variant="outline" onClick={() => setRecommendations(null)} className="mt-4">
              Limpiar
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleGetRecommendations}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              'Obtener recomendaciones'
            )}
          </Button>
        )}
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
