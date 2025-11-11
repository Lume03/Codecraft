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
import { useUser, useFirestore, useDoc } from '@/firebase/client-provider';
import { placeholderImages } from '@/lib/placeholder-images';
import { doc, setDoc } from 'firebase/firestore';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfileEditPage() {
  const user = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef =
    user && firestore ? doc(firestore, `users/${user.uid}`) : null;
  const { data: userProfile } = useDoc(userProfileRef);

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setUsername(userProfile.username || '');
    } else if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [userProfile, user]);

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Editar Perfil" showBackButton />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Actualiza tu información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage
                    src={user?.photoURL ?? userAvatar?.imageUrl}
                    alt={user?.displayName ?? 'User avatar'}
                  />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Cambiar foto</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSaveChanges}>
              Guardar cambios
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
