'use client';

import type { Question } from '@/lib/data.tsx';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CodeBlocksQuestionProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
}

export default function CodeBlocksQuestion({
  question,
  onAnswer,
}: CodeBlocksQuestionProps) {
  const { codeSnippet = '', blocks = [] } = question;
  const numBlanks = (codeSnippet.match(/___/g) || []).length;

  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    Array(numBlanks).fill(null)
  );
  const [availableBlocks, setAvailableBlocks] = useState<string[]>(blocks);

  useEffect(() => {
    const isComplete = selectedAnswers.every((ans) => ans !== null);
    if (isComplete) {
      onAnswer(selectedAnswers as string[]);
    }
  }, [selectedAnswers, onAnswer]);

  const handleBlockClick = (block: string) => {
    const nextBlankIndex = selectedAnswers.findIndex((ans) => ans === null);
    if (nextBlankIndex !== -1) {
      const newAnswers = [...selectedAnswers];
      newAnswers[nextBlankIndex] = block;
      setSelectedAnswers(newAnswers);
      setAvailableBlocks(availableBlocks.filter((b) => b !== block));
    }
  };

  const handleAnswerClick = (answer: string | null, index: number) => {
    if (answer) {
      const newAnswers = [...selectedAnswers];
      newAnswers[index] = null;
      setSelectedAnswers(newAnswers);
      setAvailableBlocks([...availableBlocks, answer].sort()); // Keep order consistent
    }
  };

  const renderCodeSnippet = () => {
    let partIndex = 0;
    const parts = codeSnippet.split('___');
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && (
          <Button
            variant="secondary"
            className={cn(
              'mx-1 h-8 min-w-[6rem] px-3 font-code',
              selectedAnswers[partIndex] && 'text-primary-foreground bg-primary'
            )}
            onClick={() =>
              handleAnswerClick(selectedAnswers[partIndex], partIndex)
            }
          >
            {selectedAnswers[partIndex] || '___'}
          </Button>
        )}
        {(partIndex = i + 1)}
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="min-h-[4rem] rounded-md bg-card p-4 font-code text-base flex items-center">
        {renderCodeSnippet()}
      </div>
      <div className="space-y-2 pt-4">
        <div className="flex flex-wrap gap-2">
          {availableBlocks.map((block) => (
            <Button
              key={block}
              variant="outline"
              className="font-code"
              onClick={() => handleBlockClick(block)}
            >
              {block}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
