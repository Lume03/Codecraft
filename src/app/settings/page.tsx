
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Header } from '@/components/header';
import {
  Sun,
  Moon,
  Languages,
  Bell,
  Mail,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  BookOpen,
  CalendarClock,
  Type,
} from 'lucide-react';
import { SettingsSection } from '@/components/settings/settings-section';
import { SettingsRow } from '@/components/settings/settings-row';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [didacticMode, setDidacticMode] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState('es');
  const [reminderTime, setReminderTime] = useState('19:00');
  const [tempHour, setTempHour] = useState('19');
  const [tempMinute, setTempMinute] = useState('00');

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(savedLanguage);
    setIsDarkTheme(theme === 'dark');
  }, [theme]);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    setIsDarkTheme(checked);
  };
  
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/auth');
    }
  };

  const handleSaveReminder = () => {
    setReminderTime(`${tempHour}:${tempMinute}`);
  };
  
  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Ajustes" showBackButton />
      <main className="mx-auto w-full max-w-[420px] flex-1 space-y-4 px-4 pb-28 md:max-w-[720px] md:space-y-6 md:px-6 md:pb-32">
        <SettingsSection title="General">
          <SettingsRow
            icon={isDarkTheme ? Moon : Sun}
            title="Tema"
            subtitle={isDarkTheme ? 'Oscuro' : 'Claro'}
            trailing={{ type: 'toggle', checked: isDarkTheme, onCheckedChange: handleThemeChange }}
          />
           <Dialog>
            <DialogTrigger asChild>
              <div>
                <SettingsRow
                    icon={Type}
                    title="Tamaño de fuente"
                    subtitle="Base 15px · Equilibrio entre legibilidad y contenido"
                    trailing={{ type: 'text', value: 'Medio' }}
                    isButton
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selecciona un tamaño de fuente</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup defaultValue="md" className="space-y-2">
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="sm" id="font-sm" />
                    <Label htmlFor="font-sm" className="flex-1 cursor-pointer">Pequeño</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="md" id="font-md" />
                    <Label htmlFor="font-md" className="flex-1 cursor-pointer">Medio</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="lg" id="font-lg" />
                    <Label htmlFor="font-lg" className="flex-1 cursor-pointer">Grande</Label>
                  </div>
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>
           <Dialog>
            <DialogTrigger asChild>
              <div>
                <SettingsRow
                    icon={Languages}
                    title="Idioma"
                    subtitle="Español"
                    trailing={{ type: 'text', value: 'Cambiar' }}
                    isButton
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selecciona un idioma</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup defaultValue="es" className="space-y-2">
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="es" id="lang-es" />
                    <Label htmlFor="lang-es" className="flex-1 cursor-pointer">Español</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="en" id="lang-en" />
                    <Label htmlFor="lang-en" className="flex-1 cursor-pointer">Inglés</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="pt" id="lang-pt" />
                    <Label htmlFor="lang-pt" className="flex-1 cursor-pointer">Portugués</Label>
                  </div>
                   <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="zh" id="lang-zh" />
                    <Label htmlFor="lang-zh" className="flex-1 cursor-pointer">Chino</Label>
                  </div>
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>
        </SettingsSection>

        <SettingsSection title="Aprendizaje">
          <SettingsRow
            icon={Sparkles}
            title="Modo didáctico"
            subtitle="Explicaciones extendidas y ejemplos paso a paso"
            trailing={{ type: 'toggle', checked: didacticMode, onCheckedChange: setDidacticMode }}
          />
          <SettingsRow
            icon={BookOpen}
            title="Reto diario"
            subtitle="Recibe un ejercicio cada día para mantener el hábito"
            trailing={{ type: 'toggle', checked: dailyChallenge, onCheckedChange: setDailyChallenge }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <SettingsRow
                  icon={CalendarClock}
                  title="Recordatorios"
                  subtitle="Programa tu hora ideal para estudiar"
                  trailing={{ type: 'text', value: reminderTime }}
                  isButton
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar recordatorio</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Hora</Label>
                  <Select value={tempHour} onValueChange={setTempHour}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={String(i).padStart(2, '0')}>
                          {String(i).padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Minuto</Label>
                   <Select value={tempMinute} onValueChange={setTempMinute}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['00', '15', '30', '45'].map((min) => (
                        <SelectItem key={min} value={min}>
                          {min}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleSaveReminder}>Guardar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SettingsSection>

        <SettingsSection title="Notificaciones">
          <SettingsRow
            icon={Bell}
            title="Push"
            subtitle="Progreso, retos y recordatorios"
            trailing={{ type: 'toggle', checked: pushNotifications, onCheckedChange: setPushNotifications }}
          />
          <SettingsRow
            icon={Mail}
            title="Correo"
            subtitle="Resumen semanal de aprendizaje"
            trailing={{ type: 'toggle', checked: emailNotifications, onCheckedChange: setEmailNotifications }}
          />
        </SettingsSection>

        <SettingsSection title="Cuenta">
          <SettingsRow
            icon={User}
            title="Perfil"
            subtitle="Nombre, nivel, XP y logros"
            trailing={{ type: 'chevron' }}
            href="/profile"
          />
          <SettingsRow
            icon={ShieldCheck}
            title="Privacidad"
            subtitle="Controla datos y permisos"
            trailing={{ type: 'text', value: 'Gestionar' }}
            isButton
          />
          <SettingsRow
            icon={LogOut}
            title="Cerrar sesión"
            subtitle="Desvincula este dispositivo"
            onClick={handleLogout}
            isButton={true}
          />
        </SettingsSection>
      </main>
    </div>
  );
}
