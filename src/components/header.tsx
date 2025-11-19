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

  const BackButton = () => (
    <Button
      variant="outline"
      size="icon"
      className="h-11 w-11 shrink-0"
      onClick={handleBack}
    >
      <ChevronLeft className="h-6 w-6" />
      <span className="sr-only">Volver</span>
    </Button>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:h-20 md:px-6',
        className
      )}
    >
      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        {showBackButton &&
          (backButtonHref ? (
            <Link href={backButtonHref} legacyBehavior>
              <a>
                <BackButton />
              </a>
            </Link>
          ) : (
            <BackButton />
          ))}
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
  );
}