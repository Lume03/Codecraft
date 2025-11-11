'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { courses } from '@/lib/data.tsx';
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
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { GoalProgress } from '@/components/goal-progress';
import { AchievementBadge } from '@/components/achievement-badge';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { placeholderImages } from '@/lib/placeholder-images';
import { doc } from 'firebase/firestore';

const QuickSettingTile = ({
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
      className="group flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border bg-secondary/60 transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:h-28 md:w-28"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <Icon className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-foreground" />
      <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        {label}
      </span>
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
  const userProfileRef =
    user && firestore ? doc(firestore, `users/${user.uid}`) : null;
  const { data: userProfile } = useDoc(userProfileRef);

  const currentCourse = courses[0]; // Example: current course is Python
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

  if (!mounted) {
    return null; 
  }
  
  const userAvatar = placeholderImages.find(p => p.id === 'user-avatar');

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-secondary px-4 md:h-16 md:px-6">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-between md:max-w-[720px] xl:max-w-[960px]">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <CodeXml className="h-7 w-7 text-primary" />
            <span className="text-xl">RavenCode</span>
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Ajustes</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[420px] flex-1 space-y-4 px-4 pb-28 md:max-w-[720px] md:space-y-6 md:px-6 md:pb-32 xl:max-w-[960px]">
        {/* Profile Card */}
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 md:gap-5 md:p-6 lg:p-6">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage
              src={userProfile?.photoURL ?? user?.photoURL ?? userAvatar?.imageUrl}
              alt={userProfile?.displayName ?? user?.displayName ?? 'User avatar'}
            />
            <AvatarFallback>{userProfile?.displayName?.charAt(0) ?? user?.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-xl font-bold leading-tight">{userProfile?.displayName ?? user?.displayName ?? 'New User'}</h1>
              <p className="text-sm leading-relaxed text-muted-foreground">@{userProfile?.username ?? 'new.user'}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                Nivel {userProfile?.level ?? 1}
              </div>
              <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                {userProfile?.xp ?? 0} XP
              </div>
              <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                {achievements.length} Logros
              </div>
            </div>
          </div>
        </div>

        {/* Course Progress Card */}
        <div className="space-y-3 rounded-2xl border bg-card p-4 md:space-y-4 md:p-5 lg:p-6">
          <h2 className="text-lg font-semibold leading-tight">Progreso de curso</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>General</span>
                <span>{currentCourse.progress}%</span>
              </div>
              <Progress value={currentCourse.progress} className="mt-1 h-2" />
            </div>
            <Link
              href={`/course/${currentCourse.id}`}
              className="flex items-center justify-between gap-3 rounded-lg bg-secondary p-3 transition-colors hover:bg-secondary/70"
            >
              <div className="flex items-center gap-3">
                <currentCourse.icon className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-tight">{currentCourse.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Continúa en la lección 2...
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
        
        {/* Quick Settings */}
        <div className="grid grid-cols-3 justify-items-center gap-3 text-center md:gap-4">
            <QuickSettingTile 
              icon={theme === 'dark' ? Moon : Sun} 
              label="Tema" 
              onClick={toggleTheme} 
            />
            <QuickSettingTile icon={PenSquare} label="Editar Perfil" href="/profile/edit" />
            <QuickSettingTile icon={Bell} label="Notificaciones" href="/settings" />
        </div>

        {/* Goals and Achievements */}
        <div className="space-y-4 rounded-2xl border bg-card p-4 md:space-y-5 md:p-5 lg:p-6">
          <h2 className="text-lg font-semibold leading-tight">Metas y logros</h2>
          <div className="space-y-4">
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
            <Button variant="ghost" className="h-11 w-full justify-center rounded-full border border-border hover:bg-secondary md:h-12">
              Ver todos los logros
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
