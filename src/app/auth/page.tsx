'use client';

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
import { Switch } from '@/components/ui/switch';
import { CodeXml, Github, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  User,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/language-provider';

function GoogleIcon() {
  return (
    <svg
      role="img"
      aria-label="Google icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.301-11.303-8H24v-8H4.239C4.091,22.659,4,23.32,4,24C4,35.045,12.955,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.494,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  useEffect(() => {
    if(auth) {
      setIsFirebaseReady(true);
    }
  }, [auth])

 const upsertUserDocument = async (user: User) => {
    try {
      // Primero, verificamos si el usuario ya existe en nuestra BD de MongoDB
      const existingUserRes = await fetch(`/api/users?firebaseUid=${user.uid}`);
      let userExists = existingUserRes.ok;
      let existingUserData = userExists ? await existingUserRes.json() : null;

      // Preparamos los datos básicos a enviar
      const mongoData: any = {
          firebaseUid: user.uid,
          email: user.email,
          displayName: user.displayName || fullname || 'Nuevo Usuario',
          username: fullname.replace(/\s+/g, '.').toLowerCase() || user.email?.split('@')[0],
      };

      // Lógica para guardar la foto solo si es necesario
      if (user.photoURL) {
          // Si el usuario existe y no tiene foto en la BD, la añadimos.
          // O si el usuario es nuevo, la añadimos también.
          if ((userExists && !existingUserData.photoURL) || !userExists) {
              mongoData.photoURL = user.photoURL;
          }
      }

      await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mongoData),
      });

      return { isNewUser: !userExists };

    } catch (error) {
      console.error("Failed to create/update user document in MongoDB:", error);
      toast({
        variant: 'destructive',
        title: t('account_error'),
        description: t('account_error_desc'),
      });
      // Retornar un estado que no cause problemas
      return { isNewUser: false };
    }
  }


  const handleAuthAction = async () => {
    if (!auth) return;
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        // NO llamar a upsertUserDocument aquí para evitar sobrescribir los datos
        router.push('/learn');
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { isNewUser } = await upsertUserDocument(userCredential.user);
        if (isNewUser) {
           router.push('/profile/setup');
        } else {
           router.push('/learn');
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth_error'),
        description: error.message,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { isNewUser } = await upsertUserDocument(result.user);
      
      if (isNewUser) {
        router.push('/profile/setup');
      } else {
        router.push('/learn');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('google_error'),
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 md:p-6">
      <header className="mb-8 flex justify-center pt-6">
        <Link href="/" className="flex items-center gap-2" aria-label={`Ir a la página de inicio de ${t('app_title')}`}>
          <CodeXml className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">{t('app_title')}</span>
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-start text-center">
        <div className="w-full max-w-sm space-y-4">
          {isLogin ? (
            <>
              <h1 className="text-3xl font-bold">{t('sign_in')}</h1>
              <p className="text-muted-foreground">
                {t('sign_in_subtitle')}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{t('create_account')}</h1>
              <p className="text-muted-foreground px-4">
                {t('create_account_subtitle')}
              </p>
            </>
          )}

          <Card className="text-left">
            <CardContent className="space-y-4 pt-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullname">{t('full_name')}</Label>
                  <Input
                    id="fullname"
                    placeholder={t('full_name_placeholder')}
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('password')}</Label>
                  {isLogin && (
                    <Link
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      {t('forgot_password')}
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label>{t('date_of_birth')}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t('date_of_birth_desc')}
                    </p>
                    <div className="flex gap-2">
                      <Input id="dd" placeholder={t('dd')} className="text-center" aria-label="Día de nacimiento" />
                      <Input id="mm" placeholder={t('mm')} className="text-center" aria-label="Mes de nacimiento" />
                      <Input
                        id="aaaa"
                        placeholder={t('yyyy')}
                        className="text-center"
                        aria-label="Año de nacimiento"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="reminders" className="cursor-pointer">{t('daily_reminders')}</Label>
                    <Switch id="reminders" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="contrast-mode" className="cursor-pointer">
                      {t('contrast_mode')}
                    </Label>
                    <Switch id="contrast-mode" />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button
                className="w-full"
                onClick={handleAuthAction}
                disabled={!isFirebaseReady}
                size="lg"
                style={{
                  borderRadius: '9999px',
                  boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)',
                }}
              >
                {!isFirebaseReady ? t('loading') : isLogin ? t('enter') : t('verify_and_continue')}
              </Button>
              {!isLogin && (
                <Button variant="ghost" className="w-full" onClick={() => setIsLogin(true)}>
                  {t('back')}
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="relative w-full" role="separator">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {isLogin ? t('or_continue_with') : t('or_create_with')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={!isFirebaseReady}>
              <GoogleIcon /> <span className="ml-2">Google</span>
            </Button>
            <Button variant="outline" disabled={!isFirebaseReady}>
              <Github /> <span className="ml-2">GitHub</span>
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            {isLogin ? t('new_to_ravencode') : t('already_have_account')}
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary"
            >
              {isLogin ? t('create_account') : t('sign_in')}
            </Button>
          </div>

          <p className="px-8 text-center text-xs text-muted-foreground">
            {t('terms_policy')}
          </p>
        </div>
      </main>
    </div>
  );
}
