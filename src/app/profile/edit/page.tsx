'use client';

import { Header } from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { placeholderImages } from '@/lib/placeholder-images';
import { doc, setDoc } from 'firebase/firestore';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/context/language-provider';

export default function ProfileEditPage() {
  const user = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { t } = useTranslation();

  const userProfileRef =
    user && firestore ? doc(firestore, `users/${user.uid}`) : null;
  const { data: userProfile, loading } = useDoc(userProfileRef);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setUsername(userProfile.username || '');
    } else if (user && !loading && !userProfile) {
      setDisplayName(user.displayName || '');
    }
  }, [userProfile, user, loading]);

  const handleSaveChanges = async () => {
    if (userProfileRef) {
      await setDoc(
        userProfileRef,
        {
          displayName: displayName,
          username: username,
        },
        { merge: true }
      );
      router.push('/profile');
    }
  };
  
  const userAvatar = placeholderImages.find(p => p.id === 'user-avatar');
  const avatarSrc = userProfile?.photoURL || user?.photoURL || userAvatar?.imageUrl;

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={t('edit_profile_title')} showBackButton />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>{t('update_your_info')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage
                    src={avatarSrc}
                    alt={t('profile_desc')}
                  />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  aria-label={t('change_photo')}
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">{t('change_photo')}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t('full_name')}</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('display_name_placeholder')}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">{t('username_placeholder')}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('username_placeholder')}
                autoComplete="username"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSaveChanges}>
              {t('save_changes')}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
