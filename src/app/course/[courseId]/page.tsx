'use client';

import { Header } from '@/components/header';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Code,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { placeholderImages } from '@/lib/placeholder-images';
import { Course, Module } from '@/lib/data';
import { PythonIcon, JavaScriptIcon, CppIcon } from '@/lib/data';

const iconMap: { [key: string]: React.ElementType } = {
  PythonIcon,
  JavaScriptIcon,
  CppIcon,
};


export default function CourseDetailPage() {
  const params = useParams();
  const { courseId } = params as { courseId: string };
  const firestore = useFirestore();

  const courseRef = useMemo(() => firestore ? doc(firestore, `courses/${courseId}`) : null, [firestore, courseId]);
  const { data: course, loading: courseLoading } = useDoc<Course>(courseRef);

  const modulesQuery = useMemo(() => 
    firestore ? query(collection(firestore, `courses/${courseId}/modules`), orderBy('order')) : null, 
    [firestore, courseId]
  );
  const { data: modules, loading: modulesLoading } = useCollection<Module>(modulesQuery);

  const [moduleStatuses, setModuleStatuses] = useState<
    ('completed' | 'in_progress' | 'locked')[]
  >([]);

  useEffect(() => {
    if (modules) {
      // Simulate status: first is completed, second is in progress, rest are locked
      const statuses: ('completed' | 'in_progress' | 'locked')[] = modules.map((_, index) => {
        if (index === 0) return 'completed';
        if (index === 1) return 'in_progress';
        return 'locked';
      });
      setModuleStatuses(statuses);
    }
  }, [modules]);

  if (courseLoading || modulesLoading) {
    return <div>Cargando...</div>;
  }

  if (!course) {
    notFound();
  }

  const courseImage = placeholderImages.find(p => p.id === course.imageId);
  const lessonsCompleted = moduleStatuses.filter(s => s === 'completed').length;
  const totalLessons = modules?.length ?? 0;
  const progressPercentage = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;
  
  const currentLessonIndex = moduleStatuses.findIndex(s => s === 'in_progress');
  const nextLesson = (modules && currentLessonIndex !== -1) ? modules[currentLessonIndex] : (modules?.[0] ?? null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header title={course.title} showBackButton />

      <main className="flex-1 space-y-6 p-4 pb-28 md:p-6">
        {/* Main Course Info Card */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-start gap-4">
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
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{course.title}</h2>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                  Curso
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {course.description}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {lessonsCompleted} {lessonsCompleted === 1 ? 'lección completada' : 'lecciones completadas'}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{totalLessons} lecciones · 2 proyectos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Lesson Card */}
        {nextLesson && (
          <div className="flex items-center justify-between rounded-2xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <Code className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Siguiente: {nextLesson.title}</p>
                <p className="text-sm font-semibold">Lección {currentLessonIndex + 1} · {nextLesson.duration} min</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/course/${courseId}/${nextLesson.type}/${nextLesson.contentId}`}>
                Revisar
              </Link>
            </Button>
          </div>
        )}

        {/* Course Content Section */}
        <div>
          <h3 className="mb-4 text-xl font-bold">Contenido del curso</h3>
          <div className="space-y-2 rounded-2xl border bg-card p-2">
            {modules?.map((module, index) => {
              const status = moduleStatuses[index];
              return (
                <Link
                  key={module.id}
                  href={`/course/${courseId}/${module.type}/${module.contentId}`}
                  className={cn(
                    'block rounded-xl p-4 transition-colors',
                    status !== 'locked' ? 'hover:bg-secondary' : 'opacity-60 pointer-events-none'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                          status === 'completed' && 'bg-yellow-400 text-black',
                          status === 'in_progress' && 'bg-indigo-500 text-white',
                          status === 'locked' && 'bg-secondary text-muted-foreground'
                        )}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{module.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {module.duration} min ·{' '}
                          {status === 'completed' && 'Completado'}
                          {status === 'in_progress' && 'En curso'}
                          {status === 'locked' && 'Bloqueado'}
                        </p>
                      </div>
                    </div>
                    {status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      
      {nextLesson && (
         <div className="fixed bottom-0 inset-x-0 z-10 border-t bg-background/80 p-4 backdrop-blur-sm pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Button size="lg" className="w-full" asChild style={{ borderRadius: '9999px', boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)' }}>
                <Link href={`/course/${courseId}/${nextLesson.type}/${nextLesson.contentId}`}>
                    Comenzar Lección {currentLessonIndex + 1}
                </Link>
            </Button>
         </div>
      )}
    </div>
  );
}
