'use client';

import { Header } from '@/components/header';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, Clock, Code, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { placeholderImages } from '@/lib/placeholder-images';
import type { Course, Module } from '@/lib/data';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';

export default function CourseDetailPage() {
  const params = useParams();
  const { courseId } = params as { courseId: string };
  
  const user = useUser();
  const firestore = useFirestore();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const userProfileRef = useMemo(() => {
    if (user && firestore) {
      return doc(firestore, `users/${user.uid}`);
    }
    return null;
  }, [user, firestore]) as DocumentReference | null;

  const { data: userProfile } = useDoc(userProfileRef);

  useEffect(() => {
    async function fetchData() {
      if (!courseId) return;
      setLoading(true);
      try {
        const courseRes = await fetch(`/api/courses?id=${courseId}`);
        if (!courseRes.ok) throw new Error('Failed to fetch course');
        const courseData = await courseRes.json();
        setCourse(courseData);

        const modulesRes = await fetch(`/api/courses/${courseId}/modules`);
        if (!modulesRes.ok) throw new Error('Failed to fetch modules');
        const modulesData = await modulesRes.json();
        setModules(modulesData);

      } catch (error) {
        console.error(error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  const courseImage = course ? placeholderImages.find((p) => p.id === course.imageId) : null;
  
  const completedLessons = userProfile?.progress?.[courseId]?.completedLessons ?? [];
  const unlockedLessons = userProfile?.progress?.[courseId]?.unlockedLessons ?? [];
  const totalLessons = modules.length;
  
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  // Find first unlocked lesson that is not completed
   const nextLesson = useMemo(() => {
    if (!modules || modules.length === 0) return null;

    const firstUnlockedId = modules[0]?.id;
    const isFirstUnlockedByDefault = !unlockedLessons.includes(firstUnlockedId);

    // Find the first lesson that is unlocked but not completed
    for (const module of modules) {
      const isUnlocked = unlockedLessons.includes(module.id) || (isFirstUnlockedByDefault && module.id === firstUnlockedId);
      const isCompleted = completedLessons.includes(module.id);
      if (isUnlocked && !isCompleted) {
        return module;
      }
    }
    
    // If all unlocked are completed, maybe return the next in line if it exists
    // Or just return null if course is finished.
    const lastCompletedIndex = modules.findIndex(m => m.id === completedLessons[completedLessons.length - 1]);
    if (lastCompletedIndex > -1 && lastCompletedIndex + 1 < modules.length) {
      return modules[lastCompletedIndex + 1];
    }
    
    return isFirstUnlockedByDefault ? modules[0] : null;

  }, [modules, completedLessons, unlockedLessons]);

  const currentLessonIndex = nextLesson ? modules.findIndex(m => m.id === nextLesson.id) : -1;

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!course) {
    notFound();
  }

  const isFirstLessonUnlocked = modules.length > 0 && (unlockedLessons.length === 0 || unlockedLessons.includes(modules[0].id));

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
                {completedLessons.length}{' '}
                {completedLessons.length === 1
                  ? 'lección completada'
                  : 'lecciones completadas'}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{totalLessons} lecciones · 0 proyectos</span>
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
                <p className="text-sm text-muted-foreground">
                  Siguiente: {nextLesson.title}
                </p>
                <p className="text-sm font-semibold">
                  Lección {currentLessonIndex + 1} · {nextLesson.duration} min
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/course/${courseId}/theory/${nextLesson.contentId}?lessonId=${nextLesson.id}`}
              >
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
              const isCompleted = completedLessons.includes(module.id);
              // The first lesson is unlocked by default if no lessons are unlocked yet.
              const isUnlocked = index === 0 ? isFirstLessonUnlocked : unlockedLessons.includes(module.id);
              
              const status = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';

              return (
                <Link
                  key={module.id}
                  href={isUnlocked ? `/course/${courseId}/theory/${module.contentId}?lessonId=${module.id}` : '#'}
                  className={cn(
                    'block rounded-xl p-4 transition-colors',
                    isUnlocked
                      ? 'hover:bg-secondary'
                      : 'pointer-events-none opacity-60'
                  )}
                  aria-disabled={!isUnlocked}
                  tabIndex={isUnlocked ? 0 : -1}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                          status === 'completed' && 'bg-yellow-400 text-black',
                          status === 'unlocked' && 'bg-indigo-500 text-white',
                          status === 'locked' &&
                            'bg-secondary text-muted-foreground'
                        )}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{module.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {module.duration} min ·{' '}
                          {status === 'completed' && 'Completado'}
                          {status === 'unlocked' && 'En curso'}
                          {status === 'locked' && 'Bloqueado'}
                        </p>
                      </div>
                    </div>
                     {status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : status === 'unlocked' ? (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {nextLesson && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/80 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
          <Button
            size="lg"
            className="w-full"
            asChild
            style={{
              borderRadius: '9999px',
              boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)',
            }}
          >
            <Link
              href={`/course/${courseId}/theory/${nextLesson.contentId}?lessonId=${nextLesson.id}`}
            >
              Comenzar Lección {currentLessonIndex + 1}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
