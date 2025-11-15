'use client';

import type { PracticeOutput } from '@/ai/flows/practice-flow';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Question = Extract<PracticeOutput, { questions: any }>['questions'][0];

interface SingleChoiceQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export default function SingleChoiceQuestion({
  question,
  onAnswer,
}: SingleChoiceQuestionProps) {
  if (!question.options) return <p>Esta pregunta no tiene opciones.</p>;

  return (
    <RadioGroup onValueChange={onAnswer}>
      <div className="space-y-4">
        {question.options?.map((option, index) => (
          <div key={`${option}-${index}`} className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground">
            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
            <Label htmlFor={`${question.id}-${option}`} className="w-full text-base">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
