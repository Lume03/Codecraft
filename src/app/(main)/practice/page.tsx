'use client';

import { Header } from '@/components/header';
import {
  BookCheck,
  ChevronRight,
  CodeXml,
  Puzzle,
  FileCode,
  Flame,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { LivesIndicator } from '@/components/lives-indicator';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { useState, useEffect, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { recalculateLives, MAX_LIVES } from '@/lib/lives';
import { cn } from '@/lib/utils';


const practiceModes = [
  {
    title: 'Quiz',
    subtitle: 'Rápido',
    description: '5 preguntas · 3 min',
    icon: BookCheck,
    href: '/quiz/js-quiz-1',
  },
  {
    title: 'Reto de Código',
    description: 'Dificultad: Fácil',
    icon: CodeXml,
    href: '#',
  },
  {
    title: 'Depuración',
    description: 'Encuentra 3 errores',
    icon: Puzzle,
    href: '#',
  },
  {
    title: 'Completado de código',
    description: 'Arrastra bloques',
    icon: FileCode,
    href: '/practice/code-completion/py-drag-1',
  },
];

const recommendedChallenges = [
  {
    title: 'Tipa correctamente variables en Python',
    meta: 'Python',
    icon: CodeXml,
    href: '#',
  },
  {
    title: 'Completa el bucle "for" en JavaScript',
    meta: 'JavaScript',
    icon: CodeXml,
    href: '#',
  },
];

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

const PracticeTile = ({
  mode,
}: {
  mode: (typeof practiceModes)[0];
}) => (
  <Link
    href={mode.href}
    role="button"
    tabIndex={0}
    aria-label={`Iniciar modo de práctica: ${mode.title}`}
    className="group relative flex h-[112px] min-h-full flex-col justify-between rounded-2xl border border-border bg-secondary p-4 text-foreground transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg focus-visible:scale-[1.02] focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
  >
    <div className="flex items-start gap-3">
      <mode.icon className="h-7 w-7 text-primary" />
      <div className="flex-1">
        <h3 className="text-base font-semibold leading-tight">{mode.title}</h3>
        {mode.subtitle && <p className="text-base font-semibold leading-tight">{mode.subtitle}</p>}
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{mode.description}</p>
  </Link>
);


export default function PracticePage() {
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
    const streak = userProfile?.streak ?? 0;

    useEffect(() => {
        if(userProfile) {
        const recalculated = recalculateLives(userProfile);
        setCurrentLives(recalculated.lives);
        setLastLifeUpdate(recalculated.lastLifeUpdate);
        }
    }, [userProfile]);

  return (
    <div>
      <Header
        title="Practicar"
        action={
            <div className="flex items-center gap-2">
                <StatChip icon={Flame} value={streak} isFlame />
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
      <div className="space-y-4 p-4">
        {/* Main Practice Card */}
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Elige tu práctica</h2>
            <p className="text-muted-foreground">
              Refuerza lo aprendido con ejercicios rápidos y desafíos guiados.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {practiceModes.map((mode) => (
              <PracticeTile key={mode.title} mode={mode} />
            ))}
          </div>
        </div>

        {/* Recommended Challenges Card */}
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <h2 className="mb-4 text-xl font-bold">Desafíos recomendados</h2>
          <div className="space-y-3">
            {recommendedChallenges.map((challenge, index) => (
              <Link
                key={index}
                href={challenge.href}
                role="button"
                tabIndex={0}
                aria-label={`Iniciar desafío: ${challenge.title}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-secondary p-4 transition-transform hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <challenge.icon className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="font-semibold leading-tight">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{challenge.meta}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
          <button className="mt-4 flex h-12 w-full items-center justify-center rounded-full border border-border bg-transparent text-foreground transition-colors hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none">
            Ver historial de práctica
          </button>
        </div>
      </div>
    </div>
  );
}
