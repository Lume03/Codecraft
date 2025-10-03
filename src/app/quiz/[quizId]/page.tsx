'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { quizzes } from '@/lib/data';
import { Header } from '@/components/header';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SingleChoiceQuestion from '@/components/questions/single-choice-question';
import BooleanQuestion from '@/components/questions/boolean-question';
import CompleteSentenceQuestion from '@/components/questions/complete-sentence-question';
import ReorderQuestion from '@/components/questions/reorder-question';
import CodeBlocksQuestion from '@/components/questions/code-blocks-question';

export default function QuizPage({ params }: { params: { quizId: string } }) {
  const router = useRouter();
  const quiz = quizzes.find((q) => q.id === params.quizId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isAnswered, setIsAnswered] = useState(false);

  if (!quiz) {
    notFound();
  }

  const question = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswer = (answer: any) => {
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Here you would typically save the results and get an attemptId
      router.push('/results/1');
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'single_choice':
        return <SingleChoiceQuestion question={question} onAnswer={handleAnswer} />;
      case 'boolean':
        return <BooleanQuestion question={question} onAnswer={handleAnswer} />;
      case 'complete_sentence':
        return (
          <CompleteSentenceQuestion question={question} onAnswer={handleAnswer} />
        );
      case 'reorder':
        return <ReorderQuestion question={question} onAnswer={handleAnswer} />;
      case 'code_blocks':
        return <CodeBlocksQuestion question={question} onAnswer={handleAnswer} />;
      default:
        return <p>Unsupported question type.</p>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={quiz.title} showBackButton />
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
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
            <Button onClick={handleNext} disabled={!isAnswered} className="w-full md:w-auto">
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
