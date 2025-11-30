'use client';

import { CourseCard } from '@/components/course-card';
import { Header } from '@/components/header';
import type { Course, Module } from '@/lib/data';
import { Flame } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useUser } from '@/firebase';
import { LivesIndicator } from '@/components/lives-indicator';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/docs/backend-types';
import { useTranslation } from '@/context/language-provider';
import { FooterNav } from '@/components/footer-nav';

interface CourseWithProgress extends Course {
  progress: number;
}

const StatChip = ({
  icon: Icon,
  value,
  label,
  isFlame,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  isFlame?: boolean;
}) => (
  <div
    className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-card px-3 text-[13px] text-foreground"
    role="status"
    aria-label={label}
  >
    <Icon
      className={cn(
        'h-4 w-4',
        isFlame && (Number(value) > 0 ? 'text-orange-500' : 'text-muted-foreground')
      )}
      aria-hidden="true"
    />
    <span>{value}</span>
  </div>
);


export default function LearnPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { t } = useTranslation();

  const currentLives = userProfile?.lives ?? 0;
  const lastLifeUpdate = userProfile?.lastLifeUpdate ? new Date(userProfile.lastLifeUpdate) : new Date();
  
  const streak = userProfile?.streak ?? 0;
  const displayName = userProfile?.displayName ?? user?.displayName ?? 'Aprende';

  useEffect(() => {
    if (user?.uid) {
      const fetchUserProfile = async () => {
        try {
          const res = await fetch(`/api/users?firebaseUid=${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
          } else if (res.status === 404) {
            // If user not found in DB, create them
            const postRes = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                firebaseUid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              }),
            });
            if (postRes.ok) {
              const newUserProfile = await postRes.json();
              setUserProfile(newUserProfile);
            } else {
               console.error("Failed to create user profile");
               setUserProfile(null);
            }
          } else {
            console.error("Failed to fetch user profile");
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        }
      };
      fetchUserProfile();
    }
  }, [user]);

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
  
  const welcomeMessage = t('hello_user', { name: displayName.split(' ')[0] });
  const streakMessage = streak > 0 ? t('streak_on_fire', {days: streak}) : t('great_day_to_learn');

  return (
    <>
      <div className="flex-1 pb-28 md:pb-0">
        <div className="mx-auto w-full max-w-5xl space-y-8 p-4 md:p-8">
          <Header
            title={welcomeMessage}
            subtitle={streakMessage}
            action={
              <div className="flex items-center gap-2">
                <StatChip
                  icon={Flame}
                  value={streak}
                  label={t('days_streak_label', { count: streak })}
                  isFlame
                />
                <LivesIndicator lives={currentLives} lastLifeUpdate={lastLifeUpdate} />
              </div>
            }
          />
          <div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">{t('courses')}</h2>
            {loading && <p aria-live="polite">{t('loading_courses')}</p>}
            {!loading && courses.length === 0 && (
              <div className="text-center text-muted-foreground" aria-live="polite">
                <p>{t('no_courses_available')}</p>
                <p>
                  {t('go_to_admin_panel_pre')}{' '}
                  <Link href="/admin" className="text-primary underline">
                    {t('admin_panel_link')}
                  </Link>{' '}
                  {t('go_to_admin_panel_post')}
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
      </div>
      <div className="md:hidden">
        <FooterNav />
      </div>
    </>
  );
}
