'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Trophy, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import type { PracticeOutput } from '@/ai/flows/practice-flow';

type GradeOutput = Extract<PracticeOutput, { score: number }>;

function ResultsDisplay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const dataParam = searchParams.get('data');
  if (!dataParam) {
    return <p>No se encontraron datos de resultados.</p>;
  }

  const results: GradeOutput = JSON.parse(decodeURIComponent(dataParam));

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center">
      <Card>
        <CardHeader className="items-center">
            <Trophy className="h-16 w-16 text-yellow-400" />
            <CardTitle className="text-2xl pt-4">
                ¡Práctica completada!
            </CardTitle>
            <CardDescription>
                {results.approved ? "¡Buen trabajo! Has aprobado esta lección." : "Sigue practicando, ¡puedes hacerlo mejor!"}
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-4xl font-bold text-foreground">
            {results.score} / {results.maxScore}
          </p>
          
          <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/practice">
                Más práctica
              </Link>
            </Button>
            <Button asChild className="flex-1" style={{ borderRadius: '9999px', boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)' }}>
              <Link href="/learn">
                Continuar Aprendiendo
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Revisa tus respuestas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          {results.results.map((res, index) => {
            return (
              <div key={res.questionId} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <p className="flex-1 font-semibold">{index + 1}. (ID: {res.questionId})</p>
                   {res.isCorrect ? (
                     <CheckCircle className="h-5 w-5 text-green-500 ml-4 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive ml-4 shrink-0" />
                  )}
                </div>
                 <div className="mt-2 text-sm space-y-1 font-code bg-secondary/30 p-2 rounded-md">
                   <p><span className="font-medium text-muted-foreground">Tu respuesta:</span> {JSON.stringify(res.userAnswer)}</p>
                   {!res.isCorrect && (
                     <p className="text-green-500"><span className="font-medium">Respuesta correcta:</span> {JSON.stringify(res.correctAnswer)}</p>
                   )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

    </div>
  );
}


export default function PracticeResultsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Resultados" showBackButton />
      <main className="flex-1 p-4 md:p-6">
        <Suspense fallback={<div>Cargando resultados...</div>}>
          <ResultsDisplay />
        </Suspense>
      </main>
    </div>
  );
}
