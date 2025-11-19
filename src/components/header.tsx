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
  backButtonHref?: string;
  action?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  subtitle,
  showBackButton = false,
  backButtonHref,
  action,
  className,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
  };
  
  if (showBackButton) {
    const BackButton = () => (
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={!backButtonHref ? handleBack : undefined}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Volver</span>
        </Button>
      );
    return (
        <header
            className={cn(
                'sticky top-0 z-10 flex h-16 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm md:h-20 md:px-6',
                className
            )}
        >
            <div className="flex flex-1 items-center gap-4 overflow-hidden">
                {backButtonHref ? (
                    <Link href={backButtonHref} passHref>
                        <BackButton />
                    </Link>
                ) : (
                    <BackButton />
                )}
                <div className="flex-1 overflow-hidden">
                <h1 className="truncate text-lg font-bold tracking-tight md:text-2xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="truncate text-base text-muted-foreground">
                    {subtitle}
                    </p>
                )}
                </div>
            </div>
            <div className="pl-4">{action}</div>
        </header>
    )
  }

  return (
    <div className={cn('flex items-start justify-between p-4 md:p-8', className)}>
      <div className="flex-1 overflow-hidden">
        <h1 className="truncate text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 truncate text-base text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <div className="pl-4">{action}</div>
    </div>
  );
}
