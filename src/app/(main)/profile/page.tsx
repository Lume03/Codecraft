'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Flame,
  Moon,
  Sun,
  Edit,
  Languages,
  Bell,
  Trophy,
  BarChart,
  Check,
  BrainCircuit,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { GoalProgress } from '@/components/goal-progress';
import { AchievementBadge } from '@/components/achievement-badge';
import { useTheme } from 'next-themes';
import { useEffect, useState, useMemo } from 'react';
import { useUser } from '@/firebase';
import { placeholderImages } from '@/lib/placeholder-images';
import { LivesIndicator } from '@/components/lives-indicator';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/docs/backend-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/context/language-provider';
import { Progress } from '@/components/ui/progress';
import type { Course, Module } from '@/lib/data';
import { FooterNav } from '@/components/footer-nav';
import { ProfilePageSkeleton } from '@/components/skeletons/profile-page-skeleton';

interface UserStats {
  averageScore: number;
  completedSections: number;
  totalAttempts: number;
}

const QuickActionChip = ({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  href?: string;
}) => {
  const content = (
    <div
      role={onClick ? 'button' : 'link'}
      tabIndex={0}
      aria-label={label}
      className="group inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full border bg-secondary/60 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
    >
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span className="text-xs">{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};



const StatCard = ({
  icon: Icon,
  value,
  label,
  isLoading,
  iconClassName,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  isLoading: boolean;
  iconClassName?: string;
}) => {
  if (isLoading) {
    return (
       <Card className="flex items-center gap-4 p-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      </Card>
    );
  }

  return (
     <Card className="flex items-center gap-4 p-4">
        <Icon className={cn("h-6 w-6", iconClassName)} />
        <div>
            <p className="text-lg font-bold">{value}</p>
            <p className="text-[12px] text-muted-foreground min-h-[2.5em]">{label}</p>
        </div>
     </Card>
  );
};

const StatsDashboard = ({
  stats,
  streak,
  isLoading,
}: {
  stats: UserStats | null;
  streak: number;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="stats-dashboard-title">
      <h2
        id="stats-dashboard-title"
        className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
      >
        {t('statistics_title')}
      </h2>
      <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={BarChart}
          value={`${Math.round(stats?.averageScore ?? 0)}%`}
          label={t('average_score_label')}
          isLoading={isLoading}
          iconClassName="text-blue-500"
        />
        <StatCard
          icon={Check}
          value={stats?.completedSections ?? 0}
          label={t('completed_sections_label')}
          isLoading={isLoading}
          iconClassName="text-green-500"
        />
        <StatCard
          icon={BrainCircuit}
          value={stats?.totalAttempts ?? 0}
          label={t('total_attempts_label')}
          isLoading={isLoading}
          iconClassName="text-primary"
        />
        <StatCard
          icon={Flame}
          value={`${streak} ${t('days')}`}
          label={t('consistency_label')}
          isLoading={isLoading}
          iconClassName={cn(streak > 0 ? "text-orange-500" : "text-muted-foreground")}
        />
      </div>
    </section>
  );
};

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const user = useUser();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { language, setLanguage, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);

  useEffect(() => {
    if (user?.uid) {
      setLoading(true);
      const fetchUserProfile = async () => {
        try {
          const res = await fetch(`/api/users?firebaseUid=${user.uid}`);
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
          } else if (res.status === 404) {
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
        } finally {
            setLoading(false);
        }
      };
      fetchUserProfile();
    } else if (user === null) {
        setLoading(false);
        setUserProfile(null);
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      setStatsLoading(true);
      const fetchStats = async () => {
        try {
          const res = await fetch(`/api/users/${user.uid}/stats`);
          if (!res.ok) throw new Error('Failed to fetch stats');
          const data = await res.json();
          setStats(data);
        } catch (error) {
          console.error(error);
          setStats(null);
        } finally {
          setStatsLoading(false);
        }
      };
      fetchStats();
    }
  }, [user?.uid]);
  
  // Fetch all courses and modules for progress calculation
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const coursesRes = await fetch('/api/courses');
        const coursesData: Course[] = await coursesRes.json();
        setAllCourses(coursesData);

        const modulesPromises = coursesData.map(course => 
          fetch(`/api/courses/${course.id}/modules`).then(res => res.json())
        );
        const modulesDataArrays: Module[][] = await Promise.all(modulesPromises);
        setAllModules(modulesDataArrays.flat());

      } catch (error) {
        console.error("Failed to fetch all course data for progress calc:", error);
      }
    };
    fetchCourseData();
  }, []);

  const goals = [
    {
      title: t('streak_goal_3'),
      target: 3,
      icon: Flame,
    },
    {
      title: t('streak_goal_7'),
      target: 7,
      icon: Flame,
    },
    {
      title: t('streak_goal_10'),
      target: 10,
      icon: Flame,
    },
  ];

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const handleLanguageSave = () => {
    setLanguage(currentLanguage as 'es' | 'en');
  };

  const streak = userProfile?.streak ?? 0;
  const achievements = userProfile?.achievements ?? [];
  const level = userProfile?.level ?? 1;

  const overallProgress = useMemo(() => {
    if (!userProfile?.progress || allModules.length === 0) return 0;
    
    const totalPossibleLessons = allModules.length;
    
    const totalCompletedLessons = Object.values(userProfile.progress).reduce(
      (sum, course) => sum + (course.completedLessons?.length ?? 0),
      0
    );

    if (totalPossibleLessons === 0) return 0;
    
    return Math.round((totalCompletedLessons / totalPossibleLessons) * 100);

  }, [userProfile?.progress, allModules]);

  if (loading) {
    return <ProfilePageSkeleton />;
  }
  
  const currentLives = userProfile?.lives ?? 0;
  const lastLifeUpdate = userProfile?.lastLifeUpdate ? new Date(userProfile.lastLifeUpdate) : null;
  const userAvatar = placeholderImages.find((p) => p.id === 'user-avatar');
  const avatarSrc = userProfile?.photoURL || user?.photoURL || userAvatar?.imageUrl;
    
  const languageMap = {
    es: t('language_es'),
    en: t('language_en'),
    pt: t('language_pt'),
    zh: t('language_zh'),
  };

  return (
    <>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm md:h-16 md:px-6">
          <div className="mx-auto flex w-full max-w-[420px] items-center justify-end md:max-w-[720px] xl:max-w-[960px]">
            <div className="flex items-center gap-2">
              <LivesIndicator
                lives={currentLives}
                lastLifeUpdate={lastLifeUpdate}
              />
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings" aria-label={t('settings')}>
                      <Settings className="h-5 w-5" />
                  </Link>
              </Button>
            </div>
          </div>
        </header>

        <main
          className="mx-auto w-full max-w-[420px] flex-1 space-y-8 px-4 pb-28 md:max-w-[720px] md:space-y-10 md:px-6 md:pb-8"
          role="main"
        >
          {/* Profile Header */}
          <section
            aria-labelledby="profile-header"
            className="flex items-center gap-4 pt-4 md:gap-5"
          >
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage
                src={avatarSrc}
                alt={t('profile_desc')}
              />
              <AvatarFallback>
                {userProfile?.displayName?.charAt(0) ??
                  user?.displayName?.charAt(0) ??
                  'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h1 id="profile-header" className="text-xl font-bold">
                  {userProfile?.displayName ?? user?.displayName ?? 'New User'}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  asChild
                  aria-label={t('edit_profile')}
                >
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                @{userProfile?.username ?? 'new.user'}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                <div
                  className="inline-flex items-center text-sm font-semibold"
                  role="status"
                  aria-label={t('level', { level })}
                >
                  {t('level', { level })}
                </div>
                <div
                  className="inline-flex items-center text-sm font-semibold"
                  role="status"
                  aria-label={t('achievements_count', { count: achievements.length })}
                >
                  {t('achievements_count', { count: achievements.length })}
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <nav
            aria-label={t('quick_actions')}
            className="flex items-center gap-2"
          >
            <QuickActionChip
              icon={theme === 'dark' ? Moon : Sun}
              label={t('theme')}
              onClick={toggleTheme}
            />
            <Dialog>
              <DialogTrigger asChild>
                  <div>
                    <QuickActionChip icon={Languages} label={t('language')} />
                  </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('select_language')}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <RadioGroup value={currentLanguage} onValueChange={(val) => setCurrentLanguage(val as 'es' | 'en' | 'pt' | 'zh')} className="space-y-2">
                    <div className="flex items-center space-x-2 rounded-md border p-4">
                      <RadioGroupItem value="es" id="lang-es" />
                      <Label htmlFor="lang-es" className="flex-1 cursor-pointer">{languageMap.es}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-4">
                      <RadioGroupItem value="en" id="lang-en" />
                      <Label htmlFor="lang-en" className="flex-1 cursor-pointer">{languageMap.en}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-4 opacity-50">
                      <RadioGroupItem value="pt" id="lang-pt" disabled />
                      <Label htmlFor="lang-pt" className="flex-1 cursor-not-allowed">{languageMap.pt}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-4 opacity-50">
                      <RadioGroupItem value="zh" id="lang-zh" disabled />
                      <Label htmlFor="lang-zh" className="flex-1 cursor-not-allowed">{languageMap.zh}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                      <Button onClick={handleLanguageSave}>{t('save')}</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <QuickActionChip
              icon={Bell}
              label={t('notifications')}
              href="/settings"
            />
          </nav>

          {/* Stats Dashboard */}
          <StatsDashboard
            stats={stats}
            streak={streak}
            isLoading={statsLoading}
          />

          {/* Course Progress Card */}
          <Card>
            <CardContent className="p-4 md:p-5">
              <h2
                id="course-progress-title"
                className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground"
              >
                {t('overall_progress_title')}
              </h2>
              <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t('total_progress_label')}</span>
                      <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" aria-label={`${t('total_progress_label')}: ${overallProgress}%`} />
              </div>
              {overallProgress === 0 && !loading && (
                <p
                  className="mt-3 text-center text-sm text-muted-foreground"
                  aria-live="polite"
                >
                  {t('complete_first_lesson_prompt')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Goals and Achievements */}
          <section aria-labelledby="goals-title" className="space-y-4">
            <h2
              id="goals-title"
              className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
            >
              {t('goals_achievements_title')}
            </h2>
            <div className="space-y-3 rounded-2xl border bg-card p-2">
              {goals.map((goal) => (
                <GoalProgress
                  key={goal.target}
                  icon={goal.icon}
                  title={goal.title}
                  currentValue={streak}
                  targetValue={goal.target}
                />
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 md:gap-3">
                {achievements.slice(0, 3).map((ach: string) => (
                  <AchievementBadge key={ach} icon={Trophy} label={ach} />
                ))}
                {achievements.length > 3 && (
                  <div
                    className="flex h-8 items-center justify-center rounded-full border border-dashed border-border bg-secondary px-3 text-xs font-semibold text-muted-foreground"
                    aria-label={t('more_achievements', { count: achievements.length - 3 })}
                  >
                    {t('more_achievements', { count: achievements.length - 3 })}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="h-11 w-full justify-center rounded-full border-border hover:bg-secondary md:h-12"
              >
                {t('view_all_achievements')}
              </Button>
            </div>
          </section>
        </main>
      </div>
      <div className="md:hidden">
        <FooterNav />
      </div>
    </>
  );
}
