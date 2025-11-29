'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from './ui/skeleton';

const FooterNavItems = dynamic(() => import('./footer-nav-items'), {
  ssr: false,
});

export function FooterNav() {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-20 h-16 border-t border-border bg-card/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] md:hidden">
      <Suspense fallback={<FooterNavSkeleton />}>
        <FooterNavItems />
      </Suspense>
    </footer>
  );
}

function FooterNavSkeleton() {
  return (
    <nav className="mx-auto grid h-full max-w-md grid-cols-3 items-center gap-2 px-2" aria-label="Cargando navegación principal">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center gap-1 p-2">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-3 w-10 rounded-md" />
        </div>
      ))}
    </nav>
  );
}
