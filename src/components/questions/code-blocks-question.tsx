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

  // Genera IDs únicos y estables por texto+índice
  const initialBlockOptions = blocks.map((text, index) => ({
    text,
    id: `${text}-${index}`,
  }));

  // selectedAnswers guarda el id de cada bloque colocado o null si vacío
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    Array(numBlanks).fill(null)
  );

  // availableBlockIds guarda ids disponibles (no colocados)
  const [availableBlockIds, setAvailableBlockIds] = useState<string[]>(
    initialBlockOptions.map((opt) => opt.id)
  );

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(selectedAnswers.every((ans) => ans !== null));
  }, [selectedAnswers]);

  const handleAvailableBlockClick = (blockId: string) => {
    const nextBlankIndex = selectedAnswers.indexOf(null);
    if (nextBlankIndex === -1) return;

    // Coloca el bloque en el primer hueco libre
    setSelectedAnswers((prev) => {
      const copy = [...prev];
      copy[nextBlankIndex] = blockId;
      return copy;
    });

    // Quita el bloque de la lista de disponibles
    setAvailableBlockIds((prev) => prev.filter((id) => id !== blockId));
  };

  const handleSelectedBlockClick = (selectedIndex: number) => {
    setSelectedAnswers((prev) => {
      const copy = [...prev];
      const blockIdToReturn = copy[selectedIndex];

      // Si ya está vacío, nada que hacer
      if (blockIdToReturn === null) return prev;

      // Vaciar hueco
      copy[selectedIndex] = null;

      // Devolver el bloque a disponibles SIN duplicar
      setAvailableBlockIds((prevAvail) => {
        const s = new Set(prevAvail);
        s.add(blockIdToReturn);
        return Array.from(s).sort(); // orden opcional alfabético/estable
      });

      return copy;
    });
  };

  const handleSubmit = () => {
    if (!isComplete) return;
    const answerText = selectedAnswers.map((id) => {
      const opt = initialBlockOptions.find((o) => o.id === id);
      return opt ? opt.text : '';
    });
    onAnswer(answerText);
  };

  const renderCodeSnippet = () => {
    const parts = codeSnippet.split('___');

    return parts.flatMap((part, i) => {
      const out = [<span key={`part-${i}`}>{part}</span>];

      if (i < parts.length - 1) {
        const selId = selectedAnswers[i];
        const selText =
          selId !== null
            ? initialBlockOptions.find((opt) => opt.id === selId)?.text ?? '___'
            : '___';

        out.push(
          <Button
            key={`blank-${i}`}
            type="button"
            variant="secondary"
            disabled={selId === null} // evita clics cuando el hueco está vacío
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
            const block = initialBlockOptions.find((opt) => opt.id === id);
            return block ? (
              <Button
                key={block.id}
                type="button"
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

      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full"
        disabled={!isComplete}
      >
        Confirmar respuesta
      </Button>
    </div>
  );
}
