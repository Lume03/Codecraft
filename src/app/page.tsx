'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CodeXml } from 'lucide-react';
import { useTranslation } from '@/context/language-provider';

export default function OnboardingPage() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-card">
            <CodeXml className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
            {t('app_title')}
          </h1>
          <p className="max-w-xs text-lg text-muted-foreground">
            {t('app_subtitle')}
          </p>
        </div>
      </main>
      <footer className="w-full p-8">
        <div className="mx-auto flex max-w-md flex-col gap-4">
          <Button
            asChild
            size="lg"
            className="w-full"
            style={{
              borderRadius: '9999px',
              boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)',
            }}
          >
            <Link href="/auth">{t('get_started')}</Link>
          </Button>
          <Button asChild variant="link" size="sm">
            <Link href="/admin">{t('admin_access')}</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
