'use client';

import type { Question } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
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

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array(numBlanks).fill('')
  );
  const [availableBlocks, setAvailableBlocks] = useState<string[]>(blocks);

  const handleBlockClick = (block: string) => {
    const nextBlankIndex = selectedAnswers.findIndex((ans) => ans === '');
    if (nextBlankIndex !== -1) {
      const newAnswers = [...selectedAnswers];
      newAnswers[nextBlankIndex] = block;
      setSelectedAnswers(newAnswers);
      setAvailableBlocks(availableBlocks.filter((b) => b !== block));
    }
  };

  const handleAnswerClick = (answer: string, index: number) => {
    if (answer) {
      const newAnswers = [...selectedAnswers];
      newAnswers[index] = '';
      setSelectedAnswers(newAnswers);
      setAvailableBlocks([...availableBlocks, answer]);
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
              'mx-1 h-8 px-3 font-code',
              !selectedAnswers[partIndex] && 'w-20'
            )}
            onClick={() => handleAnswerClick(selectedAnswers[partIndex], partIndex)}
          >
            {selectedAnswers[partIndex] || '___'}
          </Button>
        )}
        {(partIndex = i + 1)}
      </span>
    ));
  };
  
  const handleSubmit = () => {
    if(selectedAnswers.every(ans => ans !== '')) {
      onAnswer(selectedAnswers);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-card p-4 font-code text-sm">
        {renderCodeSnippet()}
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Available blocks:</p>
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
      <Button onClick={handleSubmit} disabled={selectedAnswers.some(ans => ans === '')} className="w-full">
        Check Answer
      </Button>
    </div>
  );
}
