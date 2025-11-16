import Image from 'next/image';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import type { Course } from '@/lib/data.tsx';
import { cn } from '@/lib/utils';
import { placeholderImages } from '@/lib/placeholder-images';

interface CourseWithProgress extends Course {
  progress: number;
}

export function CourseCard({ course }: { course: CourseWithProgress }) {
  const accentVariants = {
    'py-101': {
      ring: 'group-hover:ring-green-400/50 group-focus-visible:ring-green-400/50',
      progress: '[&>div]:bg-green-400',
    },
    'js-101': {
      ring: 'group-hover:ring-yellow-400/50 group-focus-visible:ring-yellow-400/50',
      progress: '[&>div]:bg-yellow-400',
    },
    'cpp-101': {
      ring: 'group-hover:ring-blue-400/50 group-focus-visible:ring-blue-400/50',
      progress: '[&>div]:bg-blue-400',
    },
  };
  
  // A simple way to get a course ID for styling if it doesn't match the predefined ones
  // This is just a placeholder logic for styling and might need adjustment based on real course IDs
  const courseStyleId = course.id.includes('js') ? 'js-101' : course.id.includes('py') ? 'py-101' : 'cpp-101';
  
  const accent = accentVariants[courseStyleId as keyof typeof accentVariants] ?? {};
    
  const courseImage = placeholderImages.find(p => p.id === course.imageId);

  const progress = course.progress ?? 0;

  return (
    <Link
      href={`/course/${course.id}`}
      className="group block"
      aria-label={`Abrir curso: ${course.title}`}
    >
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'rounded-2xl border border-border/50 bg-card p-4 text-foreground transition-all duration-200 ease-in-out',
          'group-hover:scale-[1.02] group-hover:shadow-lg group-focus-visible:scale-[1.02] group-focus-visible:shadow-lg group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-primary/80',
          accent.ring
        )}
      >
        <div className="flex items-center gap-4">
          {courseImage && (
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-card-foreground/5 p-1">
                <Image
                  src={courseImage.imageUrl}
                  alt={courseImage.description}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                  data-ai-hint={courseImage.imageHint}
                />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <h3 className="line-clamp-1 text-lg font-semibold leading-tight tracking-tight">
              {course.title}
            </h3>
            <p className="min-h-[2.5rem] line-clamp-2 pt-1 text-sm text-muted-foreground">
              {course.description}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Progress
            value={progress}
            className={cn('h-2 flex-1', accent.progress)}
          />
          <span className="text-sm font-semibold text-muted-foreground">
            {progress}%
          </span>
        </div>
      </div>
    </Link>
  );
}
