'use client';

import { Header } from '@/components/header';
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
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/firebase';
import { useTranslation } from '@/context/language-provider';

export default function ProfileSetupPage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [reminders, setReminders] = useState(true);
  const router = useRouter();
  const user = useUser();
  const { t } = useTranslation();

  const handleSave = async () => {
    if (user) {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firebaseUid: user.uid,
                displayName,
                username,
                email: user.email,
                photoURL: user.photoURL,
                reminders,
            }),
        });
      router.push('/learn');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={t('complete_your_profile')} />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>{t('one_last_step')}</CardTitle>
            <CardDescription>
              {t('profile_setup_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('full_name')}</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">{t('username_placeholder')}</Label>
              <Input
                id="username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="reminders" className="text-base">
                  {t('learning_reminders')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('learning_reminders_desc')}
                </p>
              </div>
              <Switch
                id="reminders"
                checked={reminders}
                onCheckedChange={setReminders}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSave}>
              {t('save_and_continue')}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
