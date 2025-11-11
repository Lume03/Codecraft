'use client';

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
import { CodeXml, Github, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function GoogleIcon() {
  return (
    <svg
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

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 md:p-6">
      <header className="mb-8 flex justify-center pt-6">
        <Link href="/" className="flex items-center gap-2">
          <CodeXml className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">RavenCode</span>
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-start text-center">
        <div className="w-full max-w-sm space-y-4">
          {isLogin ? (
            <>
              <h1 className="text-3xl font-bold">Inicia sesión</h1>
              <p className="text-muted-foreground">
                Vuelve a tu camino de aprendizaje y continúa tu racha.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Crear tu cuenta</h1>
              <p className="text-muted-foreground px-4">
                Completa tu perfil para personalizar tu aprendizaje.
              </p>
            </>
          )}

          <Card className="text-left">
            <CardContent className="space-y-4 pt-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullname">Nombre completo</Label>
                  <Input id="fullname" placeholder="Alonso Luque" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alonso@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  {isLogin && (
                    <Link
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Ocultar' : 'Mostrar'} contraseña
                    </span>
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label>Fecha de nacimiento</Label>
                    <p className="text-xs text-muted-foreground">
                      Usaremos tu fecha para adaptar el contenido y proteger tu
                      privacidad.
                    </p>
                    <div className="flex gap-2">
                      <Input id="dd" placeholder="DD" className="text-center" />
                      <Input id="mm" placeholder="MM" className="text-center" />
                      <Input
                        id="aaaa"
                        placeholder="AAAA"
                        className="text-center"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="reminders">Recordatorios diarios</Label>
                    <Switch id="reminders" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor="contrast-mode">
                      Modo accesible (alto contraste)
                    </Label>
                    <Switch id="contrast-mode" />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button
                className="w-full"
                asChild
                size="lg"
                style={{
                  borderRadius: '9999px',
                  boxShadow: '0 0 20px 0 hsl(var(--primary) / 0.5)',
                }}
              >
                <Link href={isLogin ? '/learn' : '/learn'}>
                  {isLogin ? 'Entrar' : 'Verificar y continuar'}
                </Link>
              </Button>
              {!isLogin && (
                <Button variant="ghost" className="w-full">
                  Volver
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                o {isLogin ? 'continúa con' : 'crea una cuenta con'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <GoogleIcon /> <span className="ml-2">Google</span>
            </Button>
            <Button variant="outline">
              <Github /> <span className="ml-2">GitHub</span>
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            {isLogin ? '¿Nuevo en RavenCode?' : '¿Ya tienes una cuenta?'}
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary"
            >
              {isLogin ? 'Crear cuenta' : 'Inicia sesión'}
            </Button>
          </div>

          <p className="px-8 text-center text-xs text-muted-foreground">
            Al continuar, aceptas los Términos y la Política de privacidad.
          </p>
        </div>
      </main>
    </div>
  );
}
