
'use client';

import { Header } from '@/components/header';
import { courses } from '@/lib/data.tsx';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, FileQuestion } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

export default function CourseDetailPage() {
  const params = useParams();
  const { courseId } = params as { courseId: string };
  const course = courses.find((c) => c.id === courseId);

  // Use state to manage client-side randomness to avoid hydration errors
  const [moduleStatuses, setModuleStatuses] = useState<boolean[]>([]);

  useEffect(() => {
    if (course) {
      setModuleStatuses(course.modules.map(() => Math.random() > 0.5));
    }
  }, [course]);

  if (!course) {
    notFound();
  }

  // Find the first uncompleted module to link the "Continue" button
  const continueModule =
    course.modules.find((m) => m.id) || course.modules[0]; // Simple logic for now

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={course.title} showBackButton />
      <div className="relative h-48 w-full md:h-64">
        <Image
          src={course.image.imageUrl}
          alt={course.image.description}
          layout="fill"
          objectFit="cover"
          className="brightness-50"
          data-ai-hint={course.image.imageHint}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background to-transparent p-4 md:p-6">
          <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
            {course.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {course.description}
          </p>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Overall Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} />
          {continueModule && (
            <Button asChild className="mt-4 w-full" size="lg">
              <Link
                href={`/course/${course.id}/${continueModule.type}/${continueModule.contentId}`}
              >
                Continue
              </Link>
            </Button>
          )}
        </div>

        <h3 className="mb-4 text-xl font-bold">Modules</h3>
        <div className="space-y-2">
          {course.modules.map((module, index) => (
            <Link
              key={module.id}
              href={`/course/${course.id}/${module.type}/${module.contentId}`}
              className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {module.type === 'theory' ? (
                    <BookOpen className="h-5 w-5 text-primary" />
                  ) : (
                    <FileQuestion className="h-5 w-5 text-accent" />
                  )}
                  <span className="font-medium">{module.title}</span>
                </div>
                {moduleStatuses[index] && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
