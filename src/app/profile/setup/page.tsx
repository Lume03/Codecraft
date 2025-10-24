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
import Link from 'next/link';

export default function ProfileSetupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Completa tu perfil" />
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Un último paso...</CardTitle>
            <CardDescription>
              Configura tu perfil para personalizar tu experiencia de aprendizaje.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de pila</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input id="username" placeholder="johndoe" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="reminders" className="text-base">
                  Recordatorios de aprendizaje
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones diarias para mantener tu racha.
                </p>
              </div>
              <Switch id="reminders" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/learn">Guardar y continuar</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
