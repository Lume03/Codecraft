'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, Infinity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_LIVES, REFILL_MINUTES } from '@/lib/lives';
import { useTranslation } from '@/context/language-provider';

interface LivesIndicatorProps {
  lives: number;
  lastLifeUpdate: Date | string | null;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function LivesIndicator({ lives: initialLives, lastLifeUpdate }: LivesIndicatorProps) {
  const [currentLives, setCurrentLives] = useState(initialLives);
  const [countdown, setCountdown] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    // Sincroniza el estado local con las props cuando cambian (ej. al cargar datos de Firestore)
    setCurrentLives(initialLives);
  }, [initialLives]);

  useEffect(() => {
    if (currentLives >= MAX_LIVES || !lastLifeUpdate) {
      setCountdown(0);
      return;
    }

    const calculateInitialCountdown = () => {
        const lastUpdate = new Date(lastLifeUpdate);
        const now = new Date();
        const diffMs = now.getTime() - lastUpdate.getTime();
        const timePerLifeMs = REFILL_MINUTES * 60 * 1000;
        const remainderMs = diffMs % timePerLifeMs;
        const timeLeftMs = timePerLifeMs - remainderMs;
        return Math.max(0, Math.floor(timeLeftMs / 1000));
    };

    const initialCountdown = calculateInitialCountdown();
    setCountdown(initialCountdown);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Cuando el contador llega a 0, se añade una vida visualmente
          setCurrentLives((current) => Math.min(MAX_LIVES, current + 1));
          // Y se reinicia el contador para la siguiente vida
          return REFILL_MINUTES * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentLives, lastLifeUpdate]);

  const isFull = currentLives >= MAX_LIVES;
  const isInfinite = initialLives === Infinity;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold',
            isInfinite ? 'text-blue-500' : isFull ? 'text-red-500' : 'text-red-500'
          )}
        >
          <Heart className="h-5 w-5 fill-current" />
          {isInfinite ? <Infinity className="h-5 w-5" /> : <span>{currentLives}</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-center">
        <div className="space-y-2">
          <p className="font-bold">{isFull ? t('lives_full_title') : t('lives')}</p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart
                key={i}
                className={cn('h-6 w-6', i < currentLives ? 'fill-red-500 text-red-500' : 'fill-muted text-muted-foreground')}
              />
            ))}
          </div>
          {isFull ? (
             <p className="text-sm text-muted-foreground">{t('lives_full_subtitle')}</p>
          ) : (
            <div>
                 <p className="text-sm text-muted-foreground">{t('lives_recharge_message')}</p>
                 <p className="text-lg font-bold">{formatTime(countdown)}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
