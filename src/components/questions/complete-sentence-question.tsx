'use client';

import type { Question } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CompleteSentenceQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export default function CompleteSentenceQuestion({
  question,
  onAnswer,
}: CompleteSentenceQuestionProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAnswer(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Escribe tu respuesta aquí"
        className="text-lg"
      />
      <Button type="submit" className="w-full" disabled={!value.trim()}>
        Enviar respuesta
      </Button>
    </form>
  );
}
