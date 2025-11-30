import { Skeleton } from "@/components/ui/skeleton";

export function ListSkeleton({ count = 3, itemHeight = 'h-10' }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`w-full ${itemHeight} rounded-lg`} />
      ))}
    </div>
  );
}
