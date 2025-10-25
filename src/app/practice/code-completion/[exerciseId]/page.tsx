'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { codeCompletionExercises } from '@/lib/data';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export default function CodeCompletionPage() {
  const params = useParams();
  const router = useRouter();
  const { exerciseId } = params as { exerciseId: string };
  const exercise = codeCompletionExercises.find((ex) => ex.id === exerciseId);

  const [placedBlocks, setPlacedBlocks] = useState<(string | null)[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[] | null>>({});

  useEffect(() => {
    if (exercise) {
      setPlacedBlocks(Array(exercise.correctOrder.length).fill(null));
      const shuffledBlocks = [...exercise.blocks].sort(() => Math.random() - 0.5);
      setAvailableBlocks(shuffledBlocks);
      setStatus('idle');
      setShowHint(false);
    }
  }, [exercise]);

  if (!exercise) {
    return notFound();
  }

  const currentIndex = codeCompletionExercises.findIndex(ex => ex.id === exerciseId);
  const totalExercises = codeCompletionExercises.length;
  const progress = ((currentIndex + 1) / totalExercises) * 100;
  const isLastExercise = currentIndex === totalExercises - 1;

  const handlePlaceBlock = (block: string, index: number) => {
    const firstEmptyIndex = placedBlocks.findIndex((b) => b === null);
    if (firstEmptyIndex !== -1) {
      const newPlaced = [...placedBlocks];
      newPlaced[firstEmptyIndex] = block;
      setPlacedBlocks(newPlaced);

      const newAvailable = availableBlocks.filter((_, i) => i !== index);
      setAvailableBlocks(newAvailable);
    }
  };

  const handleRemoveBlock = (index: number) => {
    const block = placedBlocks[index];
    if (block !== null) {
      const newPlaced = [...placedBlocks];
      newPlaced[index] = null;
      setPlacedBlocks(newPlaced);
      setAvailableBlocks([...availableBlocks, block]);
    }
  };
  
  const handleCheck = () => {
    const currentAnswers = placedBlocks.filter(b => b !== null) as string[];
    setUserAnswers(prev => ({...prev, [exercise.id]: currentAnswers}));

    const isCorrect =
      JSON.stringify(placedBlocks) === JSON.stringify(exercise.correctOrder);
    setStatus(isCorrect ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    if (isLastExercise) {
      const answersQuery = new URLSearchParams(userAnswers as any).toString();
      router.push(`/practice/code-completion/results?${answersQuery}`);
    } else {
      const nextExercise = codeCompletionExercises[currentIndex + 1];
      if (nextExercise) {
        router.push(`/practice/code-completion/${nextExercise.id}`);
      }
    }
  };

  const isComplete = !placedBlocks.includes(null);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={exercise.title} showBackButton />

      <main className="flex-1 space-y-4 p-4 pb-40 md:p-6">
        <div className="mx-auto max-w-2xl">
           <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Pregunta {currentIndex + 1} de {totalExercises}
              </span>
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </div>

          <p className="text-center text-muted-foreground">{exercise.instruction}</p>

          {/* Target Area for Blocks */}
          <div className="mt-4 min-h-[6rem] rounded-2xl border-2 border-dashed bg-card p-4">
            <div className="flex flex-wrap gap-2">
              {placedBlocks.map((block, index) => (
                <Button
                  key={`${block}-${index}`}
                  variant={block ? 'default' : 'secondary'}
                  className={cn('h-12 flex-grow basis-24 font-code text-base', block && 'cursor-pointer')}
                  onClick={() => handleRemoveBlock(index)}
                >
                  {block ?? '?'}
                </Button>
              ))}
            </div>
          </div>

          {/* Available Blocks */}
          <div className="mt-4 min-h-[6rem] rounded-2xl bg-secondary/50 p-4">
            <div className="flex flex-wrap gap-2">
              {availableBlocks.map((block, index) => (
                <Button
                  key={`${block}-${index}`}
                  variant="outline"
                  className="h-12 flex-grow basis-24 bg-card font-code text-base"
                  onClick={() => handlePlaceBlock(block, index)}
                >
                  {block}
                </Button>
              ))}
            </div>
          </div>

          {/* Hint Section */}
          {showHint && (
            <Alert className="mt-4">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Pista</AlertTitle>
              <AlertDescription>{exercise.hint}</AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/80 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
        <div className="mx-auto max-w-2xl">
          {status === 'idle' && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowHint(true)}
              >
                <Lightbulb className="mr-2 h-4 w-4" /> Pista
              </Button>
              <Button
                className="flex-1"
                disabled={!isComplete}
                onClick={handleCheck}
                 style={{
                    borderRadius: '9999px',
                    boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)',
                  }}
              >
                Comprobar
              </Button>
            </div>
          )}
          
          {status !== 'idle' && (
             <Alert variant={status === 'correct' ? 'default' : 'destructive'} className={cn(status === 'correct' && 'border-green-500 bg-green-500/10 text-green-500')}>
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      {status === 'correct' ? <CheckCircle className="h-6 w-6 text-green-500" /> : <XCircle className="h-6 w-6 text-destructive" />}
                      <div className="flex-1">
                          <AlertTitle className={cn(status === 'correct' && 'text-green-400')}>{status === 'correct' ? '¡Correcto!' : '¡Sigue intentando!'}</AlertTitle>
                          <AlertDescription className={cn(status === 'correct' && 'text-green-500/80')}>
                              {status === 'correct' ? '¡Buen trabajo! Has ordenado el código perfectamente.' : 'El orden no es el correcto. ¡Inténtalo de nuevo!'}
                          </AlertDescription>
                      </div>
                  </div>
                   <div className="flex items-center gap-2">
                    { status === 'incorrect' && (
                      <Button onClick={() => setStatus('idle')} size="sm" variant="outline" className="shrink-0" style={{borderRadius: '9999px'}}>
                          Reintentar
                      </Button>
                    )}
                    <Button onClick={handleNext} size="sm" className="shrink-0" style={{borderRadius: '9999px'}}>
                        Continuar
                    </Button>
                  </div>
              </div>
             </Alert>
          )}
        </div>
      </footer>
    </div>
  );
}
