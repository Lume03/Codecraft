'use client';

import type { Question } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BooleanQuestionProps {
  question: Question;
  onAnswer: (answer: boolean) => void;
}

export default function BooleanQuestion({
  question,
  onAnswer,
}: BooleanQuestionProps) {
  return (
    <div className="flex items-center justify-center gap-4 rounded-md border p-4">
      <Label htmlFor="boolean-switch" className="text-lg font-medium">
        False
      </Label>
      <Switch id="boolean-switch" onCheckedChange={onAnswer} />
      <Label htmlFor="boolean-switch" className="text-lg font-medium">
        True
      </Label>
    </div>
  );
}
