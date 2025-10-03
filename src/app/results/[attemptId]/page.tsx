import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { quizzes } from '@/lib/data';
import { CheckCircle, Home, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage({
  params,
}: {
  params: { attemptId: string };
}) {
  // In a real app, you'd fetch results based on attemptId
  // For now, we'll simulate results for the first quiz
  const quiz = quizzes[0];
  const score = 3; // Simulated score
  const total = quiz.questions.length;
  const percentage = (score / total) * 100;
  
  // Simulated user answers
  const userAnswers = {
      q1: 'const',
      q2: false,
      q3: 'type',
      q4: ['let x;', 'x = 10;'],
      q5: ['Hello', 'CodeCraft'],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Quiz Results" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">
                {percentage > 70 ? 'Great Job!' : 'Keep Practicing!'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">
                {score} / {total}
              </p>
              <Progress value={percentage} className="h-4" />
              <p className="text-muted-foreground">
                You answered {score} questions correctly.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" asChild>
                  <Link href={`/quiz/${quiz.id}`}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Retry
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/learn">
                    <Home className="mr-2 h-4 w-4" /> Go Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Your Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quiz.questions.map((q, index) => {
                const userAnswer = (userAnswers as any)[q.id];
                const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer);

                return (
                  <div key={q.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <p className="flex-1 font-semibold">{index + 1}. {q.text}</p>
                      {isCorrect ? (
                         <CheckCircle className="h-5 w-5 text-green-500 ml-4 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive ml-4 shrink-0" />
                      )}
                    </div>
                    <div className="mt-2 text-sm">
                      <p><span className="font-medium text-muted-foreground">Your answer:</span> {JSON.stringify(userAnswer)}</p>
                      {!isCorrect && (
                         <p className="text-green-500"><span className="font-medium">Correct answer:</span> {JSON.stringify(q.correctAnswer)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
