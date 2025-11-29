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
      progress: '[&>div]:bg-green-400',
    },
    'js-101': {
      progress: '[&>div]:bg-yellow-400',
    },
    'cpp-101': {
      progress: '[&>div]:bg-blue-400',
    },
  };
  
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
      <article
        role="button"
        tabIndex={0}
        aria-label={`Curso: ${course.title}, Progreso: ${progress}%`}
        className='card-gamified flex h-full flex-col rounded-2xl bg-card p-4 text-foreground'
      >
        <div className="flex items-center gap-4">
          {courseImage && (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-card-foreground/5 p-2">
                <Image
                  src={courseImage.imageUrl}
                  alt={courseImage.description}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                  data-ai-hint={courseImage.imageHint}
                />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <h3 className="text-lg font-bold leading-tight tracking-tight">
              {course.title}
            </h3>
          </div>
        </div>
        <div className="mt-4 flex flex-1 flex-col justify-end">
            <p className="min-h-[2.5rem] line-clamp-2 pt-1 text-sm text-muted-foreground">
              {course.description}
            </p>
            <div className="mt-4 flex items-center gap-3">
                <Progress
                    value={progress}
                    className={cn('h-3 flex-1', accent.progress)}
                    aria-label={`Progreso: ${progress}%`}
                />
                <span className="text-sm font-semibold text-muted-foreground" aria-hidden="true">
                    {progress}%
                </span>
            </div>
        </div>
      </article>
    </Link>
  );
}
