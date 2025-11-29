'use client';

import { CourseCard } from '@/components/course-card';
import { Header } from '@/components/header';
import type { Course, Module } from '@/lib/data';
import { Settings, Flame } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { LivesIndicator } from '@/components/lives-indicator';
import { recalculateLives, MAX_LIVES } from '@/lib/lives';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/language-provider';

interface CourseWithProgress extends Course {
  progress: number;
}

const StatChip = ({
  icon: Icon,
  value,
  isFlame,
}: {
  icon: React.ElementType;
  value: string | number;
  isFlame?: boolean;
}) => (
  <div className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-card px-3 text-[13px] text-foreground">
    <Icon className={cn(
        "h-4 w-4",
        isFlame && (value > 0 ? "text-orange-500" : "text-muted-foreground")
    )} />
    <span>{value}</span>
  </div>
);

export default function LearnPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  
  const user = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemo(() => {
    if (user && firestore) {
      return doc(firestore, `users/${user.uid}`);
    }
    return null;
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userProfileRef);
  
  const [currentLives, setCurrentLives] = useState(0);
  const [lastLifeUpdate, setLastLifeUpdate] = useState<Date | null>(new Date());
  
  const streak = userProfile?.streak ?? 0;
  const displayName = userProfile?.displayName ?? user?.displayName ?? 'Aprende';

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
            
            const completedLessonsArray = userProfile.progress?.[course.id]?.completedLessons;
            const completedLessons = Array.isArray(completedLessonsArray) ? completedLessonsArray.length : 0;
            
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
    
    fetchCoursesAndProgress();

  }, [userProfile]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-4 md:p-8">
      <Header
        title={t('hello_user', { name: displayName.split(' ')[0] })}
        subtitle={streak > 0 ? t('streak_on_fire', { days: streak }) : t('great_day_to_learn')}
        action={
          <div className="flex items-center gap-2">
            <StatChip icon={Flame} value={streak} isFlame />
            <LivesIndicator lives={currentLives} lastLifeUpdate={lastLifeUpdate} />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-6 w-6" />
                <span className="sr-only">{t('settings')}</span>
              </Link>
            </Button>
          </div>
        }
      />
      <div>
        <h2 className="mb-4 text-2xl font-bold text-foreground">{t('courses')}</h2>
        {loading && <p>{t('loading_courses')}</p>}
        {!loading && courses.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>{t('no_courses_available')}</p>
            <p>
              {t('go_to_admin_panel').split('para')[0]}
              <Link href="/admin" className="text-primary underline">
                panel de administrador
              </Link>{' '}
              {t('go_to_admin_panel').split('para')[1]}
            </p>
          </div>
        )}
         <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
        </div>
      </div>
    </div>
  );
}
