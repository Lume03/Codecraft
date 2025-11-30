import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <div className='flex flex-col rounded-2xl border bg-card p-4'>
        <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
            </div>
        </div>
        <div className="mt-4 flex flex-1 flex-col justify-end space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-12" />
            </div>
        </div>
    </div>
  );
}
