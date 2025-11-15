'use client';

import type { PracticeOutput } from '@/ai/flows/practice-flow';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Question = Extract<PracticeOutput, { questions: any }>['questions'][0];

interface BooleanQuestionProps {
  question: Question;
  onAnswer: (answer: boolean) => void;
}

export default function BooleanQuestion({
  question,
  onAnswer,
}: BooleanQuestionProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSelect = (value: boolean) => {
    setSelected(value);
    onAnswer(value);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => handleSelect(true)}
        className={cn(
          'w-full justify-start p-6 text-lg h-auto',
          selected === true
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary'
        )}
        variant={selected === true ? 'default' : 'outline'}
      >
        Verdadero
      </Button>
      <Button
        onClick={() => handleSelect(false)}
        className={cn(
          'w-full justify-start p-6 text-lg h-auto',
          selected === false
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary'
        )}
        variant={selected === false ? 'default' : 'outline'}
      >
        Falso
      </Button>
    </div>
  );
}
