'use client';

import type { Question } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SingleChoiceQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export default function SingleChoiceQuestion({
  question,
  onAnswer,
}: SingleChoiceQuestionProps) {
  return (
    <RadioGroup onValueChange={onAnswer}>
      <div className="space-y-4">
        {question.options?.map((option) => (
          <div key={option} className="flex items-center space-x-3 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option} className="w-full text-base">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
