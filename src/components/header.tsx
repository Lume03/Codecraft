'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  action,
  className,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        'flex items-center justify-between',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Volver</span>
          </Button>
        )}
        <div>
           <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
           {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div>{action}</div>
    </header>
  );
}
