'use client';

import { CourseCard } from '@/components/course-card';
import { Header } from '@/components/header';
import type { Course, Module } from '@/lib/data';
import { PlusCircle, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { LivesIndicator } from '@/components/lives-indicator';
import { recalculateLives, MAX_LIVES } from '@/lib/lives';
import { Button } from '@/components/ui/button';

interface CourseWithProgress extends Course {
  progress: number;
}

export default function LearnPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemo(() => {
    if (user && firestore) {
      return doc(firestore, `users/${user.uid}`);
    }
    return null;
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userProfileRef);
  
  const [currentLives, setCurrentLives] = useState(MAX_LIVES);
  const [lastLifeUpdate, setLastLifeUpdate] = useState<Date | null>(new Date());

  useEffect(() => {
    if(userProfile) {
      const recalculated = recalculateLives(userProfile);
      setCurrentLives(recalculated.lives);
      setLastLifeUpdate(recalculated.lastLifeUpdate);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchCoursesAndProgress = async () => {
      try {
        setLoading(true);
        const coursesRes = await fetch('/api/courses');
        if (!coursesRes.ok) {
          throw new Error('Failed to fetch courses');
        }
        const coursesData: Course[] = await coursesRes.json();

        if (userProfile && coursesData.length > 0) {
           const coursesWithProgress = await Promise.all(coursesData.map(async (course) => {
            const modulesRes = await fetch(`/api/courses/${course.id}/modules`);
            if (!modulesRes.ok) return { ...course, progress: 0 };
            
            const modules: Module[] = await modulesRes.json();
            const totalLessons = modules.length;
            const completedLessons = userProfile.progress?.[course.id]?.completedLessons?.length ?? 0;
            
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return { ...course, progress: progress || 0 };
          }));
          setCourses(coursesWithProgress);
        } else {
            setCourses(coursesData.map(c => ({...c, progress: 0})));
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch courses when component mounts, and re-fetch if user profile changes
    fetchCoursesAndProgress();

  }, [userProfile]);

  return (
    <div>
      <Header
        title="Aprender"
        action={
          <div className="flex items-center gap-2">
            <LivesIndicator lives={currentLives} lastLifeUpdate={lastLifeUpdate} />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Ajustes</span>
              </Link>
            </Button>
          </div>
        }
      />
      <div className="container space-y-4 px-4 py-6 md:px-6">
        {loading && <p>Cargando cursos...</p>}
        {!loading && courses.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>No hay cursos disponibles.</p>
            <p>
              Ve al{' '}
              <Link href="/admin" className="text-primary underline">
                panel de administrador
              </Link>{' '}
              para agregar uno.
            </p>
          </div>
        )}
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
