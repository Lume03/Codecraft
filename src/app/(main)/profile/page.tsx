'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Flame,
  Moon,
  Sun,
  PenSquare,
  Settings,
  Bell,
  Trophy,
  CodeXml,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { GoalProgress } from '@/components/goal-progress';
import { AchievementBadge } from '@/components/achievement-badge';
import { useTheme } from 'next-themes';
import { useEffect, useState, useMemo } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { placeholderImages } from '@/lib/placeholder-images';
import { doc } from 'firebase/firestore';
import { recalculateLives, MAX_LIVES } from '@/lib/lives';
import { LivesIndicator } from '@/components/lives-indicator';

const QuickActionChip = ({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}) => {
  const content = (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Action: ${label}`}
      className="group flex h-9 items-center justify-center gap-2 rounded-full border bg-secondary/60 px-4 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
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

  const goals = [
    {
      title: 'Practicar 3 días seguidos',
      target: 3,
      icon: Flame,
    },
    {
      title: 'Practicar 7 días seguidos',
      target: 7,
      icon: Flame,
    },
    {
      title: 'Practicar 10 días seguidos',
      target: 10,
      icon: Flame,
    },
  ];
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const streak = userProfile?.streak ?? 0;
  const achievements = userProfile?.achievements ?? [];
  const level = userProfile?.level ?? 1;

  const overallProgress = useMemo(() => {
    if (!userProfile?.progress) return 0;

    const coursesProgress = Object.values(userProfile.progress);
    if (coursesProgress.length === 0) return 0;
    
    // Asumimos 10 lecciones por curso para el cálculo
    const totalPossibleLessons = coursesProgress.length * 10;
    const totalCompletedLessons = coursesProgress.reduce((sum, course) => sum + (course.completedLessons?.length ?? 0), 0);
    
    if (totalPossibleLessons === 0) return 0;
    
    return Math.round((totalCompletedLessons / totalPossibleLessons) * 100);
  }, [userProfile?.progress]);


  if (!mounted) {
    return null; 
  }
  
  const userAvatar = placeholderImages.find(p => p.id === 'user-avatar');
  const avatarSrc = userProfile?.photoURL || user?.photoURL || userAvatar?.imageUrl;

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm md:h-16 md:px-6">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-between md:max-w-[720px] xl:max-w-[960px]">
          <Link href="/learn" className="flex items-center gap-2 font-bold">
            <CodeXml className="h-7 w-7 text-primary" />
            <span className="text-xl">RavenCode</span>
          </Link>
          <div className="flex items-center gap-2">
             <LivesIndicator lives={currentLives} lastLifeUpdate={lastLifeUpdate} />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Ajustes</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[420px] flex-1 space-y-8 px-4 pb-28 md:max-w-[720px] md:space-y-10 md:px-6 md:pb-32">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pt-4 md:gap-5">
            <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={avatarSrc} alt={userProfile?.displayName ?? user?.displayName ?? 'User avatar'} />
                <AvatarFallback>{userProfile?.displayName?.charAt(0) ?? user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className='flex items-center gap-2'>
                    <h1 className="text-xl font-bold">{userProfile?.displayName ?? user?.displayName ?? 'New User'}</h1>
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link href="/profile/edit"><Edit className="h-4 w-4" /></Link>
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">@{userProfile?.username ?? 'new.user'}</p>
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <div className="inline-flex items-center text-sm font-semibold">
                        Nivel {level}
                    </div>
                    <div className="inline-flex items-center text-sm font-semibold">
                        {achievements.length} Logros
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <QuickActionChip 
              icon={theme === 'dark' ? Moon : Sun} 
              label={theme === 'dark' ? 'Oscuro' : 'Claro'}
              onClick={toggleTheme} 
            />
            <QuickActionChip icon={Settings} label="Ajustes" href="/settings" />
            <QuickActionChip icon={Bell} label="Notificaciones" href="/settings" />
        </div>


        {/* Course Progress Card */}
        <div className="space-y-4">
           <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progreso de Curso</h2>
            <div className="rounded-2xl border bg-card p-4 md:p-5">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>General</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="mt-2 h-1.5" />
                </div>
                {overallProgress === 0 && (
                    <p className="mt-3 text-center text-sm text-muted-foreground">¡Completa tu primera lección para ver tu progreso!</p>
                )}
            </div>
        </div>
        
        {/* Goals and Achievements */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Metas y Logros</h2>
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
                 <div className="flex h-8 items-center justify-center rounded-full border border-dashed border-border bg-secondary px-3 text-xs font-semibold text-muted-foreground">
                    +{achievements.length - 3} más
                </div>
              )}
            </div>
            <Button variant="outline" className="h-11 w-full justify-center rounded-full border-border hover:bg-secondary md:h-12">
              Ver todos los logros
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
