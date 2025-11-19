import { Skeleton } from './ui/skeleton';

export function SidebarNavSkeleton() {
  return (
    <div className="flex h-full flex-col p-4">
        {/* Logo */}
        <div className="flex h-20 items-center px-4">
             <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-6 w-24" />
            </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 space-y-4 px-4">
            {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-5 w-20" />
                </div>
            ))}
        </nav>

        {/* Bottom Navigation */}
         <div className="mt-auto flex flex-col p-4">
            <Skeleton className="h-px w-full mb-4" />
             <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-5 w-20" />
            </div>
        </div>
    </div>
  );
}
