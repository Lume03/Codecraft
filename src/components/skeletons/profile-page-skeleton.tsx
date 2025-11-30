import {
  Flame,
  Moon,
  Languages,
  Bell,
  Trophy,
  BarChart,
  Check,
  BrainCircuit,
  Settings,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatCardSkeleton = () => (
    <Card className="flex items-center gap-4 p-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
    </Card>
);

export function ProfilePageSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
       <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm md:h-16 md:px-6">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-end md:max-w-[720px] xl:max-w-[960px]">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[420px] flex-1 space-y-8 px-4 pb-28 md:max-w-[720px] md:space-y-10 md:px-6 md:pb-8">
        {/* Profile Header Skeleton */}
        <section className="flex items-center gap-4 pt-4 md:gap-5">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-4 pt-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </section>

        {/* Quick Actions Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        {/* Stats Dashboard Skeleton */}
        <section>
          <Skeleton className="h-4 w-32" />
          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
          </div>
        </section>
        
        {/* Course Progress Card Skeleton */}
        <Card>
            <CardContent className="p-4 md:p-5">
              <Skeleton className="h-4 w-36 mb-3" />
              <div className="space-y-2">
                  <div className="flex justify-between">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-2 w-full" />
              </div>
            </CardContent>
        </Card>
        
        {/* Goals and Achievements Skeleton */}
        <section className="space-y-4">
           <Skeleton className="h-4 w-40" />
           <div className="space-y-3 rounded-2xl border bg-card p-2">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2">
                   <Skeleton className="h-10 w-10 rounded-full" />
                   <div className="w-full flex-1 space-y-2">
                     <Skeleton className="h-4 w-3/4" />
                     <Skeleton className="h-1.5 w-full" />
                   </div>
                </div>
             ))}
           </div>
           <div className="space-y-4">
              <div className="flex flex-wrap gap-2 md:gap-3">
                 <Skeleton className="h-8 w-28 rounded-full" />
                 <Skeleton className="h-8 w-32 rounded-full" />
              </div>
              <Skeleton className="h-11 w-full rounded-full" />
           </div>
        </section>
      </main>
    </div>
  );
}
