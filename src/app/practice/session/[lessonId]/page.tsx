'use client';

import { useEffect, useState, useMemo } from 'react';
import { notFound, useRouter, useParams, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';
import type { PracticeOutput, PracticeInput } from '@/ai/flows/practice-flow';
import SingleChoiceQuestion from '@/components/questions/single-choice-question';
import BooleanQuestion from '@/components/questions/boolean-question';
import ReorderQuestion from '@/components/questions/reorder-question';
import { useUser } from '@/firebase';

type Question = Extract<PracticeOutput, { questions: any }>['questions'][0];

export default function PracticeSessionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const user = useUser();

  const { lessonId } = params as { lessonId: string };
  const courseId = searchParams.get('courseId');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  
  useEffect(() => {
    if (!lessonId || !courseId || !user) return;

    let ignore = false;

    const startPractice = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/practice/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid, courseId, lessonId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al iniciar la práctica');
        }

        if (ignore) return;

        if (data.questions) {
          setQuestions(data.questions);
        } else {
          throw new Error('No se recibieron preguntas del servidor.');
        }

      } catch (err: any) {
        console.error(err);
        if (!ignore) {
            setError(err.message);
        }
      } finally {
        if (!ignore) {
            setLoading(false);
        }
      }
    };

    startPractice();

    return () => {
        ignore = true;
    }
  }, [lessonId, courseId, user]);


  const question = useMemo(() => {
      if(questions.length > 0) return questions[currentQuestionIndex];
      return null;
  }, [questions, currentQuestionIndex]);

  const progress = useMemo(() => {
      if(questions.length === 0) return 0;
      return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [questions, currentQuestionIndex]);

  const isLastQuestion = useMemo(() => {
      if(questions.length === 0) return false;
      return currentQuestionIndex === questions.length - 1;
  }, [questions, currentQuestionIndex]);


  const handleAnswer = (answer: any) => {
    if(!question) return;
    setUserAnswers((prev) => ({ ...prev, [question.id]: answer }));
    setIsAnswered(true);
  };

  const handleNext = async () => {
    if (isLastQuestion) {
        // Submit answers
        try {
            const submissionPayload: Extract<PracticeInput, { mode: 'grade' }> = {
                mode: 'grade',
                questions: questions,
                answers: Object.entries(userAnswers).map(([questionId, userAnswer]) => ({
                    questionId,
                    userAnswer,
                })),
            };

            const response = await fetch('/api/practice/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid,
                    courseId,
                    lessonId,
                    submission: submissionPayload,
                }),
            });
            
            const resultData = await response.json();
            if (!response.ok) {
                throw new Error(resultData.message || 'Error al enviar las respuestas');
            }
            
            const params = new URLSearchParams();
            params.set('data', encodeURIComponent(JSON.stringify(resultData)));
            params.set('questions', encodeURIComponent(JSON.stringify(questions)));
            if (courseId) {
                params.set('courseId', courseId);
            }

            router.push(`/practice/results?${params.toString()}`);

        } catch (err: any) {
            console.error(err);
            setError(err.message);
        }

    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
    }
  };

  const renderQuestion = () => {
    if (!question) return null;

    switch (question.type) {
      case 'single_choice':
        return (
          <SingleChoiceQuestion question={question} onAnswer={handleAnswer} />
        );
      case 'boolean':
        return <BooleanQuestion question={question} onAnswer={handleAnswer} />;
      case 'reorder':
        return <ReorderQuestion question={question} onAnswer={handleAnswer} />;
      default:
        return <p>Tipo de pregunta no soportado: {question.type}</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Generando tu práctica...</p>
      </div>
    );
  }

  if (error) {
     return (
       <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle>Error al iniciar la práctica</AlertTitle>
            <AlertDescription>
                {error}
                <Button variant="link" onClick={() => router.back()} className="p-0 h-auto mt-2">
                    Volver a la lección
                </Button>
            </AlertDescription>
        </Alert>
       </div>
    );
  }

  if (questions.length === 0 || !question) {
    return <p>No se encontraron preguntas.</p>;
  }


  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Práctica" showBackButton />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </span>
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="mb-6 text-lg font-semibold">{question.text}</p>
              {renderQuestion()}
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="w-full md:w-auto"
            >
              {isLastQuestion ? 'Finalizar y Corregir' : 'Siguiente'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
