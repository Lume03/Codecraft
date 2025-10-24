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

  const initialBlockOptions = blocks.map((text, index) => ({ text, id: index }));
  
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(numBlanks).fill(null));
  
  const [availableBlockIds, setAvailableBlockIds] = useState<number[]>(initialBlockOptions.map(opt => opt.id));

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(selectedAnswers.every(ans => ans !== null));
  }, [selectedAnswers]);

  const handleAvailableBlockClick = (blockId: number) => {
    const nextBlankIndex = selectedAnswers.indexOf(null);
    if (nextBlankIndex === -1) return;

    setSelectedAnswers(prev => {
      const copy = [...prev];
      copy[nextBlankIndex] = blockId;
      return copy;
    });

    setAvailableBlockIds(prev => prev.filter(id => id !== blockId));
  };

  const handleSelectedBlockClick = (selectedIndex: number) => {
    setSelectedAnswers(prev => {
      const copy = [...prev];
      const blockIdToReturn = copy[selectedIndex];
      if (blockIdToReturn === null) return prev;

      copy[selectedIndex] = null;
      setAvailableBlockIds(p => [...p, blockIdToReturn].sort((a, b) => a - b));
      return copy;
    });
  };

  const handleSubmit = () => {
    if (isComplete) {
      const answerText = selectedAnswers.map(id => initialBlockOptions.find(opt => opt.id === id)!.text);
      onAnswer(answerText);
    }
  };

  const renderCodeSnippet = () => {
    const parts = codeSnippet.split('___');

    return parts.flatMap((part, i) => {
      const out = [
        <span key={`part-${i}`}>{part}</span>
      ];

      if (i < parts.length - 1) {
        const selId = selectedAnswers[i];
        const selText = selId !== null
          ? initialBlockOptions.find(opt => opt.id === selId)?.text
          : '___';

        out.push(
          <Button
            key={`blank-${i}`}
            type="button"
            variant="secondary"
            className={cn(
              'mx-1 h-8 min-w-[6rem] px-3 font-code',
              selId !== null && 'bg-primary text-primary-foreground'
            )}
            onClick={() => handleSelectedBlockClick(i)}
          >
            {selText}
          </Button>
        );
      }

      return out;
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="min-h-[4rem] rounded-md bg-card p-4 font-code text-base flex items-center flex-wrap">
        {renderCodeSnippet()}
      </div>
      <div className="space-y-2 pt-4">
        <div className="flex flex-wrap gap-2">
          {availableBlockIds.map((id) => {
            const block = initialBlockOptions.find(opt => opt.id === id);
            return block ? (
              <Button
                key={block.id}
                variant="outline"
                className="font-code"
                onClick={() => handleAvailableBlockClick(block.id)}
              >
                {block.text}
              </Button>
            ) : null;
          })}
        </div>
      </div>
       <Button onClick={handleSubmit} className="w-full" disabled={!isComplete}>
        Confirmar respuesta
      </Button>
    </div>
  );
}
