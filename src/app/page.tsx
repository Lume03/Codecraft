import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CodeXml } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-card">
            <CodeXml className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
            CodeCraft
          </h1>
          <p className="max-w-xs text-lg text-muted-foreground">
            Aprende a programar de forma práctica
          </p>
        </div>
      </main>
      <footer className="w-full p-8">
        <Button asChild size="lg" className="w-full max-w-md mx-auto" style={{
          borderRadius: '9999px', 
          boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)',
        }}>
          <Link href="/auth">Empezar</Link>
        </Button>
      </footer>
    </div>
  );
}
