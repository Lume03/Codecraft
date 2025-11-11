
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

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = () => {
    if (email === 'admin@gmail.com' && password === 'admin123') {
      // In a real app, you'd set a secure, http-only cookie or token.
      // For this prototype, we'll use localStorage.
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error de acceso',
        description: 'Las credenciales de administrador son incorrectas.',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <header className="absolute top-0 left-0 right-0 mb-8 flex justify-center pt-6">
        <Link href="/" className="flex items-center gap-2">
          <CodeXml className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">RavenCode</span>
        </Link>
      </header>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Panel de Administrador</CardTitle>
          <CardDescription>
            Inicia sesión para gestionar el contenido de los cursos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Iniciar Sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
