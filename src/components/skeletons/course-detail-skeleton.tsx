import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "../header";

export function CourseDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header title="Cargando curso..." showBackButton />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        {/* Main Course Info Card Skeleton */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 flex-shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>

        {/* Next Lesson Card Skeleton */}
        <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        {/* Course Content Section Skeleton */}
        <div>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-2 rounded-2xl border bg-card p-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl p-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
