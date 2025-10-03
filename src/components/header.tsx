'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  showBackButton = false,
  action,
  className,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div>{action}</div>
    </header>
  );
}
