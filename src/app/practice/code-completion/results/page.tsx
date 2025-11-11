'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Trophy, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { codeCompletionExercises } from '@/lib/data';

function ResultsDisplay() {
  const searchParams = useSearchParams();
  
  let score = 0;
  const userAnswers: Record<string, string[]> = {};

  // Extract answers from search params
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith('py-drag-')) {
       userAnswers[key] = value.split(',');
    }
  }

  codeCompletionExercises.forEach((ex) => {
    if (JSON.stringify(userAnswers[ex.id]) === JSON.stringify(ex.correctOrder)) {
      score++;
    }
  });

  const total = codeCompletionExercises.length;

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center">
      <Card>
        <CardHeader className="items-center">
            <Trophy className="h-16 w-16 text-yellow-400" />
            <CardTitle className="text-2xl pt-4">
                ¡Completaste la práctica!
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-4xl font-bold text-foreground">
            {score} / {total}
          </p>
          
          <div className="text-lg text-muted-foreground">
            <p>Respondiste {score} de {total} preguntas correctamente.</p>
          </div>

          <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/practice">
                Más práctica
              </Link>
            </Button>
            <Button asChild className="flex-1" style={{ borderRadius: '9999px', boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)' }}>
              <Link href="/learn">
                Continuar
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
          {codeCompletionExercises.map((ex, index) => {
            const answer = userAnswers[ex.id] || [];
            const isCorrect = JSON.stringify(answer) === JSON.stringify(ex.correctOrder);
            
            return (
              <div key={ex.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <p className="flex-1 font-semibold">{index + 1}. {ex.instruction}</p>
                  {isCorrect ? (
                     <CheckCircle className="h-5 w-5 text-green-500 ml-4 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive ml-4 shrink-0" />
                  )}
                </div>
                <div className="mt-2 text-sm space-y-1 font-code bg-secondary/30 p-2 rounded-md">
                  <p><span className="font-medium text-muted-foreground">Tu respuesta:</span> {answer.join(' ')}</p>
                  {!isCorrect && (
                     <p className="text-green-500"><span className="font-medium">Respuesta correcta:</span> {ex.correctOrder.join(' ')}</p>
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
      <Header title="Resultados" />
      <main className="flex-1 p-4 md:p-6">
        <Suspense fallback={<div>Cargando resultados...</div>}>
          <ResultsDisplay />
        </Suspense>
      </main>
    </div>
  );
}
