'use client';

import type { Question } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ReorderQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
}

export default function ReorderQuestion({
  question,
  onAnswer,
}: ReorderQuestionProps) {
  const [items, setItems] = useState(question.options || []);

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
      <Button onClick={handleSubmit} className="w-full">
        Confirm Order
      </Button>
    </div>
  );
}
