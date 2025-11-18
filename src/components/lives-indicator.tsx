
'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, Infinity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_LIVES, REFILL_MINUTES } from '@/lib/lives';

interface LivesIndicatorProps {
  lives: number;
  lastLifeUpdate: Date | string | null;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function LivesIndicator({ lives, lastLifeUpdate }: LivesIndicatorProps) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (lives >= MAX_LIVES || !lastLifeUpdate) {
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
          // When timer hits 0, it doesn't automatically grant a life.
          // It just resets to the full duration for the next cycle.
          // The actual life is granted on the next server-side recalculation.
          return REFILL_MINUTES * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lives, lastLifeUpdate]);

  const isFull = lives >= MAX_LIVES;
  const isInfinite = lives === Infinity;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold',
            isInfinite ? 'text-blue-500' : 'text-red-500'
          )}
        >
          <Heart className="h-5 w-5 fill-current" />
          {isInfinite ? <Infinity className="h-5 w-5" /> : <span>{lives}</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-center">
        <div className="space-y-2">
          <p className="font-bold">{isFull ? '¡Tienes todas tus vidas!' : 'Vidas'}</p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart
                key={i}
                className={cn('h-6 w-6', i < lives ? 'fill-red-500 text-red-500' : 'fill-muted text-muted-foreground')}
              />
            ))}
          </div>
          {isFull ? (
             <p className="text-sm text-muted-foreground">¡Estás listo para aprender sin parar!</p>
          ) : (
            <div>
                 <p className="text-sm text-muted-foreground">Recuperarás una vida en:</p>
                 <p className="text-lg font-bold">{formatTime(countdown)}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
