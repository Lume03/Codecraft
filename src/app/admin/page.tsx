'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CodeXml } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/context/language-provider';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogin = () => {
    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: t('login_error_title'),
        description: t('login_error_desc'),
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <header className="absolute top-0 left-0 right-0 mb-8 flex justify-center pt-6">
        <Link href="/" className="flex items-center gap-2" aria-label={`Ir a la página de inicio de ${t('app_title')}`}>
          <CodeXml className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">{t('app_title')}</span>
        </Link>
      </header>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('admin_login_title')}</CardTitle>
          <CardDescription>
            {t('admin_login_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('admin_login_email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            {t('sign_in')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
