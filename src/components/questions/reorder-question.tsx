'use client';

import type { PracticeOutput } from '@/ai/flows/practice-flow';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

type Question = Extract<PracticeOutput, { questions: any }>['questions'][0];

interface ReorderQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
}

export default function ReorderQuestion({
  question,
  onAnswer,
}: ReorderQuestionProps) {
  const [items, setItems] = useState<string[]>([]);
  
  useEffect(() => {
    if (question.options) {
      // Shuffle options to make it a challenge
      setItems([...question.options].sort(() => Math.random() - 0.5));
    }
  }, [question.options]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newItems.length) {
      const temp = newItems[index];
      newItems[index] = newItems[newIndex];
      newItems[newIndex] = temp;
      setItems(newItems);
    }
  };
  
  const handleSubmit = () => {
    onAnswer(items);
  };

  useEffect(() => {
    // Automatically submit when all items are ordered, 
    // since there's no separate "submit" button in this design.
    if(items.length > 0) {
        onAnswer(items);
    }
  }, [items, onAnswer]);


  if (!question.options) return <p>Esta pregunta no tiene opciones para ordenar.</p>;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-md border bg-card p-3 font-code text-sm"
          >
            <span className="flex-1">{item}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => moveItem(index, 'down')}
                disabled={index === items.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
       <p className="text-center text-sm text-muted-foreground">
        Ordena los bloques en el orden correcto. La respuesta se registrará automáticamente.
      </p>
    </div>
  );
}
