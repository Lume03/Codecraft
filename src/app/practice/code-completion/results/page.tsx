
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, RefreshCw, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function PracticeResultsPage() {
  const score = 6; 
  const total = 6;
  const xpEarned = 60;

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Resultados" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <Card>
            <CardHeader className="items-center">
                <Trophy className="h-16 w-16 text-yellow-400" />
                <CardTitle className="text-2xl pt-4">
                    ¡Completaste la práctica!
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-4xl font-bold text-foreground">
                {score} / {total}
              </p>
              
              <div className="text-lg text-muted-foreground">
                <p>Completaste todos los ejercicios.</p>
                <p className="font-bold text-foreground">¡Ganaste {xpEarned} XP!</p>
              </div>

              <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row">
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/practice">
                    Más práctica
                  </Link>
                </Button>
                <Button asChild className="flex-1" style={{ borderRadius: '9999px', boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)' }}>
                  <Link href="/learn">
                    Continuar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
