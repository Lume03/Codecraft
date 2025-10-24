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

  // Use an object to track used indices of blocks for correct replacement
  const initialAvailableBlocks = blocks.map((block, index) => ({
    text: block,
    originalIndex: index,
  }));

  const [selectedAnswers, setSelectedAnswers] = useState<(typeof initialAvailableBlocks[0] | null)[]>(
    Array(numBlanks).fill(null)
  );
  const [availableBlocks, setAvailableBlocks] = useState(initialAvailableBlocks);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(selectedAnswers.every((ans) => ans !== null));
  }, [selectedAnswers]);

  const handleBlockClick = (block: typeof initialAvailableBlocks[0]) => {
    const nextBlankIndex = selectedAnswers.findIndex((ans) => ans === null);
    if (nextBlankIndex !== -1) {
      const newAnswers = [...selectedAnswers];
      newAnswers[nextBlankIndex] = block;
      setSelectedAnswers(newAnswers);
      setAvailableBlocks(availableBlocks.filter((b) => b.originalIndex !== block.originalIndex));
    }
  };

  const handleAnswerClick = (answer: typeof initialAvailableBlocks[0] | null, index: number) => {
    if (answer) {
      const newAnswers = [...selectedAnswers];
      newAnswers[index] = null;
      setSelectedAnswers(newAnswers);
      // Add the block back and sort it to keep a consistent order
      setAvailableBlocks(
        [...availableBlocks, answer].sort(
          (a, b) => a.originalIndex - b.originalIndex
        )
      );
    }
  };

  const handleSubmit = () => {
    if (isComplete) {
      onAnswer(selectedAnswers.map(ans => ans!.text));
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
              selectedAnswers[partIndex] && 'bg-primary text-primary-foreground'
            )}
            onClick={() =>
              handleAnswerClick(selectedAnswers[partIndex], partIndex)
            }
          >
            {selectedAnswers[partIndex]?.text || '___'}
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
              key={block.originalIndex}
              variant="outline"
              className="font-code"
              onClick={() => handleBlockClick(block)}
            >
              {block.text}
            </Button>
          ))}
        </div>
      </div>
       <Button onClick={handleSubmit} className="w-full" disabled={!isComplete}>
        Confirmar respuesta
      </Button>
    </div>
  );
}
