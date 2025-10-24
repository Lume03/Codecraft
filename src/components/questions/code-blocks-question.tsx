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

  // Each available block option is an object with its text and original index
  const initialBlockOptions = blocks.map((text, index) => ({ text, id: index }));
  
  // selectedAnswers stores the `id` of the block from `initialBlockOptions`, or null if empty
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(numBlanks).fill(null));
  
  // availableBlockIds stores the `id`s of blocks that haven't been selected yet
  const [availableBlockIds, setAvailableBlockIds] = useState<number[]>(initialBlockOptions.map(opt => opt.id));

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(selectedAnswers.every(ans => ans !== null));
  }, [selectedAnswers]);


  const handleAvailableBlockClick = (blockId: number) => {
    const nextBlankIndex = selectedAnswers.indexOf(null);
    if (nextBlankIndex !== -1) {
      // Place block in the first available answer slot
      const newSelected = [...selectedAnswers];
      newSelected[nextBlankIndex] = blockId;
      setSelectedAnswers(newSelected);
      
      // Remove block from available list
      setAvailableBlockIds(availableBlockIds.filter(id => id !== blockId));
    }
  };

  const handleSelectedBlockClick = (selectedIndex: number) => {
    const blockIdToReturn = selectedAnswers[selectedIndex];
    if (blockIdToReturn !== null) {
      // Clear the answer slot
      const newSelected = [...selectedAnswers];
      newSelected[selectedIndex] = null;
      setSelectedAnswers(newSelected);

      // Add block back to available list and sort it
      setAvailableBlockIds(prev => [...prev, blockIdToReturn].sort((a,b) => a - b));
    }
  };

  const handleSubmit = () => {
    if (isComplete) {
      const answerText = selectedAnswers.map(id => initialBlockOptions.find(opt => opt.id === id)!.text);
      onAnswer(answerText);
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
              selectedAnswers[partIndex] !== null && 'bg-primary text-primary-foreground'
            )}
            onClick={() => handleSelectedBlockClick(partIndex)}
          >
            {selectedAnswers[partIndex] !== null
              ? initialBlockOptions.find(opt => opt.id === selectedAnswers[partIndex])?.text
              : '___'
            }
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
